# Two-Stage Decision 任务数据保存说明

## 任务概述
Two-Stage Decision任务是基于强化学习的决策制定范式，用于研究基于模型的学习与基于习惯的学习之间的平衡。被试在两个阶段连续做出决策来获得奖励，第一阶段选择概率性地决定进入哪个第二阶段，第二阶段选择决定获得奖励的可能性。

## 数据保存机制

### 技术架构
- **实验框架**: jsPsych 实验心理学框架
- **核心插件**: poldrack-single-stim 插件，支持动态刺激生成
- **辅助插件**: call-function（阶段转换）、survey-text（问卷）
- **数学库**: 内置正态分布随机数生成器

### 任务设计

#### 实验结构
- **练习阶段**: 50个试验，学习任务规则
- **测试阶段**: 200个试验，分两个区块
- **休息节点**: 测试中期插入休息
- **注意检查**: 各阶段插入注意力监控

#### 刺激系统
- **第一阶段**: 2个抽象图形，每个试验随机左右呈现
- **第二阶段**: 4个抽象图形，分为两个阶段（2a和2b）
- **背景颜色**: 每个阶段有独特的背景颜色
- **图形资源**: 练习和测试使用不同的图形集

### 保存的数据字段

#### 第一阶段数据
```javascript
{
    trial_id: "first_stage",              // 第一阶段试验标识
    exp_stage: "practice|test",           // 实验阶段
    trial_num: 0,                         // 试验编号
    stage: 0,                             // 阶段编号（第一阶段=0）
    stim_order: [0, 1],                   // 刺激呈现顺序
    stim_selected: 0,                     // 选择的刺激ID
    key_press: 37|39,                     // 按键（左右箭头）
    rt: 1234                              // 反应时间（毫秒）
}
```

#### 第二阶段数据
```javascript
{
    trial_id: "second_stage",             // 第二阶段试验标识
    exp_stage: "practice|test",           // 实验阶段
    trial_num: 0,                         // 试验编号
    stage: 1|2,                           // 阶段编号（2a=1, 2b=2）
    stage_transition: "frequent|infrequent", // 转移类型
    stim_order: [2, 3],                   // 刺激呈现顺序
    stim_selected: 2,                     // 选择的刺激ID
    key_press: 37|39,                     // 按键反应
    rt: 1456                              // 反应时间
}
```

#### 反馈与奖励数据
```javascript
{
    trial_id: "feedback_stage",           // 反馈阶段标识
    feedback: 1|0,                        // 获得奖励（1）或未获得（0）
    FB_probs: [0.65, 0.35, 0.75, 0.25],  // 当前奖励概率矩阵
    trial_num: 0,                         // 试验编号
    exp_stage: "practice|test"            // 实验阶段
}
```

### 转移概率机制

#### 第一阶段到第二阶段转移
```javascript
// 70%概率进入关联的第二阶段，30%概率进入另一个
stage = first_selected;  // 默认进入关联阶段
transition = 'frequent';
if (Math.random() < 0.3) {
    stage = 1 - stage;   // 30%概率转移到非关联阶段
    transition = 'infrequent';
}
```

#### 转移矩阵设计
- **刺激0** → **2a阶段**(70%) / **2b阶段**(30%)
- **刺激1** → **2b阶段**(70%) / **2a阶段**(30%)
- 转移概率在整个实验中保持固定

### 动态奖励系统

#### 奖励概率矩阵
```javascript
var FB_matrix = [
    prob_stim2,  // 第二阶段刺激2的奖励概率
    prob_stim3,  // 第二阶段刺激3的奖励概率
    prob_stim4,  // 第二阶段刺激4的奖励概率
    prob_stim5   // 第二阶段刺激5的奖励概率
];
// 初始概率在0.25-0.75之间随机
```

#### 概率更新机制
```javascript
var update_FB = function() {
    for (i = 0; i < FB_matrix.length; i++) {
        var curr_value = FB_matrix[i];
        var step = normal_random(0, 0.025 * 0.025);  // 高斯随机游走
        if (curr_value + step < 0.75 && curr_value + step > 0.25) {
            FB_matrix[i] = curr_value + step;
        } else {
            FB_matrix[i] = curr_value - step;  // 边界反弹
        }
    }
}
```

### 刺激呈现系统

#### 动画化选择过程
```javascript
// 第一阶段选择动画
var get_first_selected = function() {
    return "<div class = 'selected " + stim_side[choice] + "' style='background:" + curr_colors[0] + ";'>" +
           "<img class = 'decision-stim' src= '" + curr_images[first_selected] + "'></div>" +
           "<div class = '" + stim_side[1 - choice] + " fade' style='background:" + curr_colors[0] + ";'>" +
           "<img class = 'decision-stim fade' src= '" + curr_images[first_notselected] + "'></div>";
}
```

#### 第二阶段呈现
```javascript
var choose_second_stage = function() {
    return "<div class = 'decision-top faded' style='background:" + curr_colors[0] + ";'>" +
           "<img class = 'decision-stim' src= '" + curr_images[first_selected] + "'></div>" +
           curr_ss_stims.stimulus[stim_index];  // 显示第一阶段选择+第二阶段选项
}
```

### 学习模型评估

#### 基于模型的学习指标
1. **转移学习**: 学会第一阶段选择与第二阶段的关联
2. **前瞻规划**: 根据第二阶段价值选择第一阶段行动
3. **模型更新**: 转移概率的学习和使用
4. **价值传播**: 第二阶段价值向第一阶段的反向传播

#### 基于习惯的学习指标
1. **直接强化**: 第一阶段选择直接与奖励关联
2. **重复偏好**: 对之前获得奖励选择的重复
3. **忽略转移**: 不考虑第一阶段到第二阶段的转移结构
4. **局部学习**: 仅基于最近奖励历史的选择

### 认知策略分析

#### 模型-习惯权衡
```javascript
// 分析指标：Stay-Switch行为
// Stay: 重复上次第一阶段选择
// Switch: 改变上次第一阶段选择
// 
// 基于模型的预测：
// - 常见转移+奖励 → Stay
// - 常见转移+无奖励 → Switch  
// - 罕见转移+奖励 → Switch
// - 罕见转移+无奖励 → Stay
```

#### 关键分析维度
1. **转移类型效应**: 常见vs罕见转移对后续选择的影响
2. **奖励历史效应**: 最近奖励对决策的影响权重
3. **阶段交互效应**: 两阶段间的策略协调
4. **学习速度**: 对环境变化的适应速度

### 数据质量控制

#### 性能评估标准
```javascript
var assessPerformance = function() {
    var missed_percent = missed_count/trial_count;     // 遗漏率
    var avg_rt = math.median(rt_array);                // 中位反应时间
    var responses_ok = true;                           // 反应分布检查
    
    credit_var = (missed_percent < 0.4 && avg_rt > 200 && responses_ok);
    if (credit_var === true) {
        performance_var = total_score;  // 基于获得金币数评估表现
    } else {
        performance_var = 0;
    }
}
```

#### 注意力监控
- **定时检查**: 各阶段插入注意力检测题
- **反应质量**: 监控过快或过慢反应
- **参与度**: 检查是否存在随机反应模式

### 计算建模应用

#### 强化学习模型
1. **Q-learning**: 基于价值的无模型学习
2. **Actor-Critic**: 策略梯度与价值函数结合
3. **混合模型**: 模型基础学习与习惯学习的加权组合
4. **层次化模型**: 多层次决策过程建模

#### 模型比较指标
1. **拟合优度**: AIC、BIC等信息准则
2. **预测准确性**: 交叉验证预测表现
3. **参数可解释性**: 模型参数的心理学意义
4. **泛化能力**: 在新环境中的表现

### 神经计算机制

#### 脑区功能网络
1. **背外侧前额叶**: 模型基础学习和工作记忆
2. **纹状体**: 习惯学习和程序性记忆
3. **前扣带皮层**: 认知控制和冲突监控
4. **眶额叶皮层**: 价值评估和决策制定

#### 神经递质系统
- **多巴胺**: 奖励预测误差和学习信号
- **乙酰胆碱**: 不确定性和注意调节
- **5-羟色胺**: 冲动控制和时间折扣
- **GABA**: 抑制控制和策略选择

### 数据导出格式
jsPsych自动保存为JSON格式，包含：
- 每个试验的完整决策序列和时间数据
- 转移类型和奖励概率的动态轨迹
- 可用于计算建模和策略分析的全部信息
- 支持强化学习模型拟合的详细数据

## 临床应用价值
Two-Stage Decision任务广泛应用于：
- **决策障碍研究**: 冲动性和强迫性疾病的决策机制
- **成瘾行为评估**: 习惯形成与目标导向行为的失衡
- **认知灵活性**: 策略转换和认知控制能力评估
- **发展心理学**: 儿童和青少年决策发展轨迹
- **神经精神疾病**: 帕金森病、精神分裂症等的决策功能

## 注意事项
- 确保被试理解两阶段任务的结构关系
- 强调获得尽可能多金币的目标导向
- 注意奖励概率变化对策略选择的影响
- 监控被试是否采用简化的启发式策略