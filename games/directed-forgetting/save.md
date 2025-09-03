# Directed Forgetting Task - Data Saving Documentation

## 概述
定向遗忘任务（Directed Forgetting Task）是一个评估认知控制和工作记忆管理能力的实验任务。该任务要求参与者在看到字母刺激后，根据提示词（TOP或BOT）有选择性地记住和遗忘特定位置的字母，测量个体的认知抑制能力和注意控制能力。

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
            jsPsych.data.localSave('directed-forgetting_results.csv', 'csv');
        }
    }
});
```

## 数据结构

### jsPsych框架数据
基于jsPsych心理学实验框架收集的标准化数据：

### 核心试次数据
- **trial_type**: 试次类型（'poldrack-single-stim', 'poldrack-categorize'）
- **trial_index**: 试次在实验中的序号
- **rt**: 反应时间（毫秒）
- **key_press**: 按键反应（37=左箭头, 39=右箭头）
- **correct**: 反应正确性（true/false）

### 任务特定数据
```javascript
function appendTestData() {
    jsPsych.data.addDataToLastTrial({
        trial_num: current_trial,
        stim_top: stims.slice(0,3),      // 上方三个字母
        stim_bottom: stims.slice(3),     // 下方三个字母
        exp_stage: exp_stage             // 实验阶段（practice/test）
    })
}
```

### 提示词数据
```javascript
function appendCueData() {
    jsPsych.data.addDataToLastTrial({
        cue: cue,                        // 提示词（'TOP'或'BOT'）
        trial_num: current_trial,
        exp_stage: exp_stage
    })
}
```

### 探测试次数据
```javascript
function appendProbeData(data) {
    jsPsych.data.addDataToLastTrial({
        correct: correct,                // 反应正确性
        probe_letter: probe,             // 探测字母
        probe_type: probeType,           // 探测类型（pos/neg/con）
        trial_num: current_trial,
        correct_response: correct_response,  // 正确反应键
        exp_stage: exp_stage
    })
}
```

## 认知测量维度

### 认知控制评估
- **选择性注意**: 根据指示选择性注意特定位置信息
- **认知抑制**: 主动抑制不相关信息的能力
- **工作记忆管理**: 动态更新和维护记忆内容
- **执行功能**: 根据指令灵活调整认知策略

### 记忆过程分析
- **编码控制**: 控制哪些信息进入工作记忆
- **遗忘控制**: 主动从工作记忆中移除信息
- **记忆检索**: 准确检索目标记忆集合内容
- **干扰抵抗**: 抵抗无关信息的干扰效应

## 实验设计特点

### 刺激材料
- **字母刺激**: 使用26个英文字母A-Z
- **空间布局**: 
  - 上方位置: 3个字母（左、中、右）
  - 下方位置: 3个字母（左、中、右）
- **提示词**: 'TOP'和'BOT'指示遗忘方向

### 试次结构
```javascript
var practice_length = 8;        // 练习试次数
var num_trials = 24;           // 每轮正式试次数
var num_runs = 3;              // 总轮数
```

### 探测类型
- **pos（正确）**: 探测字母在记忆集合中
- **neg（错误）**: 探测字母在需要遗忘的集合中
- **con（控制）**: 探测字母完全未出现过

### 反应键位映射
- **37**: 左箭头键 - 字母在记忆集合中
- **39**: 右箭头键 - 字母不在记忆集合中

## 临床应用价值

### 神经心理评估
- **前额叶功能**: 评估执行控制和认知灵活性
- **工作记忆**: 评估工作记忆的操作和管理能力
- **注意控制**: 评估选择性注意和注意分配能力
- **认知抑制**: 评估对无关信息的抑制能力

### 适用人群
- **注意缺陷多动障碍(ADHD)**: 评估注意控制缺陷
- **抑郁症**: 评估认知控制功能损害
- **精神分裂症**: 评估工作记忆和认知控制缺陷
- **老年认知**: 评估与年龄相关的执行功能变化
- **学习障碍**: 评估学习相关的认知控制能力

### 认知训练应用
- **工作记忆训练**: 提高工作记忆容量和操作能力
- **注意力训练**: 增强选择性注意和注意控制
- **执行功能康复**: 改善计划、组织和认知灵活性
- **学习策略训练**: 教授有效的记忆管理策略

## 数据分析策略

### 基础性能指标
- **总体正确率**: 反映整体任务表现
- **平均反应时**: 认知处理速度指标
- **练习vs测试表现**: 学习效应分析
- **各轮表现变化**: 疲劳和适应效应

### 关键认知指标
- **遗忘效应**: 比较需要遗忘vs保持条件的表现差异
- **干扰抵抗**: 分析neg试次（需要遗忘的字母）的错误率
- **记忆精度**: pos试次的正确率反映记忆准确性
- **控制条件表现**: con试次反映基线决策能力

### 进阶分析方法
- **定向遗忘指数**: (遗忘条件正确率 - 记忆条件正确率) / 记忆条件正确率
- **反应时模式分析**: 不同试次类型的反应时差异
- **学习曲线**: 跨试次的表现改进模式
- **策略分析**: 基于反应模式推断认知策略

### 质量控制指标
```javascript
function assessPerformance() {
    var missed_percent = missed_count/trial_count;
    var avg_rt = math.median(rt_array);
    var responses_ok = true; // 检查是否存在反应偏向
    credit_var = (missed_percent < 0.4 && avg_rt > 200 && responses_ok);
}
```

## 技术实现特点

### jsPsych插件使用
- **jspsych-poldrack-single-stim**: 刺激呈现和反应收集
- **jspsych-poldrack-categorize**: 练习阶段带反馈的分类任务
- **jspsych-poldrack-instructions**: 指导语呈现
- **jspsych-attention-check**: 注意力检查试次

### 刺激生成算法
```javascript
var getTrainingSet = function() {
    // 确保连续试次间无重复字母
    stims = trainingArray.filter(function(y) {
        return (jQuery.inArray(y, preceeding1stims.concat(preceeding2stims)) == -1)
    }).slice(0,6)
}
```

### 自适应反馈系统
- **练习阶段**: 提供即时正确/错误反馈
- **测试阶段**: 检测策略使用错误，提供重新指导
- **质量监控**: 实时评估参与质量和理解程度

### 反馈检测机制
```javascript
var getTestFeedback = function() {
    var directed_remembering_percent = directed_remembering_total / respond_remember_total;
    if (directed_remembering_percent >= 0.75){
        // 检测到参与者误解任务，提供重新指导
    }
}
```

## 注意事项

### 施测标准化
- **指导语理解**: 确保参与者理解"定向遗忘"概念
- **练习充分**: 至少8次练习试次确保任务理解
- **环境控制**: 安静环境，避免视觉和听觉干扰
- **时间控制**: 合理的刺激呈现和反应时间窗口

### 数据质量控制
- **反应时过滤**: 排除过快(<200ms)和超时反应
- **反应偏向检查**: 检测过度使用单一按键的模式
- **理解度评估**: 通过反应模式检测任务理解程度
- **注意力监控**: 使用注意力检查试次评估参与质量

### 结果解释注意
- **策略差异**: 不同个体可能采用不同的记忆管理策略
- **年龄效应**: 考虑发展和老化对执行功能的影响
- **动机因素**: 任务动机对认知控制表现的影响
- **临床意义**: 结合其他认知测试综合评估认知功能

### 临床解释指导
- **遗忘困难**: 可能提示认知抑制功能缺陷
- **记忆混乱**: 提示工作记忆组织和管理问题
- **反应时延长**: 可能反映认知处理速度下降
- **错误模式**: 分析特定错误类型的临床含义