# Save Data Documentation - Dietary Decision Task

## 数据输出格式

### 基本信息
- **框架**: jsPsych + Poldrack plugins
- **输出格式**: JSON数据 (POST) 或 CSV文件 (备份)
- **保存机制**: 双重保存 - 服务器POST + 本地CSV下载
- **任务类型**: 饮食决策任务 (Dietary Decision Task)
- **集成系统**: Experiment Factory兼容

## 保存流程

1. **实时数据收集**: 三个阶段的评分数据实时记录 - 健康评分、口味评分、决策选择
2. **实验结束**: 数据首先尝试POST到/save端点
3. **本地备份**: 服务器保存失败时自动下载CSV文件
4. **文件命名**: `dietary-decision_results.csv`

```javascript
// jsPsych数据保存流程
jsPsych.init({
    timeline: dietary_decision_experiment,
    on_trial_finish: function(data) {
        addID('dietary-decision');
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
                jsPsych.data.localSave('dietary-decision_results.csv', 'csv');
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
| `mouse_click` | string | 点击的按钮ID |
| `coded_response` | number | 编码后的反应 (-2到+2的量表) |
| `trial_type` | string | 试次类型 |
| `trial_index` | number | 试次序号 |
| `time_elapsed` | number | 从实验开始的累计时间 |
| `stim` | string | 刺激食物名称 |
| `trial_num` | number | 当前阶段的试次编号 |
| `exp_stage` | string | 实验阶段 |
| `trial_id` | string | 试次标识 |
| `exp_id` | string | 实验ID ("dietary_decision") |
| `reference` | string | 参考食物名称 (决策阶段) |
| `stim_rating` | string | 目标食物的健康和口味评分 |
| `reference_rating` | string | 参考食物的评分 |
| `credit_var` | boolean | 数据质量指标 |

### 实验阶段

**健康评分阶段 (Health Rating)**
- 评估每种食物的健康程度
- 5点量表: 非常不健康(-2) 到 非常健康(+2)
- `exp_stage`: "health_rating"
- 顺序随机化，避免口味偏见

**口味评分阶段 (Taste Rating)**
- 评估每种食物的美味程度
- 5点量表: 非常不好吃(-2) 到 非常好吃(+2)
- `exp_stage`: "taste_rating"
- 与健康评分阶段顺序随机化

**决策选择阶段 (Decision Phase)**
- 在目标食物和中性参考食物之间选择
- 5点量表: 强烈拒绝(-2) 到 强烈选择(+2)
- `exp_stage`: "decision"
- 参考食物基于健康和口味的中位数选择

### 刺激材料
包含48种食物图片，涵盖健康-不健康和美味-不美味的各种组合：
- **健康食物**: 香蕉、蓝莓酸奶、胡萝卜、芹菜、草莓、葡萄等
- **不健康食物**: 巧克力棒、薯片、曲奇、冰淇淋、糖果等
- **中性食物**: 饼干、麦片棒等

## 示例数据

### CSV格式输出示例

```csv
rt,mouse_click,coded_response,stim,trial_num,exp_stage,trial_type,trial_index,time_elapsed,trial_id,exp_id
2340,Healthy,1,banana,0,health_rating,single-stim-button,5,15600,stim,dietary_decision
1890,Very_Good,2,banana,0,taste_rating,single-stim-button,53,89400,stim,dietary_decision
3120,Strong_No,-2,100Grand,1,health_rating,single-stim-button,6,18720,stim,dietary_decision
2456,Very_Good,2,100Grand,1,taste_rating,single-stim-button,54,91856,stim,dietary_decision
4200,Yes,1,banana,0,decision,single-stim-button,101,145600,stim,dietary_decision
2800,Strong_No,-2,100Grand,1,decision,single-stim-button,102,148400,stim,dietary_decision
```

### JSON格式转换示例

```json
{
  "experiment_metadata": {
    "experiment_id": "dietary_decision",
    "subject_id": "sub_001",
    "start_time": "2024-01-01T10:00:00Z",
    "completion_time": "2024-01-01T10:15:00Z",
    "total_duration": 900000,
    "food_stimuli_count": 48,
    "phase_order": ["health_first", "taste_second"]
  },
  "performance_summary": {
    "health_ratings": {
      "completed_trials": 48,
      "mean_rt": 2845.3,
      "rating_distribution": {
        "very_unhealthy": 12,
        "unhealthy": 8,
        "neutral": 6,
        "healthy": 14,
        "very_healthy": 8
      }
    },
    "taste_ratings": {
      "completed_trials": 48,
      "mean_rt": 2234.7,
      "rating_distribution": {
        "very_bad": 6,
        "bad": 8,
        "neutral": 12,
        "good": 15,
        "very_good": 7
      }
    },
    "decision_choices": {
      "completed_trials": 47,
      "mean_rt": 3456.8,
      "choice_distribution": {
        "strong_no": 15,
        "no": 8,
        "neutral": 6,
        "yes": 12,
        "strong_yes": 6
      }
    },
    "credit_var": true
  },
  "food_ratings": [
    {
      "food": "banana",
      "health_rating": 1,
      "taste_rating": 2,
      "decision_choice": 1,
      "decision_rt": 4200,
      "reference_comparison": "vs_neutral_cracker"
    },
    {
      "food": "100Grand",
      "health_rating": -2,
      "taste_rating": 2,
      "decision_choice": -2,
      "decision_rt": 2800,
      "reference_comparison": "vs_neutral_cracker"
    }
  ],
  "cognitive_metrics": {
    "decision_making": {
      "health_weight": 0.65,
      "taste_weight": 0.72,
      "decision_consistency": 0.78,
      "preference_coherence": 0.83
    },
    "self_control": {
      "healthy_choice_rate": 0.62,
      "temptation_resistance": 0.54,
      "conflict_resolution": 0.67
    },
    "value_based_choice": {
      "multi_attribute_integration": 0.71,
      "preference_stability": 0.76,
      "choice_confidence": 0.69
    }
  }
}
```

## 任务机制

### 基本范式
- **评分阶段**: 分别对食物的健康性和美味性进行评分
- **决策阶段**: 在目标食物和中性参考食物之间做出选择
- **时间限制**: 每个试次4秒时间限制
- **反馈**: 无即时反馈，避免学习效应

### 实验设计特点
1. **随机化**:
   - 健康和口味评分阶段的顺序随机化
   - 每个阶段内食物呈现顺序随机化
   - 参考食物基于个体评分动态选择

2. **参考食物选择**:
   - 基于健康和口味评分的中位数
   - 选择距离中位数最近的食物作为参考
   - 确保决策冲突的个体化

3. **反应编码**:
   - 所有评分转换为-2到+2的数值
   - 负值表示不健康/不好吃/拒绝
   - 正值表示健康/好吃/选择

### 认知过程模拟
- **属性评估**: 分离健康和口味属性的独立评估
- **价值整合**: 决策阶段整合多个属性信息
- **冲突解决**: 当健康和口味冲突时的选择策略
- **自我控制**: 抵制不健康但美味食物的能力

## 认知指标评估

### 决策制定 (decisionMaking)

**多属性决策 (multiAttributeDecision)**
- `health_weighting`: 健康属性的权重
- `taste_weighting`: 口味属性的权重  
- `attribute_integration`: 多属性整合能力
- `preference_coherence`: 偏好一致性

**价值基础选择 (valueBasedChoice)**
- `choice_consistency`: 选择一致性
- `preference_stability`: 偏好稳定性
- `decision_confidence`: 决策信心
- `choice_rationality`: 选择理性程度

### 自我控制 (selfControl)

**抑制控制 (inhibitoryControl)**
- `temptation_resistance`: 诱惑抵抗能力
- `impulse_control`: 冲动控制
- `delayed_gratification`: 延迟满足
- `self_regulation`: 自我调节能力

**冲突监控 (conflictMonitoring)**
- `conflict_detection`: 冲突检测敏感性
- `conflict_resolution`: 冲突解决效率
- `cognitive_control`: 认知控制强度
- `response_override`: 反应覆盖能力

### 执行功能 (executiveFunction)

**认知灵活性 (cognitiveFlexibility)**
- `set_shifting`: 注意集合转换
- `mental_flexibility`: 心理灵活性
- `adaptability`: 策略适应能力
- `context_updating`: 情境更新能力

**工作记忆 (workingMemory)**
- `information_maintenance`: 信息维持
- `attribute_tracking`: 属性追踪
- `preference_updating`: 偏好更新
- `decision_monitoring`: 决策监控

### 处理速度 (processingSpeed)

**评估效率 (evaluationEfficiency)**
- `health_evaluation_speed`: 健康评估速度
- `taste_evaluation_speed`: 口味评估速度
- `decision_speed`: 决策制定速度
- `response_efficiency`: 反应效率

**信息整合速度 (integrationSpeed)**
- `attribute_integration_time`: 属性整合时间
- `preference_access_speed`: 偏好访问速度
- `choice_generation_time`: 选择生成时间
- `conflict_resolution_speed`: 冲突解决速度

## 临床/研究应用

### 饮食行为研究
- **饮食决策**: 健康饮食选择的认知机制
- **肥胖研究**: 肥胖与食物选择偏好的关系
- **饮食干预**: 饮食行为改变的认知基础
- **营养教育**: 营养知识对食物选择的影响

### 自我控制评估
- **冲动控制**: 冲动性饮食行为的评估
- **延迟满足**: 即时满足与长期健康的权衡
- **意志力**: 抵制诱惑的认知资源
- **自我调节**: 目标导向行为的维持能力

### 临床心理学应用
- **饮食障碍**: 神经性厌食症、暴食症的认知评估
- **成瘾行为**: 食物成瘾的认知神经机制
- **情绪调节**: 情绪性进食的认知控制
- **冲动障碍**: 冲动性行为的评估和干预

### 健康行为研究
- **健康促进**: 健康行为选择的认知促进因素
- **风险行为**: 不健康选择的认知风险因素
- **行为改变**: 健康行为改变的认知机制
- **预防医学**: 疾病预防行为的认知基础

## 数据分析方法

### 基础分析

```r
# R代码示例 - 饮食决策分析
# 计算各阶段的基本指标
health_data <- data[data$exp_stage == "health_rating" & data$trial_id == "stim", ]
taste_data <- data[data$exp_stage == "taste_rating" & data$trial_id == "stim", ]
decision_data <- data[data$exp_stage == "decision" & data$trial_id == "stim", ]

# 计算评分分布
health_distribution <- table(health_data$coded_response)
taste_distribution <- table(taste_data$coded_response)
decision_distribution <- table(decision_data$coded_response)

# 分析反应时间
health_rt <- mean(health_data$rt, na.rm = TRUE)
taste_rt <- mean(taste_data$rt, na.rm = TRUE)
decision_rt <- mean(decision_data$rt, na.rm = TRUE)

# 计算健康选择率
healthy_choices <- sum(decision_data$coded_response > 0, na.rm = TRUE)
total_choices <- sum(!is.na(decision_data$coded_response))
healthy_choice_rate <- healthy_choices / total_choices
```

### 高级分析

**决策权重建模**
```r
# 多属性效用模型
library(conjoint)
decision_model <- lm(coded_response ~ health_rating + taste_rating, 
                    data = integrated_data)

# 计算属性权重
health_weight <- abs(coef(decision_model)["health_rating"])
taste_weight <- abs(coef(decision_model)["taste_rating"])

# 权重标准化
total_weight <- health_weight + taste_weight
health_weight_norm <- health_weight / total_weight
taste_weight_norm <- taste_weight / total_weight
```

**自我控制分析**
```r
# 识别冲突试次 (健康低但口味高)
conflict_trials <- identify_conflict_trials(data)

# 计算自我控制指标
self_control_score <- calculate_self_control(conflict_trials)

# 冲突解决效率
conflict_resolution_rt <- analyze_conflict_rt(conflict_trials)
```

**个体差异建模**
```r
# 聚类分析识别决策类型
library(cluster)
decision_profiles <- create_decision_profiles(data)
cluster_analysis <- kmeans(decision_profiles, centers = 3)

# 决策类型:
# 1. Health-focused (健康导向型)
# 2. Taste-focused (口味导向型)  
# 3. Balanced (平衡型)
```

## 质量控制标准

### 数据有效性
- **完成度**: 三个阶段的完成率 > 80%
- **反应时范围**: 200ms < RT < 4000ms
- **评分合理性**: 避免极端一致的评分模式
- **注意检查**: 注意检查试次的准确率 > 65%

### 认知有效性
- **评分一致性**: 相似食物的评分一致性
- **决策逻辑**: 决策选择与评分的逻辑一致性
- **偏好稳定性**: 跨试次偏好的稳定性
- **反应变异性**: 避免机械化反应模式

### 数据质量检查
```r
# 质量控制函数
quality_assessment <- function(data) {
    # 检查完成度
    completion_rate <- check_phase_completion(data)
    
    # 检查反应时合理性
    rt_validity <- check_reaction_time_validity(data)
    
    # 检查评分一致性
    rating_consistency <- check_rating_consistency(data)
    
    # 检查决策逻辑
    decision_logic <- check_decision_logic(data)
    
    # 综合质量评分
    quality_score <- integrate_quality_metrics(completion_rate, 
                                             rt_validity,
                                             rating_consistency, 
                                             decision_logic)
    return(quality_score)
}
```

## 注意事项

1. **指导语清晰**: 确保被试理解健康性和美味性的区别
2. **图片标准化**: 使用标准化的食物图片库
3. **文化适应**: 考虑不同文化背景对食物的认知差异
4. **个体差异**: 考虑年龄、性别、饮食习惯等因素
5. **时间控制**: 避免过度思考，保持自然决策
6. **疲劳控制**: 合理安排休息，避免决策疲劳

## 数据预处理建议

### 异常值处理
- **极端反应时**: 移除过快或过慢的反应
- **异常评分**: 识别极端一致或矛盾的评分
- **不完整数据**: 处理未完成所有阶段的数据
- **注意失误**: 基于注意检查筛选有效数据

### 个体化分析
- **食物分类**: 基于个体评分对食物进行个体化分类
- **冲突识别**: 识别个体特异的健康-口味冲突试次
- **策略分析**: 分析个体的决策策略偏好
- **一致性评估**: 评估个体内部偏好的一致性

### 发展性研究
- **年龄比较**: 不同年龄群体的决策模式比较
- **发展轨迹**: 追踪饮食偏好和自我控制的发展
- **关键期研究**: 识别饮食行为发展的关键期
- **预测建模**: 基于早期模式预测后续饮食行为

### 报告生成
- **个人档案**: 个体饮食决策风格的详细分析
- **风险评估**: 不健康饮食行为的风险评估
- **干预建议**: 基于认知模式的个性化干预建议
- **进展追踪**: 支持饮食行为改变的长期追踪