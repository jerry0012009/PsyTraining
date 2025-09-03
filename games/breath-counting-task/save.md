# Save Data Documentation - Breath Counting Task

## 数据输出格式

### 基本信息
- **框架**: jsPsych + Poldrack plugins
- **输出格式**: CSV文件 (首选) 或POST到/save端点
- **保存机制**: 双重保存 - 服务器保存 + 本地CSV下载
- **任务类型**: 呼吸计数正念注意力训练任务
- **集成系统**: Experiment Factory兼容

## 保存流程

1. **实时数据收集**: 每次按键和刺激呈现都被记录
2. **实验结束**: 数据首先尝试POST到/save端点
3. **本地备份**: 如果服务器保存失败，自动下载CSV文件
4. **文件命名**: `breath-counting-experiment_results.csv`

```javascript
// jsPsych数据保存流程
jsPsych.init({
    timeline: breath_counting_task_experiment,
    on_finish: function(data) {
        // 首先尝试服务器保存
        jsPsych.data.addDataToLastTrial({
            addID('breath-counting-experiment')
        });
        
        // POST到服务器
        $.ajax({
            type: "POST",
            url: '/save',
            data: jsPsych.data.get().csv(),
            success: function(data) {
                console.log('Data saved to server');
            },
            error: function() {
                // 服务器保存失败时本地保存
                jsPsych.data.localSave('breath-counting-experiment_results.csv', 'csv');
            }
        });
    }
});
```

## 数据结构

### CSV文件字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `rt` | number | 反应时间 (毫秒) |
| `key_press` | number | 按键编码 (40=下箭头, 39=上箭头, 13=回车) |
| `trial_type` | string | 试次类型 ("poldrack-single-stim", "poldrack-instructions") |
| `trial_index` | number | 试次序号 (从0开始) |
| `time_elapsed` | number | 实验开始后经过的总时间 (毫秒) |
| `internal_node_id` | string | jsPsych内部节点ID |
| `subject` | string | 被试ID (UUID格式) |
| `stimulus` | string | 呈现的刺激内容 (HTML) |
| `block_duration` | number | 当前区块持续时间 |
| `trial_id` | string | 试次标识 ("breath_counting", "instruction") |
| `possible_responses` | string | 允许的响应按键 |
| `stim_duration` | number | 刺激呈现时间 |
| `addingOnTrial` | string | 额外标记 ("added!") |
| `exp_id` | string | 实验ID |

### 任务阶段

**指导阶段**
- `trial_type`: "poldrack-instructions"
- `trial_id`: "instruction"
- 记录指导页面查看时间

**呼吸计数阶段**
- `trial_type`: "poldrack-single-stim"
- `trial_id`: "breath_counting"
- `key_press`: 40 (下箭头) 或 39 (上箭头)
- `rt`: 每次按键的反应时间

## 示例数据

### CSV格式输出示例

```csv
rt,key_press,trial_type,trial_index,time_elapsed,internal_node_id,subject,stimulus,trial_id,possible_responses
500,13,text,0,505,0.0-0.0,b5a8c975-6c24-4b71-91ed-d5de37562b2f,,instruction,
13814,40,poldrack-single-stim,3,239561,0.0-2.0,b5a8c975-6c24-4b71-91ed-d5de37562b2f,,breath_counting,"40,39"
5211,40,poldrack-single-stim,4,244775,0.0-3.0-0.0,b5a8c975-6c24-4b71-91ed-d5de37562b2f,,breath_counting,"40,39"
4042,40,poldrack-single-stim,5,248823,0.0-3.1-0.1,b5a8c975-6c24-4b71-91ed-d5de37562b2f,,breath_counting,"40,39"
3551,40,poldrack-single-stim,6,252376,0.0-3.2-0.2,b5a8c975-6c24-4b71-91ed-d5de37562b2f,,breath_counting,"40,39"
3366,40,poldrack-single-stim,8,258743,0.0-3.4-0.4,b5a8c975-6c24-4b71-91ed-d5de37562b2f,,breath_counting,"40,39"
4303,39,poldrack-single-stim,12,273407,0.0-3.8-0.8,b5a8c975-6c24-4b71-91ed-d5de37562b2f,,breath_counting,"40,39"
```

### JSON格式转换示例

```json
{
  "experiment_metadata": {
    "experiment_id": "breath-counting-task",
    "subject_id": "b5a8c975-6c24-4b71-91ed-d5de37562b2f",
    "start_time": "2024-01-01T12:00:00Z",
    "total_duration": 293047,
    "completion_status": "completed"
  },
  "task_performance": {
    "total_trials": 15,
    "breath_counting_trials": 14,
    "instruction_trials": 1,
    "average_rt": 3847.2,
    "rt_variability": 2156.8,
    "accuracy_indicators": {
      "consistent_responding": true,
      "attention_lapses": 1,
      "response_pattern": "regular"
    }
  },
  "breath_counting_data": [
    {
      "breath_number": 1,
      "rt": 13814,
      "key_press": 40,
      "time_elapsed": 239561
    },
    {
      "breath_number": 2,
      "rt": 5211,
      "key_press": 40,
      "time_elapsed": 244775
    },
    {
      "breath_number": 9,
      "rt": 4303,
      "key_press": 39,
      "time_elapsed": 273407,
      "note": "possible_mind_wandering"
    }
  ],
  "mindfulness_metrics": {
    "attention_stability": {
      "rt_consistency": 0.72,
      "response_regularity": 0.85,
      "sustained_attention": 0.78
    },
    "awareness_quality": {
      "mind_wandering_episodes": 1,
      "catch_trials_accuracy": 0.93,
      "metacognitive_awareness": 0.81
    },
    "breathing_pattern": {
      "average_breath_interval": 3847,
      "breath_rate_variability": 0.34,
      "rhythmic_consistency": 0.76
    }
  }
}
```

## 任务机制

### 呼吸计数协议
- **基础任务**: 参与者闭眼数呼吸，每次呼气后按下箭头键
- **计数范围**: 通常从1数到9，然后重新开始
- **按键映射**: 下箭头(40) = 正常计数，上箭头(39) = 注意到分心重新开始
- **时间长度**: 通常5-10分钟的持续练习

### 注意力监测
- **分心检测**: 参与者意识到分心时按上箭头键重新开始计数
- **节律分析**: 通过反应时间间隔评估呼吸节律一致性
- **专注度评估**: 基于响应模式和时间变异性

### 正念训练目标
- **当下觉知**: 培养对当前时刻呼吸的觉察
- **注意力稳定**: 训练持续专注于单一对象的能力
- **元认知觉知**: 发展对分心的觉察和重新专注的能力

## 认知指标评估

### 注意力功能 (attention)

**持续注意 (sustainedAttention)**
- `attentionSpan`: 注意维持时间 (基于试次总时长)
- `consistencyIndex`: 反应时间一致性指数
- `focusStability`: 专注稳定性 (RT变异性的倒数)

**选择性注意 (selectiveAttention)**
- `distractorResistance`: 抗干扰能力 (分心重置频率的倒数)
- `targetDetection`: 目标检测准确性

### 执行功能 (executiveFunction)

**认知控制 (cognitiveControl)**
- `inhibitionControl`: 抑制控制 (不当按键的抑制)
- `cognitiveFlexibility`: 认知灵活性 (分心后重新聚焦)

**工作记忆 (workingMemory)**
- `sequentialMemory`: 序列记忆 (呼吸计数的准确性)
- `spatialWorkingMemory`: 空间工作记忆

### 正念特质 (mindfulness)

**觉知能力 (awareness)**
- `mindfulAwareness`: 正念觉知 (元认知准确性)
- `presentMomentFocus`: 当下专注度
- `bodyAwareness`: 身体觉知 (呼吸感知)

**接纳态度 (acceptance)**
- `nonReactivity`: 非反应性 (对分心的接纳)
- `nonJudgment`: 非评判态度

## 临床/研究应用

### 正念训练评估
- **正念减压 (MBSR)**: 评估正念减压训练效果
- **正念认知疗法 (MBCT)**: 抑郁复发预防的注意力训练
- **正念练习**: 日常正念练习质量的客观评估

### 注意力障碍诊断
- **ADHD评估**: 持续注意缺陷的客观测量
- **焦虑症状**: 注意偏向和注意稳定性评估
- **创伤后应激**: 注意控制和元认知觉知评估

### 冥想研究
- **冥想深度**: 客观评估冥想状态的深度和质量
- **专注力训练**: 专注力训练前后的能力变化
- **正念特质**: 个体正念特质的行为测量

### 神经心理评估
- **前额叶功能**: 执行注意和认知控制评估
- **默认网络**: 分心和自我参照思维的测量
- **内感受觉知**: 身体内部信号的觉察能力

## 数据分析方法

### 基础性能指标

```r
# R代码示例 - 呼吸计数分析
# 计算平均反应时间
avg_rt <- mean(data$rt[data$trial_id == "breath_counting"], na.rm = TRUE)

# 反应时间变异性 (专注稳定性指标)
rt_cv <- sd(data$rt[data$trial_id == "breath_counting"], na.rm = TRUE) / avg_rt

# 分心重置频率 (上箭头按键频率)
mind_wandering_rate <- sum(data$key_press == 39, na.rm = TRUE) / 
                      sum(data$trial_id == "breath_counting", na.rm = TRUE)

# 呼吸节律一致性
breath_intervals <- diff(data$time_elapsed[data$trial_id == "breath_counting"])
rhythm_consistency <- 1 - (sd(breath_intervals) / mean(breath_intervals))
```

### 时间序列分析
- **趋势分析**: 练习过程中专注度的变化趋势
- **周期性检测**: 呼吸节律的规律性分析
- **变点检测**: 注意状态转换点的识别

### 个体差异分析
- **基线能力**: 个体初始专注能力水平
- **学习效应**: 练习过程中的改善程度
- **稳定性特征**: 个体特有的注意稳定性模式

## 质量控制标准

### 数据有效性
- **最小持续时间**: 至少5分钟的连续练习
- **响应率检查**: 避免过度频繁或过度稀少的按键
- **任务理解**: 确保参与者理解任务要求

### 技术质量
- **时间精度**: 毫秒级的时间记录精度
- **按键响应**: 确保按键响应的准确记录
- **数据完整性**: 检查数据丢失或损坏

## 注意事项

1. **任务理解**: 确保参与者充分理解呼吸计数和分心报告机制
2. **练习时间**: 提供足够的练习以熟悉任务
3. **环境控制**: 安静、舒适的测试环境
4. **个体差异**: 考虑冥想经验、年龄等个体因素
5. **文化适应**: 考虑不同文化背景对正念练习的理解
6. **疲劳控制**: 合理控制练习时长避免疲劳

## 数据预处理建议

### 异常值处理
- **极端RT**: 过短(<500ms)或过长(>30s)的反应时间
- **异常模式**: 明显非正常的响应模式
- **技术故障**: 因设备问题造成的数据异常

### 心理生理整合
- **呼吸监测**: 结合实际呼吸测量验证任务表现
- **心率变异**: 整合HRV数据评估自主神经功能
- **脑电活动**: 结合EEG分析注意状态

### 个体化分析
- **基线校正**: 使用个体基线进行标准化
- **适应期识别**: 识别任务适应期和稳定期
- **个性化建议**: 基于表现模式提供个性化训练建议

### 报告建议
- **正念能力剖析**: 多维度正念能力评估
- **训练效果**: 前后对比显示训练效果
- **个性化反馈**: 基于表现特点的个性化建议
- **长期追踪**: 支持长期正念练习的追踪分析