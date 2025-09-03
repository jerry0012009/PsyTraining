# Discount Titrate Task - Data Saving Documentation

## 概述
延迟折扣滴定任务（Discount Titrate Task）是一个评估跨期选择和冲动控制能力的经济心理学实验。参与者需要在即时较小奖励和延迟较大奖励之间做出选择，测量个体的延迟折扣率和自我控制能力。

## 数据保存机制

### 保存端点
- **主要端点**: `POST /save`
- **备用机制**: 本地CSV文件下载

### 数据保存流程
```javascript
$.ajax({
    type: "POST",
    url: '/save',
    data: { "data": data },
    success: function(){ document.location = "/next" },
    dataType: "application/json",
    
    error: function(err) {
        if (err.status == 200){
            document.location = "/next";
        } else {
            // 本地保存备份
            jsPsych.data.localSave('discount-titrate_results.csv', 'csv');
        }
    }
});
```

## 数据结构

### jsPsych框架数据
基于jsPsych心理学实验框架收集的标准化数据：

### 核心试次数据
- **trial_type**: 试次类型（'poldrack-single-stim'）
- **trial_index**: 试次在实验中的序号
- **rt**: 反应时间（毫秒）
- **key_press**: 按键反应（81='q'键, 80='p'键）
- **stimulus**: 完整的HTML刺激内容

### 选择任务特有数据
```javascript
function on_finish(data) {
    var whichKey = data.key_press;
    var chosen_amount = 0;
    var chosen_delay = 0;
    var choice = '';
    
    if (whichKey == 81) {          // 'q'键 - 左边选项
        chosen_amount = data.smaller_amount;
        chosen_delay = data.sooner_delay;
        choice = 'smaller_sooner';
    } else if (whichKey == 80) {   // 'p'键 - 右边选项
        chosen_amount = data.larger_amount;
        chosen_delay = data.later_delay;
        choice = 'larger_later';
    }
    
    jsPsych.data.addDataToLastTrial({
        chosen_amount: chosen_amount,    // 选择的金额
        chosen_delay: chosen_delay,      // 选择的延迟
        choice: choice                   // 选择类型
    })
}
```

### 试次参数数据
```javascript
data: {
    smaller_amount: options.small_amt[i],    // 较小金额（5-40美元）
    larger_amount: options.larger_amt[i],    // 较大金额（相对差异1.01-1.75倍）
    sooner_delay: options.sooner_del[i],     // 较早延迟（"今天"或"2周后"）
    later_delay: options.later_del[i],       // 较晚延迟（"2周后"-"6周后"）
    trial_id: "stim",
    exp_stage: "test"
}
```

## 认知测量维度

### 跨期选择能力评估
- **延迟折扣**: 个体对未来奖励的主观贬值程度
- **冲动控制**: 抵抗即时满足的诱惑，等待更大奖励
- **时间感知**: 对不同时间延迟的主观体验
- **价值判断**: 综合考虑金额和时间因素的决策能力

### 自我控制评估
- **延迟满足**: Mischel棉花糖实验的成人版本
- **计划能力**: 为未来目标制定计划和坚持执行
- **诱惑抵抗**: 面对即时诱惑时的意志力水平
- **长期导向**: 优先考虑长期利益而非短期快乐

### 经济决策行为
- **风险偏好**: 在不确定性情况下的选择倾向
- **时间偏好**: 个体特有的时间贴现率
- **理性决策**: 是否按照经济学理性人假设行为
- **一致性**: 跨试次决策的内在一致性

## 实验设计特点

### 刺激参数生成
```javascript
// 较小金额生成（正态分布）
var small_amts = [];
for (i = 0; i < 36; i++) {
    small_amts[i] = Math.round(rnorm(20, 10) * 100) / 100;  // 均值20，标准差10
    if (small_amts[i] < 5) small_amts[i] = 5;              // 最小5美元
    if (small_amts[i] > 40) small_amts[i] = 40;            // 最大40美元
}

// 较大金额基于相对差异生成
var rel_dif = [1.01, 1.05, 1.10, 1.15, 1.20, 1.25, 1.30, 1.50, 1.75];
var larger_amts = [];
for (i = 0; i < 36; i++) {
    larger_amts[i] = Math.round(small_amts[i] * rel_dif[i] * 100) / 100;
}
```

### 延迟时间结构
- **即时条件**: "今天"（18个试次）
- **短延迟**: "2周后"（18个试次作为即时，9个试次作为延迟）
- **中延迟**: "4周后"（18个试次）
- **长延迟**: "6周后"（9个试次）

### 反应键位映射
- **81键（'q'键）**: 选择左侧选项（较小金额，较短延迟）
- **80键（'p'键）**: 选择右侧选项（较大金额，较长延迟）

### 奖励机制
```javascript
var bonus_list = [];
// 每次选择都记录到奖励列表
bonus_list.push({'amount': chosen_amount, 'delay': chosen_delay});

// 实验结束时随机选择一个试次的结果作为实际奖励
var bonus = randomDraw(bonus_list);
```

## 临床应用价值

### ADHD评估
- **冲动控制缺陷**: ADHD患者往往表现出更高的延迟折扣率
- **执行功能**: 评估计划和自我调节能力
- **奖励处理**: 分析对即时和延迟奖励的敏感性差异
- **药物效果**: 评估刺激性药物对自我控制的改善效果

### 成瘾行为研究
- **物质依赖**: 成瘾个体通常表现出陡峭的延迟折扣曲线
- **行为成瘾**: 赌博、游戏等行为成瘾的认知机制
- **复吸风险**: 高延迟折扣率预示更高的复吸可能性
- **治疗效果**: 认知行为治疗对冲动控制的改善效果

### 精神健康评估
- **抑郁症**: 抑郁患者可能表现出对未来奖励的兴趣减少
- **躁郁症**: 躁狂期和抑郁期的延迟折扣模式差异
- **人格障碍**: 边缘型人格障碍的冲动性特征评估
- **焦虑障碍**: 焦虑对跨期选择决策的影响

### 儿童发展研究
- **自控力发展**: 追踪儿童青少年自我控制能力的发展轨迹
- **学业成就**: 延迟满足能力与学业表现的关联
- **社会适应**: 自我控制与社交技能发展的关系
- **早期干预**: 识别需要自控力训练的高危儿童

## 数据分析策略

### 基础行为指标
- **即时选择比例**: 选择较小即时奖励的试次百分比
- **平均反应时**: 决策过程的认知负荷指标
- **选择一致性**: 相似条件下选择的稳定性
- **极端反应**: 总是选择即时或总是选择延迟的比例

### 延迟折扣建模
- **双曲折扣模型**: V = A/(1 + kD)
  - V: 主观价值
  - A: 客观金额
  - k: 延迟折扣率参数
  - D: 延迟时间
- **指数折扣模型**: V = A × e^(-kD)
- **Beta-Delta模型**: 区分现在偏见和长期耐心

### 个体差异分析
```javascript
function calculateDiscountRate(choices) {
    // 计算个体延迟折扣率
    var immediate_choices = 0;
    var total_choices = 0;
    
    choices.forEach(function(choice) {
        if (choice.choice == 'smaller_sooner') {
            immediate_choices++;
        }
        total_choices++;
    });
    
    return immediate_choices / total_choices;
}
```

### 决策模式识别
- **冲动型**: 高比例选择即时奖励
- **耐心型**: 高比例选择延迟奖励
- **情境敏感型**: 根据金额差异和延迟长度灵活调整
- **随机型**: 选择模式缺乏内在逻辑

## 技术实现特点

### jsPsych插件使用
- **jspsych-poldrack-single-stim**: 主要的刺激呈现和反应收集
- **jspsych-poldrack-instructions**: 分步骤指导语系统
- **jspsych-survey-text**: 任务后问卷收集
- **jspsych-attention-check**: 注意力质量控制

### 随机化设计
- **试次顺序**: 使用`randomize_order: true`随机化试次顺序
- **金额生成**: 基于正态分布的随机金额生成
- **奖励选择**: 实验结束时随机选择一个试次的结果作为真实奖励

### 质量控制机制
```javascript
function assessPerformance() {
    var missed_count = 0;
    var trial_count = 0;
    var rt_array = [];
    
    // 计算遗漏率和平均反应时
    var missed_percent = missed_count / trial_count;
    var avg_rt = math.median(rt_array);
    
    // 设定质量标准
    credit_var = (missed_percent < 0.4 && avg_rt > 200);
}
```

## 注意事项

### 施测标准化
- **真实性强调**: 明确告知参与者将根据选择获得真实奖励
- **理解确认**: 确保参与者理解任务规则和按键对应关系
- **环境控制**: 安静环境，避免时间压力干扰
- **激励充分**: 奖励金额对参与者具有实际意义

### 数据质量控制
- **反应时筛选**: 排除过快（<200ms）的反应
- **遗漏率控制**: 遗漏率超过40%的数据需要谨慎处理
- **一致性检查**: 识别明显不合理的选择模式
- **注意力监控**: 使用注意力检查试次评估参与质量

### 伦理考量
- **真实支付**: 如果承诺真实奖励，必须按照选择结果支付
- **金额合理**: 奖励金额应在参与者可接受范围内
- **时间兑现**: 按照承诺的时间点兑现延迟奖励
- **知情同意**: 明确说明实验程序和奖励机制

### 结果解释注意
- **文化差异**: 不同文化对时间和金钱的态度差异
- **社会经济地位**: 经济条件对延迟折扣的显著影响
- **年龄因素**: 延迟折扣率随年龄的系统性变化
- **情境因素**: 实验环境与现实决策环境的差异

### 临床应用建议
- **综合评估**: 结合其他自我控制测量工具
- **纵向追踪**: 多时间点测量以观察变化趋势
- **干预效果**: 作为治疗效果评估的客观指标
- **个性化分析**: 基于个体模式制定针对性干预策略