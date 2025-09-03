# Save Data Documentation - Columbia Card Task (Hot Version)

## 数据输出格式

### 基本信息
- **框架**: jsPsych + Poldrack plugins
- **输出格式**: JSON数据 (POST) 或 CSV文件 (备份)
- **保存机制**: 双重保存 - 服务器POST + 本地CSV下载
- **任务类型**: 哥伦比亚卡片任务-热认知版 (Columbia Card Task - Hot)
- **集成系统**: Experiment Factory兼容

## 保存流程

1. **实时数据收集**: 每个回合的卡片翻牌决策、风险选择、分数变化实时记录
2. **实验结束**: 数据首先尝试POST到/save端点
3. **本地备份**: 服务器保存失败时自动下载CSV文件
4. **文件命名**: `columbia-card-task-hot_results.csv`

```javascript
// jsPsych数据保存流程
jsPsych.init({
    timeline: columbia_card_task_hot_experiment,
    on_trial_finish: function(data) {
        addID('columbia-card-task-hot');
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
                jsPsych.data.localSave('columbia-card-task-hot_results.csv', 'csv');
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
| `mouse_click` | string | 点击的元素ID |
| `trial_type` | string | 试次类型 |
| `trial_index` | number | 试次序号 |
| `time_elapsed` | number | 从实验开始的累计时间 |
| `which_round` | number | 当前回合编号 (1-28) |
| `num_click_in_round` | number | 回合内的点击次数 |
| `num_loss_cards` | number | 当前回合的损失卡片数量 |
| `gain_amount` | number | 获利卡片的分值 |
| `loss_amount` | number | 损失卡片的分值 |
| `round_points` | number | 当前回合的得分 |
| `clicked_on_loss_card` | boolean | 是否点击了损失卡片 |
| `round_type` | string | 回合类型 |
| `trial_id` | string | 试次标识 |
| `exp_stage` | string | 实验阶段 |
| `exp_id` | string | 实验ID ("columbia_card_task_hot") |
| `credit_var` | boolean | 数据质量指标 |
| `performance_var` | number | 表现评分 |
| `reward` | array | 奖励计算的三个回合分数 |

### 任务参数

**回合设置**
- **总回合数**: 28回合
- **获胜回合**: 24回合 (预设获胜)
- **失败回合**: 4回合 (预设翻到损失卡片)
- **损失卡片**: 每回合1张或3张
- **获利分值**: 每张10分或30分
- **损失分值**: 每张250分或750分

**参数组合** (8种组合×3重复=24回合)
```javascript
paramsArray = [
    [1, 10, 250],   // 1张损失卡，10分获利，250分损失
    [1, 10, 750],   // 1张损失卡，10分获利，750分损失
    [1, 30, 250],   // 1张损失卡，30分获利，250分损失
    [1, 30, 750],   // 1张损失卡，30分获利，750分损失
    [3, 10, 250],   // 3张损失卡，10分获利，250分损失
    [3, 10, 750],   // 3张损失卡，10分获利，750分损失
    [3, 30, 250],   // 3张损失卡，30分获利，250分损失
    [3, 30, 750]    // 3张损失卡，30分获利，750分损失
]
```

### 决策选项

**翻牌策略**
- **继续翻牌**: 点击卡片继续获得分数
- **停止翻牌**: 点击"STOP/Turn Over"保留当前分数
- **不取牌**: 点击"No Card"本回合得分为0
- **收集分数**: 回合结束后点击"Next Round"进入下一回合

### 回合结构
1. **回合开始**: 显示参数，重置分数为0
2. **翻牌阶段**: 连续翻牌获得分数，直到翻到损失卡或主动停止
3. **回合结束**: 显示所有卡片，计算最终分数
4. **分数收集**: 确认分数，进入下一回合

## 示例数据

### CSV格式输出示例

```csv
rt,mouse_click,which_round,num_click_in_round,num_loss_cards,gain_amount,loss_amount,round_points,clicked_on_loss_card,round_type,trial_type,trial_index,time_elapsed,trial_id,exp_stage,exp_id
3240,"5",1,1,1,30,250,30,false,rigged_win,single-stim-button,15,45600,stim,test,columbia_card_task_hot
2180,"12",1,2,1,30,250,60,false,rigged_win,single-stim-button,15,47780,stim,test,columbia_card_task_hot
4560,"endRoundButton",1,3,1,30,250,60,false,rigged_win,single-stim-button,15,52340,stim,test,columbia_card_task_hot
1890,"collectButton",1,4,1,30,250,60,false,rigged_win,single-stim-button,15,54230,stim,test,columbia_card_task_hot
2340,"3",2,1,3,10,750,10,false,rigged_win,single-stim-button,16,56570,stim,test,columbia_card_task_hot
1780,"15",2,2,3,10,750,-740,true,rigged_loss,single-stim-button,16,58350,stim,test,columbia_card_task_hot
3120,"collectButton",2,3,3,10,750,-740,true,rigged_loss,single-stim-button,16,61470,stim,test,columbia_card_task_hot
```

### JSON格式转换示例

```json
{
  "experiment_metadata": {
    "experiment_id": "columbia_card_task_hot",
    "subject_id": "sub_001",
    "start_time": "2024-01-01T14:30:00Z",
    "completion_time": "2024-01-01T14:55:00Z",
    "total_duration": 1500000,
    "total_rounds": 28,
    "rigged_win_rounds": 24,
    "rigged_loss_rounds": 4
  },
  "performance_summary": {
    "total_points": 1250,
    "average_points_per_round": 44.6,
    "reward_trials": [150, 90, 60],
    "final_reward": 300,
    "completion_rate": 1.0,
    "average_cards_turned": 2.8,
    "risk_tolerance": 0.65
  },
  "round_data": [
    {
      "round": 1,
      "parameters": {
        "loss_cards": 1,
        "gain_amount": 30,
        "loss_amount": 250
      },
      "decisions": [
        {"click": 1, "card_id": 5, "outcome": "gain", "points": 30},
        {"click": 2, "card_id": 12, "outcome": "gain", "points": 60},
        {"click": 3, "action": "stop", "final_points": 60}
      ],
      "round_type": "rigged_win",
      "total_cards_turned": 2,
      "round_points": 60,
      "risk_level": "moderate"
    },
    {
      "round": 2,
      "parameters": {
        "loss_cards": 3,
        "gain_amount": 10,
        "loss_amount": 750
      },
      "decisions": [
        {"click": 1, "card_id": 3, "outcome": "gain", "points": 10},
        {"click": 2, "card_id": 15, "outcome": "loss", "points": -740}
      ],
      "round_type": "rigged_loss",
      "total_cards_turned": 2,
      "round_points": -740,
      "risk_level": "high"
    }
  ],
  "cognitive_metrics": {
    "risk_taking": {
      "average_cards_per_round": 2.8,
      "risk_adjustment": 0.73,
      "loss_aversion": 1.25,
      "risk_sensitivity": 0.68
    },
    "decision_making": {
      "expected_value_sensitivity": 0.71,
      "probability_weighting": 0.64,
      "decision_consistency": 0.78,
      "learning_rate": 0.23
    },
    "impulse_control": {
      "premature_stopping": 0.32,
      "excessive_risk": 0.18,
      "emotional_regulation": 0.67
    },
    "cognitive_flexibility": {
      "strategy_switching": 0.55,
      "parameter_adaptation": 0.62,
      "context_sensitivity": 0.74
    }
  }
}
```

## 任务机制

### 基本范式
- **卡片翻牌**: 32张面朝下的卡片，包含获利卡片和损失卡片
- **即时反馈**: 翻牌后立即显示结果和当前分数
- **风险决策**: 在继续翻牌获得更多分数和保留当前分数之间做选择
- **回合终止**: 翻到损失卡片时回合立即结束

### 热认知特征
1. **即时反馈**: 每次翻牌后立即看到结果
2. **情绪体验**: 翻到损失卡片的负面情绪体验
3. **连续决策**: 每张卡片翻牌后都需要做出继续或停止的决策
4. **时间压力**: 相对于冷认知版本，决策时间更短

### 风险操控
- **损失概率**: 1/32 (低风险) 或 3/32 (高风险)
- **收益大小**: 10分 (小收益) 或 30分 (大收益)
- **损失大小**: 250分 (小损失) 或 750分 (大损失)
- **期望值**: 通过参数组合操控不同的期望值

### 实验操控
- **预设结果**: 24个获胜回合，4个失败回合
- **失败时机**: 随机确定在第几张卡片失败
- **参数平衡**: 8种参数组合的平衡呈现

## 认知指标评估

### 风险偏好 (riskTaking)

**风险寻求行为 (riskSeekingBehavior)**
- `average_cards_turned`: 平均翻牌数量
- `risk_tolerance`: 风险容忍度
- `high_risk_preference`: 高风险情境偏好
- `risky_choice_frequency`: 风险选择频率

**风险调节能力 (riskAdjustment)**
- `parameter_sensitivity`: 参数敏感性
- `adaptive_risk_taking`: 适应性风险承担
- `loss_aversion_coefficient`: 损失厌恶系数
- `probability_distortion`: 概率扭曲程度

### 决策制定 (decisionMaking)

**期望值计算 (expectedValueProcessing)**
- `ev_sensitivity`: 期望值敏感性
- `optimal_stopping`: 最优停止点
- `probability_weighting`: 概率权重
- `outcome_valuation`: 结果评估能力

**学习与适应 (learningAdaptation)**
- `experience_based_learning`: 基于经验的学习
- `parameter_learning`: 参数学习能力
- `strategy_updating`: 策略更新速度
- `performance_improvement`: 表现改善趋势

### 冲动控制 (impulseControl)

**行为抑制 (behavioralInhibition)**
- `premature_stopping`: 过早停止倾向
- `excessive_risk_taking`: 过度风险承担
- `loss_chasing`: 损失追逐行为
- `emotional_decision_making`: 情绪化决策

**自我调节 (selfRegulation)**
- `goal_directed_behavior`: 目标导向行为
- `temptation_resistance`: 诱惑抵抗能力
- `emotional_regulation`: 情绪调节能力
- `strategic_control`: 策略控制能力

### 执行功能 (executiveFunction)

**认知灵活性 (cognitiveFlexibility)**
- `strategy_switching`: 策略转换能力
- `set_shifting`: 注意集合转换
- `context_adaptation`: 情境适应能力
- `rule_learning`: 规则学习能力

**工作记忆 (workingMemory)**
- `parameter_tracking`: 参数追踪能力
- `outcome_monitoring`: 结果监控
- `decision_history_integration`: 决策历史整合
- `mental_accounting`: 心理账户管理

## 临床/研究应用

### 成瘾行为研究
- **赌博成瘾**: 病理性赌博的风险决策模式
- **物质成瘾**: 药物成瘾者的冲动控制评估
- **行为成瘾**: 网络成瘾等行为成瘾的认知机制
- **康复评估**: 成瘾康复过程中认知功能的恢复

### 情绪障碍评估
- **抑郁症**: 抑郁症患者的风险决策和动机缺陷
- **双相障碍**: 躁狂和抑郁期的风险偏好差异
- **焦虑障碍**: 焦虑对风险感知和决策的影响
- **情绪调节**: 情绪调节能力与决策质量的关系

### 神经发育评估
- **青少年发展**: 青少年风险决策的神经发育特征
- **ADHD评估**: 注意缺陷多动障碍的冲动控制评估
- **执行功能**: 前额叶执行功能的发展评估
- **认知成熟**: 认知控制的成熟度评估

### 临床神经心理学
- **前额叶损伤**: 前额叶皮层损伤的决策功能评估
- **边缘系统**: 边缘系统功能与情绪决策的关系
- **神经退行性疾病**: 帕金森病、阿尔茨海默病的决策功能
- **脑外伤**: 创伤性脑损伤的认知康复评估

## 数据分析方法

### 基础分析

```r
# R代码示例 - 哥伦比亚卡片任务分析
# 计算基本风险指标
test_data <- data[data$exp_stage == "test" & data$trial_id == "stim", ]

# 按回合分组分析
round_summary <- test_data %>%
  group_by(which_round) %>%
  summarise(
    cards_turned = max(num_click_in_round) - 1,
    final_points = last(round_points),
    loss_clicked = any(clicked_on_loss_card),
    round_type = first(round_type),
    .groups = 'drop'
  )

# 计算平均翻牌数
average_cards_turned <- mean(round_summary$cards_turned)

# 计算总得分
total_score <- sum(round_summary$final_points)

# 分析风险调节
risk_adjustment <- analyze_parameter_effects(round_summary)
```

### 高级分析

**期望值模型**
```r
# 期望值敏感性分析
library(nlme)

# 计算每个回合的期望值
calculate_expected_value <- function(cards_turned, loss_cards, gain_amount, loss_amount) {
  prob_no_loss <- (32 - loss_cards - cards_turned) / (32 - cards_turned)
  ev <- prob_no_loss * gain_amount - (1 - prob_no_loss) * loss_amount
  return(ev)
}

# 建立期望值敏感性模型
ev_model <- lme(cards_turned ~ expected_value + loss_amount + gain_amount, 
                random = ~1|subject, data = analysis_data)
```

**前景理论模型**
```r
# 前景理论参数估计
prospect_theory_model <- function(parameters, choices) {
    alpha <- parameters[1]  # 价值函数曲率
    lambda <- parameters[2] # 损失厌恶系数
    gamma <- parameters[3]  # 概率权重参数
    
    # 计算主观价值
    subjective_value <- calculate_prospect_value(choices, alpha, lambda, gamma)
    return(subjective_value)
}

# 参数拟合
fit_prospect_model <- optim(c(0.88, 2.25, 0.61), 
                           prospect_theory_model, 
                           method = "Nelder-Mead")
```

**学习模型**
```r
# 强化学习模型
reinforcement_learning_model <- function(data, learning_rate, decay) {
    expected_values <- rep(0, 8)  # 8种参数组合
    choices <- numeric(nrow(data))
    
    for (i in 1:nrow(data)) {
        # 选择概率
        choice_prob <- softmax(expected_values)
        
        # 更新期望值
        reward <- data$round_points[i]
        condition <- data$parameter_condition[i]
        expected_values[condition] <- expected_values[condition] + 
                                     learning_rate * (reward - expected_values[condition])
        
        # 衰减
        expected_values <- expected_values * decay
    }
    return(expected_values)
}
```

## 质量控制标准

### 数据有效性
- **完成度**: 完成所有28个回合
- **参与度**: 遗漏率 < 40%
- **反应时合理性**: 平均反应时 > 200ms
- **决策变异性**: 避免完全随机或完全固定的决策模式

### 认知有效性
- **参数敏感性**: 对不同参数组合表现出差异性反应
- **学习证据**: 显示一定的经验学习效应
- **风险调节**: 能够根据风险水平调整行为
- **决策一致性**: 相似情境下的决策相对一致

### 数据质量检查
```r
# 质量控制函数
quality_control_cct <- function(data) {
    # 完成度检查
    completion_check <- check_completion_rate(data, expected_rounds = 28)
    
    # 决策变异性检查
    decision_variability <- check_decision_variability(data)
    
    # 参数敏感性检查
    parameter_sensitivity <- check_parameter_effects(data)
    
    # 学习效应检查
    learning_evidence <- check_learning_effects(data)
    
    # 综合质量评分
    quality_score <- integrate_quality_metrics(completion_check,
                                              decision_variability,
                                              parameter_sensitivity,
                                              learning_evidence)
    return(quality_score)
}
```

## 注意事项

1. **任务理解**: 确保被试理解卡片翻牌的风险-收益权衡
2. **动机维持**: 通过奖励机制维持任务动机
3. **情绪管理**: 准备应对被试因损失而产生的负面情绪
4. **个体差异**: 考虑年龄、性别、文化背景等因素
5. **疲劳控制**: 28个回合的任务需要合理安排休息
6. **技术保障**: 确保卡片翻牌的视觉效果正常工作

## 数据预处理建议

### 异常值处理
- **极端决策**: 识别异常高风险或异常保守的决策模式
- **反应时异常**: 处理过快或过慢的反应时间
- **不完整回合**: 处理因技术问题未完成的回合
- **注意失误**: 识别注意力不集中导致的随机反应

### 个体化分析
- **风险类型**: 基于决策模式对个体进行风险类型分类
- **学习曲线**: 分析个体的学习和适应模式
- **参数敏感性**: 评估个体对不同参数的敏感程度
- **策略识别**: 识别个体的决策策略偏好

### 发展性研究
- **年龄比较**: 不同年龄群体的风险决策发展模式
- **认知成熟**: 追踪风险决策能力的成熟过程
- **神经发育**: 结合神经成像研究大脑发育与决策的关系
- **纵向追踪**: 长期追踪个体风险决策的变化

### 报告生成
- **风险档案**: 个体风险决策风格的详细分析
- **认知优势**: 识别决策制定的相对优势领域
- **临床建议**: 基于决策模式的临床干预建议
- **发展追踪**: 支持纵向研究的决策发展追踪