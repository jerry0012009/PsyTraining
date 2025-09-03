# Dimensional Set Shifting Task - Data Saving Documentation

## 概述
维度集转换任务（Dimensional Set Shifting Task）是一个评估认知灵活性和执行功能的神经心理测验。该任务基于Wisconsin卡片分类测验（WCST）的原理，要求参与者根据反馈学习分类规则，并在规则改变时灵活调整反应策略。

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
            jsPsych.data.localSave('dimensional-set-shifting_results.csv', 'csv');
        }
    }
});
```

## 数据结构

### jsPsych框架数据
基于jsPsych心理学实验框架收集的标准化数据：

### 核心试次数据
- **trial_type**: 试次类型（如'poldrack-categorize'）
- **trial_index**: 试次在实验中的序号
- **rt**: 反应时间（毫秒）
- **key_press**: 按键反应（37=左箭头, 38=上箭头, 39=右箭头, 40=下箭头）
- **correct**: 反应正确性（true/false）

### 任务特定数据
```javascript
function get_data() {
    return {
        trial_id: 'stim',
        exp_stage: 'test',
        condition: stages[stage_counter]  // 当前实验阶段
    }
}
```

### 实验阶段记录
- **simple**: 单维度简单分类
- **simple_rev**: 单维度反转
- **separate**: 双维度分离呈现
- **compound**: 双维度复合呈现
- **compound_rev**: 复合维度反转
- **ID**: 维度内转换（Intra-Dimensional shift）
- **ID_rev**: 维度内转换反转
- **ED**: 维度间转换（Extra-Dimensional shift）
- **ED_rev**: 维度间转换反转

## 认知测量维度

### 执行功能评估
- **认知灵活性**: 在不同分类规则间转换的能力
- **集中注意维持**: 维持当前相关维度的注意控制
- **注意转换**: 在不同维度间转移注意焦点
- **工作记忆更新**: 根据反馈更新规则表征

### 学习与适应能力
- **反馈学习**: 基于正确/错误反馈调整行为
- **规则获得**: 通过试误学习推断隐含规则
- **认知抑制**: 抑制之前相关但当前无关的反应倾向
- **策略切换**: 从旧策略转换到新策略的效率

### 维度转换类型
- **维度内转换(ID)**: 在相同维度内改变具体分类标准
- **维度间转换(ED)**: 在不同维度间转换注意焦点
- **反转学习**: 相同维度内的对错反转

## 实验设计特点

### 刺激材料
- **视觉维度**: 形状和线条两个维度
- **刺激组合**: 
  - 单维度: 仅形状或仅线条
  - 双维度: 形状+线条复合刺激
- **呈现位置**: 左、上、右、下四个位置随机呈现

### 任务结构
```javascript
var stages = ['simple', 'simple_rev', 'separate', 'compound', 
             'compound_rev', 'ID', 'ID_rev', 'ED', 'ED_rev']
```

### 反应键位映射
- **37**: 左箭头键
- **38**: 上箭头键  
- **39**: 右箭头键
- **40**: 下箭头键

### 刺激呈现逻辑
```javascript
function get_stim() {
    // 根据维度数量选择呈现方式
    if (stims.length == 2) {
        // 单维度条件
        stim1 = stims[0]; stim2 = stims[1];
    } else if (stims.length == 4) {
        // 双维度条件，随机配对
        if (Math.random() < 0.5) {
            stim1 = stims[0] + stims[2];
            stim2 = stims[1] + stims[3];
        }
    }
}
```

## 临床应用价值

### 神经心理评估
- **前额叶功能**: 评估背外侧前额叶皮质功能
- **执行功能障碍**: 识别计划、组织和灵活性缺陷
- **注意控制**: 评估选择性和执行性注意能力
- **认知康复**: 训练认知灵活性和适应能力

### 适用疾病人群
- **精神分裂症**: 评估认知功能缺陷
- **自闭症谱系障碍**: 评估认知僵化和转换困难
- **注意缺陷多动障碍(ADHD)**: 评估执行功能缺陷
- **帕金森病**: 评估认知灵活性损害
- **痴呆症**: 早期执行功能变化检测

### 发展心理学应用
- **儿童认知发展**: 评估执行功能成熟度
- **老龄化研究**: 检测年龄相关的认知灵活性变化
- **学习障碍**: 识别学习策略转换困难

## 数据分析策略

### 基础性能指标
- **总体正确率**: 反映整体任务表现
- **各阶段正确率**: 识别特定认知功能缺陷
- **平均反应时**: 信息处理速度指标
- **学习效率**: 达到标准所需试次数

### 关键认知指标
- **ED转换成本**: ED阶段 vs ID阶段的表现差异
- **反转学习能力**: 反转阶段的适应速度
- **持续性错误**: 维持使用错误规则的试次数
- **学习曲线**: 跨试次的正确率变化轨迹

### 进阶分析方法
```javascript
function evalAttentionChecks() {
    var attention_check_trials = jsPsych.data.getTrialsOfType('attention-check');
    var checks_passed = 0;
    for (var i = 0; i < attention_check_trials.length; i++) {
        if (attention_check_trials[i].correct === true) {
            checks_passed += 1;
        }
    }
    return checks_passed / attention_check_trials.length;
}
```

### 认知模型分析
- **强化学习模型**: 分析学习率和决策参数
- **贝叶斯模型**: 评估规则不确定性的处理
- **注意权重模型**: 分析不同维度的注意分配

## 技术实现特点

### jsPsych插件使用
- **jspsych-poldrack-categorize**: 分类反应收集
- **jspsych-poldrack-text**: 指导语和反馈呈现
- **jspsych-attention-check**: 注意力检查试次

### 自适应算法
- **平衡刺激呈现**: 防止位置或配对偏向
- **反转检测**: 自动识别学习标准达成
- **注意力监控**: 实时评估参与者注意状态

### 质量控制机制
```javascript
var run_attention_checks = false;
var attention_check_thresh = 0.65;
var instructTimeThresh = 0; // 指导语阅读时间阈值
```

## 注意事项

### 施测标准化
- **指导语标准**: 确保参与者理解任务要求
- **练习充分**: 在正式测试前进行足够的练习
- **环境控制**: 安静环境，避免分心干扰
- **时间控制**: 合理设定反应时间窗口

### 数据质量控制
- **反应时过滤**: 排除过快(<150ms)或过慢(>5000ms)反应
- **注意力检查**: 使用注意力检查试次评估参与质量
- **学习标准**: 设定合理的学习达标标准
- **疲劳效应**: 监控跨时间的表现变化

### 结果解释注意
- **发展差异**: 考虑年龄相关的执行功能发展
- **文化因素**: 抽象符号理解的文化差异
- **动机水平**: 参与者的任务参与动机
- **认知负荷**: 任务难度对表现的影响

### 临床解释指导
- **ED缺陷**: ED转换困难提示前额叶功能损害
- **反转困难**: 提示认知僵化或抑制功能缺陷
- **学习缓慢**: 可能反映工作记忆或反馈处理问题
- **一致性差**: 注意维持或动机问题的指标