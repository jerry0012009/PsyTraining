# Save Data Documentation - Choice Reaction Time Task

## 数据输出格式

### 基本信息
- **框架**: jsPsych + Poldrack plugins
- **输出格式**: JSON数据 (POST) 或 CSV文件 (备份)
- **保存机制**: 双重保存 - 服务器POST + 本地CSV下载
- **任务类型**: 选择反应时间任务 (Choice Reaction Time)
- **集成系统**: Experiment Factory兼容

## 保存流程

1. **实时数据收集**: 每个试次的反应时间、按键、正确性实时记录
2. **实验结束**: 数据首先尝试POST到/save端点
3. **本地备份**: 服务器保存失败时自动下载CSV文件
4. **文件命名**: `choice-reaction-time_results.csv`

```javascript
// jsPsych数据保存流程
jsPsych.init({
    timeline: choice_reaction_time_experiment,
    on_trial_finish: function(data) {
        addID('choice-reaction-time');
    },
    on_finish: function(data) {
        // 序列化数据
        var serializedData = jsPsych.data.dataAsJSON();
        
        // 尝试POST到服务器
        $.ajax({
            type: "POST",
            url: '/save',
            data: { "data": serializedData },
            dataType: "application/json",
            success: function(data) {
                console.log('Data saved to server successfully');
            },
            error: function() {
                // 服务器保存失败时本地保存
                jsPsych.data.localSave('choice-reaction-time_results.csv', 'csv');
            }
        });
    }
});
```

## 数据结构

### 主要字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `rt` | number | 反应时间 (毫秒) |
| `key_press` | number/string | 按键编码 (Z键=90, M键=77) |
| `correct` | boolean | 反应是否正确 |
| `trial_type` | string | 试次类型 ("poldrack-single-stim") |
| `trial_index` | number | 试次序号 |
| `time_elapsed` | number | 从实验开始的累计时间 |
| `stimulus` | string | 呈现的刺激 (HTML) |
| `possible_responses` | array | 允许的按键响应 |
| `stim_duration` | number | 刺激呈现时间 |
| `block_num` | number | 区块编号 (0=练习, 1-3=测试) |
| `trial_id` | string | 试次标识 ("stim", "practice", "test") |
| `exp_id` | string | 实验ID ("choice_reaction_time") |

### 任务阶段

**练习阶段**
- 橙色和蓝色方块各若干试次
- 提供正确/错误反馈
- `block_num`: 0
- `trial_id`: "practice"

**测试阶段** 
- 3个测试区块，中间有休息
- 无反馈
- `block_num`: 1, 2, 3
- `trial_id`: "test"

### 刺激-反应映射

**颜色刺激**
- 橙色方块: `<div class='orange-square'></div>`
- 蓝色方块: `<div class='blue-square'></div>`

**按键映射** (随机分配)
- 方案A: 橙色→Z键(90), 蓝色→M键(77)
- 方案B: 橙色→M键(77), 蓝色→Z键(90)

## 示例数据

### CSV格式输出示例

```csv
rt,key_press,correct,trial_type,trial_index,time_elapsed,stimulus,block_num,trial_id,exp_id
1250,90,true,poldrack-single-stim,5,12500,"<div class=centerbox><div id=stim1></div></div>",0,practice,choice_reaction_time
890,77,true,poldrack-single-stim,6,13400,"<div class=centerbox><div id=stim2></div></div>",0,practice,choice_reaction_time
1100,90,false,poldrack-single-stim,7,14500,"<div class=centerbox><div id=stim2></div></div>",0,practice,choice_reaction_time
580,77,true,poldrack-single-stim,15,25600,"<div class=centerbox><div id=stim1></div></div>",1,test,choice_reaction_time
-1,-1,false,poldrack-single-stim,16,27600,"<div class=centerbox><div id=stim2></div></div>",1,test,choice_reaction_time
750,90,true,poldrack-single-stim,17,29350,"<div class=centerbox><div id=stim1></div></div>",1,test,choice_reaction_time
```

### JSON格式转换示例

```json
{
  "experiment_metadata": {
    "experiment_id": "choice_reaction_time",
    "subject_id": "sub_001",
    "start_time": "2024-01-01T12:00:00Z",
    "completion_time": "2024-01-01T12:15:00Z",
    "total_duration": 900000,
    "stimulus_mapping": {
      "orange_key": "Z",
      "blue_key": "M"
    }
  },
  "performance_summary": {
    "practice_trials": 20,
    "test_trials": 120,
    "overall_accuracy": 0.85,
    "mean_rt": 658.2,
    "rt_variability": 178.5,
    "missed_trials": 3,
    "credit_var": true
  },
  "block_performance": [
    {
      "block_num": 0,
      "block_type": "practice",
      "accuracy": 0.75,
      "mean_rt": 892.4,
      "trial_count": 20,
      "feedback_given": true
    },
    {
      "block_num": 1,
      "block_type": "test",
      "accuracy": 0.88,
      "mean_rt": 641.2,
      "trial_count": 40,
      "feedback_given": false
    }
  ],
  "trial_data": [
    {
      "trial_index": 5,
      "stimulus_type": "orange",
      "correct_response": 90,
      "actual_response": 90,
      "rt": 1250,
      "correct": true,
      "block_num": 0
    },
    {
      "trial_index": 16,
      "stimulus_type": "blue", 
      "correct_response": 77,
      "actual_response": -1,
      "rt": -1,
      "correct": false,
      "block_num": 1,
      "note": "missed_trial"
    }
  ],
  "cognitive_metrics": {
    "processing_speed": {
      "simple_rt": 432.1,
      "choice_rt": 658.2,
      "rt_difference": 226.1
    },
    "response_inhibition": {
      "error_rate": 0.15,
      "post_error_slowing": 45.2,
      "response_consistency": 0.82
    },
    "attention_control": {
      "sustained_attention": 0.85,
      "vigilance_decrement": -0.02,
      "lapses_of_attention": 3
    }
  }
}
```

## 任务机制

### 基本范式
- **刺激**: 橙色或蓝色方块随机呈现在屏幕中央
- **反应**: 根据颜色按对应的键 (Z键或M键)
- **时间**: 刺激呈现直到被试反应或超时
- **反馈**: 练习阶段提供正确/错误反馈

### 时间参数
- **刺激呈现**: 最长3秒或直到反应
- **试次间间隔**: 500-1500毫秒随机
- **超时处理**: 3秒无反应记录为遗漏

### 任务结构
- **练习**: 20试次，有反馈
- **正式测试**: 3个区块共120试次，无反馈
- **休息**: 每个测试区块之间可休息

## 认知指标评估

### 处理速度 (processingSpeed)

**简单反应时 (simpleRT)**
- `mean_rt`: 平均反应时间
- `rt_variability`: 反应时间变异性 (标准差)
- `rt_distribution`: 反应时间分布特征

**选择反应时 (choiceRT)**  
- `choice_rt`: 选择反应时间
- `rt_cost`: 选择成本 (相对于简单反应时的增加)
- `speed_accuracy_tradeoff`: 速度-准确性权衡

### 注意功能 (attention)

**持续注意 (sustainedAttention)**
- `vigilance_performance`: 警觉表现
- `vigilance_decrement`: 警觉递减 (时间效应)
- `attention_lapses`: 注意力失误次数

**选择性注意 (selectiveAttention)**
- `stimulus_discrimination`: 刺激分辨能力
- `interference_resistance`: 抗干扰能力
- `perceptual_accuracy`: 知觉准确性

### 执行控制 (executiveControl)

**反应抑制 (responseInhibition)**
- `error_rate`: 错误率
- `false_alarm_rate`: 虚报率
- `response_control`: 反应控制能力

**认知灵活性 (cognitiveFlexibility)**
- `set_switching`: 集合转换能力
- `task_switching_cost`: 任务转换成本
- `adaptation_speed`: 适应速度

## 临床/研究应用

### 神经心理评估
- **处理速度障碍**: 评估信息处理速度缺陷
- **注意缺陷**: ADHD等注意障碍的评估
- **执行功能**: 前额叶功能评估

### 认知老化研究
- **认知减缓**: 年龄相关的处理速度下降
- **选择性注意**: 老化对选择性注意的影响
- **反应时变异性**: 认知控制的年龄变化

### 精神疾病评估
- **精神分裂症**: 处理速度和注意缺陷评估
- **抑郁症**: 精神运动迟缓的测量
- **焦虑症**: 注意偏向和过度警觉评估

### 药物效应研究
- **兴奋剂**: 评估兴奋剂对处理速度的影响
- **镇静剂**: 测量镇静剂的认知副作用
- **认知增强**: 认知增强药物的效果评估

## 数据分析方法

### 基础性能指标

```r
# R代码示例 - 选择反应时分析
# 过滤有效试次
valid_trials <- data[data$rt > 100 & data$rt < 3000 & data$trial_id == "test", ]

# 计算准确率
accuracy <- sum(valid_trials$correct) / nrow(valid_trials)

# 计算平均反应时间 (仅正确试次)
correct_trials <- valid_trials[valid_trials$correct == TRUE, ]
mean_rt <- mean(correct_trials$rt)
rt_sd <- sd(correct_trials$rt)

# 计算变异系数
cv_rt <- rt_sd / mean_rt

# 分析错误类型
error_trials <- valid_trials[valid_trials$correct == FALSE, ]
error_rate <- nrow(error_trials) / nrow(valid_trials)

# 计算后错误减缓
post_error_slowing <- analyze_post_error_slowing(data)
```

### 高级分析

**反应时分布分析**
```r
# Ex-Gaussian拟合
library(retimes)
exgauss_params <- timefit(correct_trials$rt, plot = TRUE)

# 分位数分析
rt_quantiles <- quantile(correct_trials$rt, probs = c(0.1, 0.25, 0.5, 0.75, 0.9))
```

**学习效应分析**
```r
# 跨试次表现变化
learning_curve <- analyze_learning_curve(data)

# 练习效应
practice_effect <- compare_practice_test_performance(data)
```

## 质量控制标准

### 数据有效性
- **最低准确率**: 整体准确率 > 60%
- **反应时范围**: 100ms < RT < 3000ms
- **参与度**: 遗漏率 < 40%
- **响应偏好**: 单一按键使用率 < 85%

### 性能标准
- **平均反应时**: > 200ms (排除预期反应)
- **反应时变异性**: CV < 1.0
- **学习证据**: 练习阶段显示改善

### 数据质量检查
```r
# 质量控制检查函数
quality_check <- function(data) {
  # 计算基本指标
  accuracy <- calculate_accuracy(data)
  mean_rt <- calculate_mean_rt(data)
  miss_rate <- calculate_miss_rate(data)
  response_bias <- calculate_response_bias(data)
  
  # 质量评级
  quality_score <- assess_data_quality(accuracy, mean_rt, miss_rate, response_bias)
  return(quality_score)
}
```

## 注意事项

1. **任务理解**: 确保参与者理解刺激-反应映射
2. **练习充分**: 提供足够练习达到稳定表现
3. **疲劳控制**: 合理控制试次数量和休息
4. **个体差异**: 考虑年龄、教育、运动能力等因素
5. **环境控制**: 标准化的测试环境和设备
6. **指导语统一**: 使用标准化的指导语和程序

## 数据预处理建议

### 异常值处理
- **极端RT**: 移除 < 100ms 或 > 3000ms 的反应时间
- **异常准确率**: 检查准确率异常低或异常高的被试
- **设备故障**: 识别和处理技术故障造成的数据异常

### 学习效应控制
- **练习阶段**: 分析练习阶段的学习曲线
- **基线建立**: 使用稳定表现建立个体基线
- **热身效应**: 考虑测试初期的热身效应

### 个体化分析
- **能力分层**: 根据基线能力进行分层分析
- **反应风格**: 识别个体的反应风格 (快速vs保守)
- **一致性评估**: 评估个体表现的一致性

### 报告生成
- **个人报告**: 个体认知速度和准确性剖析
- **规范比较**: 与年龄、教育匹配的规范群体比较
- **改善建议**: 基于表现特点的认知训练建议
- **追踪分析**: 支持纵向研究的变化追踪