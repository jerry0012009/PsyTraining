# Save Data Documentation - Digit Span Task

## 数据输出格式

### 基本信息
- **框架**: jsPsych + Poldrack plugins
- **输出格式**: JSON数据 (POST) 或 CSV文件 (备份)
- **保存机制**: 双重保存 - 服务器POST + 本地CSV下载
- **任务类型**: 数字广度测试 (Digit Span Test)
- **集成系统**: Experiment Factory兼容

## 保存流程

1. **实时数据收集**: 每个试次的数字序列、反应、正确性实时记录
2. **实验结束**: 数据首先尝试POST到/save端点
3. **本地备份**: 服务器保存失败时自动下载CSV文件
4. **文件命名**: `digit-span_results.csv`

```javascript
// jsPsych数据保存流程
jsPsych.init({
    timeline: digit_span_experiment,
    on_trial_finish: function(data) {
        addID('digit-span');
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
            success: function() { 
                document.location = "/next" 
            },
            error: function() {
                // 服务器保存失败时本地保存
                jsPsych.data.localSave('digit-span_results.csv', 'csv');
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
| `key_press` | array/string | 按键序列或键盘输入 |
| `correct` | boolean | 回忆是否正确 |
| `trial_type` | string | 试次类型 |
| `trial_index` | number | 试次序号 |
| `time_elapsed` | number | 从实验开始的累计时间 |
| `sequence` | array | 呈现的数字序列 |
| `response` | array | 被试回忆的数字序列 |
| `num_digits` | number | 当前序列长度 |
| `condition` | string | 任务条件 ("forward", "reverse") |
| `exp_stage` | string | 实验阶段 ("test") |
| `trial_id` | string | 试次标识 |
| `exp_id` | string | 实验ID ("digit_span") |

### 任务阶段

**正向数字广度 (Forward Span)**
- 按照呈现顺序回忆数字序列
- 从3位数字开始，成功后增加长度
- 连续2次错误后减少长度
- `condition`: "forward"

**逆向数字广度 (Reverse Span)**
- 按照倒序回忆数字序列
- 同样的自适应难度调整
- `condition`: "reverse"

### 刺激参数
- **数字范围**: 1-9
- **呈现时间**: 800ms/数字
- **间隔时间**: 200ms
- **相邻数字限制**: 数字差异>2避免相似
- **初始长度**: 3位数字
- **最大错误**: 连续2次错误后降级

## 示例数据

### CSV格式输出示例

```csv
rt,sequence,response,num_digits,correct,condition,trial_type,trial_index,time_elapsed,trial_id,exp_id
5420,[3,7,1],true,forward,single-stim-button,5,25600,response,digit_span
3200,[5,9,2,8],"[5,9,2,8]",4,true,forward,single-stim-button,6,28800,response,digit_span  
7850,[6,3,1,9,4],"[6,3,1,4]",5,false,forward,single-stim-button,7,36650,response,digit_span
4100,[2,8,5],"[5,8,2]",3,true,reverse,single-stim-button,20,75200,response,digit_span
-1,"[4,7,9,1]",-1,4,false,reverse,poldrack-multi-stim-multi-response,21,79300,stim,digit_span
```

### JSON格式转换示例

```json
{
  "experiment_metadata": {
    "experiment_id": "digit_span",
    "subject_id": "sub_001", 
    "start_time": "2024-01-01T14:00:00Z",
    "completion_time": "2024-01-01T14:12:00Z",
    "total_duration": 720000,
    "task_version": "forward_reverse"
  },
  "performance_summary": {
    "forward_span": {
      "max_span": 6,
      "trials_completed": 14,
      "accuracy_rate": 0.71,
      "mean_rt": 4235.8
    },
    "reverse_span": {
      "max_span": 4,
      "trials_completed": 14,
      "accuracy_rate": 0.57,
      "mean_rt": 5847.2
    },
    "total_span_score": 10
  },
  "trial_data": [
    {
      "trial_index": 5,
      "condition": "forward",
      "sequence": [3, 7, 1],
      "response": [3, 7, 1], 
      "num_digits": 3,
      "correct": true,
      "rt": 5420,
      "trial_id": "response"
    },
    {
      "trial_index": 20,
      "condition": "reverse",
      "sequence": [2, 8, 5],
      "response": [5, 8, 2],
      "num_digits": 3,
      "correct": true,
      "rt": 4100,
      "trial_id": "response"
    }
  ],
  "cognitive_metrics": {
    "working_memory": {
      "forward_digit_span": 6,
      "reverse_digit_span": 4,
      "total_digit_span": 10,
      "span_difference": 2
    },
    "learning_memory": {
      "serial_position_curve": [0.9, 0.8, 0.6, 0.4],
      "primacy_effect": 0.9,
      "recency_effect": 0.4,
      "memory_strategy": "rehearsal"
    },
    "executive_function": {
      "cognitive_flexibility": 0.67,
      "mental_manipulation": 0.57,
      "attention_control": 0.74
    },
    "processing_speed": {
      "encoding_speed": 892.3,
      "retrieval_speed": 4235.8,
      "response_efficiency": 0.73
    }
  }
}
```

## 任务机制

### 基本范式
- **编码阶段**: 数字序列依次呈现在屏幕中央
- **维持阶段**: 短暂间隔期间保持数字序列在工作记忆中
- **回忆阶段**: 使用数字键盘输入回忆的序列
- **反馈阶段**: 显示正确/错误反馈

### 自适应算法
- **成功策略**: 正确回忆→序列长度+1
- **失败策略**: 连续2次错误→序列长度-1  
- **最小长度**: 保持在1位以上
- **终止条件**: 完成预设试次数

### 任务条件
1. **正向广度**: 按呈现顺序回忆
2. **逆向广度**: 按相反顺序回忆
3. **数字生成**: 避免相邻数字差异<2
4. **时间控制**: 固定呈现时间和间隔

## 认知指标评估

### 工作记忆 (workingMemory)

**容量评估 (capacityAssessment)**
- `forward_digit_span`: 正向数字广度
- `reverse_digit_span`: 逆向数字广度  
- `total_span_score`: 总广度得分
- `span_asymmetry`: 正向-逆向差异

**记忆策略 (memoryStrategies)**
- `serial_rehearsal`: 顺序复述策略
- `chunking_strategy`: 组块化策略
- `visual_coding`: 视觉编码使用
- `verbal_coding`: 言语编码偏好

### 学习与记忆 (learningMemory)

**序列学习 (serialLearning)**
- `serial_position_effects`: 序列位置效应
- `primacy_effect`: 首位效应强度
- `recency_effect`: 近因效应强度
- `serial_order_memory`: 序列顺序记忆

**记忆巩固 (memoryConsolidation)**
- `immediate_recall`: 即时回忆能力
- `memory_span_growth`: 记忆广度增长
- `interference_resistance`: 抗干扰能力
- `forgetting_curve`: 遗忘曲线特征

### 执行功能 (executiveFunction)

**认知控制 (cognitiveControl)**
- `attention_control`: 注意控制能力
- `interference_resolution`: 干扰解决
- `cognitive_flexibility`: 认知灵活性（正向vs逆向）
- `mental_manipulation`: 心理操作能力

**工作记忆更新 (workingMemoryUpdating)**
- `information_updating`: 信息更新能力
- `memory_monitoring`: 记忆监控
- `strategic_control`: 策略控制
- `resource_allocation`: 资源分配效率

### 处理速度 (processingSpeed)

**编码速度 (encodingSpeed)**
- `digit_encoding_rate`: 数字编码速率
- `sequence_processing`: 序列处理速度
- `visual_processing`: 视觉处理效率
- `attention_capture`: 注意捕获速度

**提取速度 (retrievalSpeed)**
- `memory_access`: 记忆访问速度
- `response_generation`: 反应生成时间
- `output_efficiency`: 输出效率
- `decision_latency`: 决策延迟

## 临床/研究应用

### 神经心理评估
- **工作记忆障碍**: 评估各类工作记忆缺陷
- **注意缺陷**: ADHD等注意问题的工作记忆评估
- **执行功能**: 前额叶相关的执行控制评估
- **记忆障碍**: 轻度认知障碍的早期筛查

### 认知老化研究
- **工作记忆衰退**: 年龄相关的工作记忆能力下降
- **认知资源**: 认知资源的年龄变化
- **策略差异**: 不同年龄群体的记忆策略
- **神经代偿**: 老化过程中的认知代偿机制

### 临床诊断应用
- **阿尔茨海默病**: 早期记忆功能筛查
- **精神分裂症**: 工作记忆相关的认知缺陷
- **学习障碍**: 学习困难的认知基础评估
- **脑损伤**: 脑外伤后的认知功能评估

### 教育评估研究
- **学业能力**: 工作记忆与学业成就的关系
- **认知训练**: 工作记忆训练的效果评估
- **个体差异**: 学习能力的个体差异分析
- **发展轨迹**: 工作记忆的发展变化

## 数据分析方法

### 基础分析

```r
# R代码示例 - 数字广度分析
# 计算正向和逆向广度
forward_trials <- data[data$condition == "forward" & data$trial_id == "response", ]
reverse_trials <- data[data$condition == "reverse" & data$trial_id == "response", ]

# 计算最大广度
max_forward_span <- max(forward_trials$num_digits[forward_trials$correct == TRUE])
max_reverse_span <- max(reverse_trials$num_digits[reverse_trials$correct == TRUE])
total_span_score <- max_forward_span + max_reverse_span

# 分析序列位置效应
serial_position_analysis <- analyze_serial_position_curve(data)

# 反应时间分析
encoding_rt <- mean(data$rt[data$trial_id == "stim"], na.rm = TRUE)
recall_rt <- mean(data$rt[data$trial_id == "response"], na.rm = TRUE)

# 错误分析
error_types <- classify_memory_errors(data)
```

### 高级分析

**工作记忆模型**
```r
# 工作记忆容量建模
library(psychometric)
wm_capacity <- estimate_wm_capacity(data)

# Cowan模型分析
cowan_k <- calculate_cowan_k(data)

# 时间衰减模型
decay_model <- fit_decay_model(data)
```

**认知策略分析**
```r
# 识别记忆策略
strategy_indicators <- identify_memory_strategies(data)

# 策略效果分析  
strategy_effectiveness <- analyze_strategy_effectiveness(data)

# 个体策略偏好
individual_strategies <- profile_individual_strategies(data)
```

## 质量控制标准

### 数据有效性
- **最小试次数**: 每个条件至少完成10个试次
- **参与度检查**: 避免随机输入行为
- **任务理解**: 确保理解正向/逆向指导语
- **反应合理性**: 回忆序列长度匹配呈现序列

### 认知有效性
- **广度范围**: 正向广度3-9位，逆向广度2-7位
- **条件差异**: 正向广度通常大于逆向广度
- **学习效应**: 显示一定的练习效应
- **一致性检查**: 相似难度试次的一致表现

### 数据筛选
```r
# 质量控制函数
quality_control <- function(data) {
    # 检查试次完成度
    completion_rate <- check_completion_rate(data)
    
    # 检查反应合理性
    response_validity <- check_response_validity(data)
    
    # 检查广度合理性
    span_plausibility <- check_span_plausibility(data)
    
    # 综合质量评级
    quality_score <- integrate_quality_metrics(completion_rate, 
                                              response_validity, 
                                              span_plausibility)
    return(quality_score)
}
```

## 注意事项

1. **指导语理解**: 确保被试理解正向和逆向的区别
2. **练习充分**: 提供足够练习熟悉数字键盘操作
3. **速度要求**: 强调准确性重于速度
4. **疲劳控制**: 合理控制总试次数和休息时间
5. **年龄适应**: 根据年龄调整起始难度和标准
6. **个体差异**: 考虑教育程度对数字工作记忆的影响

## 数据预处理建议

### 异常值处理
- **极端广度**: 处理明显超出正常范围的广度值
- **反应时异常**: 识别过快或过慢的反应时间
- **随机反应**: 检测随机输入模式
- **系统性错误**: 识别特定类型的系统性错误

### 能力估计
- **自适应估计**: 基于自适应程序估计真实能力
- **置信区间**: 计算能力估计的置信区间
- **测量误差**: 估计测量的标准误差
- **可靠性分析**: 评估测量的内部一致性

### 发展性分析
- **年龄规范**: 建立年龄特异性规范
- **发展轨迹**: 追踪个体工作记忆的发展
- **关键期识别**: 识别工作记忆发展的关键期
- **预测模型**: 基于早期表现预测后续发展

### 报告生成
- **个人档案**: 个体工作记忆能力的详细分析
- **优势识别**: 识别相对优势（正向vs逆向）
- **训练建议**: 提供基于评估的训练建议
- **进步追踪**: 支持纵向评估的变化追踪