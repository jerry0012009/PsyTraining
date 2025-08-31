# Save Data Documentation - Bickel Titrator Task

## 数据输出格式

### 基本信息
- **框架**: jsPsych心理学实验框架
- **输出格式**: CSV文件
- **文件名**: `bickel-titrator_results.csv`
- **保存机制**: 服务器POST + 本地CSV下载备份
- **任务类型**: Bickel延迟折扣滴定任务 (Delay Discounting Titrator)

## 保存流程

1. **服务器保存**: 优先尝试POST到 `/save` 端点
2. **本地备份**: 服务器不可用时，自动下载CSV文件到本地

```javascript
// 保存代码片段
$.ajax({
    type: "POST",
    url: '/save', 
    data: { "data": data },
    success: function(){ document.location = "/next" },
    error: function(err) {
        // 本地保存备份
        jsPsych.data.localSave('bickel-titrator_results.csv', 'csv');
    }
});
```

## 数据结构

### jsPsych标准字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `trial_type` | string | 试验类型 ("poldrack-single-stim", "poldrack-instructions") |
| `trial_index` | number | 试验序号 |
| `time_elapsed` | number | 累计用时 (毫秒) |
| `internal_node_id` | string | jsPsych内部节点ID |
| `subject` | string | 被试ID |
| `rt` | number | 反应时间 (毫秒) |
| `response` | number | 响应按键编码 |
| `stimulus` | string | 刺激HTML内容 |
| `key_press` | number | 按键响应码 |
| `trial_id` | string | 试验标识符 |

### 延迟折扣特定字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `exp_stage` | string | 实验阶段 ("practice"/"test") |
| `block_num` | number | 块号 |
| `trial_num` | number | 块内试验编号 |
| `delay` | number | 延迟时间 (天数) |
| `large_amount` | number | 较大金额 (通常为100) |
| `small_amount` | number | 较小金额 (滴定值) |
| `choice` | string | 选择结果 ("immediate"/"delayed") |
| `titration_level` | number | 当前滴定水平 |
| `convergence_point` | number | 滴定收敛点 |
| `indifference_point` | number | 无差异点 |
| `credit_var` | boolean | 信用变量（数据有效性） |
| `performance_var` | number | 表现变量 |

## 延迟折扣任务设计

### 任务原理
- **选择情境**: 在"现在较小金额"和"未来较大金额"间选择
- **滴定程序**: 调整较小金额直到找到无差异点
- **认知测量**: 评估个体对未来奖励的折扣程度

### 滴定算法
1. **初始设置**: 较小金额从50%较大金额开始
2. **选择反馈**: 根据选择调整较小金额
   - 选择即时奖励 → 减少即时金额
   - 选择延迟奖励 → 增加即时金额
3. **收敛判断**: 连续反转或达到预设精度时停止
4. **无差异点**: 最终滴定值作为该延迟的无差异点

### 延迟条件
- **7天**: 短期延迟
- **30天**: 中期延迟  
- **90天**: 长期延迟
- **365天**: 超长期延迟

## 示例数据

### CSV格式示例

```csv
trial_type,trial_index,rt,delay,large_amount,small_amount,choice,titration_level,indifference_point,exp_stage,credit_var
poldrack-single-stim,5,2345,7,100,50,delayed,1,45.5,test,true
poldrack-single-stim,6,1876,7,100,25,immediate,2,45.5,test,true
poldrack-single-stim,7,2156,30,100,75,delayed,1,62.3,test,true
poldrack-single-stim,8,1945,30,100,87.5,immediate,2,62.3,test,true
```

### 关键数据结构示例

```json
{
  "trial_type": "poldrack-single-stim",
  "rt": 2345,
  "delay": 30,
  "large_amount": 100,
  "small_amount": 65.2,
  "choice": "immediate",
  "titration_level": 4,
  "indifference_point": 62.8,
  "exp_stage": "test"
}
```

## 认知指标评估

### 延迟折扣指标

**无差异点 (Indifference Points)**
- **定义**: 个体对即时和延迟奖励无偏好时的即时金额
- **范围**: 0-100 (相对于较大金额的百分比)
- **解释**: 数值越低，延迟折扣越严重

**折扣率 (Discount Rate, k)**
- **计算**: 使用双曲折扣模型 V = A/(1+kD)
- **公式**: k = (A-V)/(V×D), 其中A=大金额，V=无差异点，D=延迟
- **解释**: k值越大，折扣越严重（越冲动）

**一致性指标**
- **单调性**: 无差异点随延迟增加而递减的程度
- **AUC**: 无差异点曲线下面积 (Area Under Curve)
- **Johnson-Bickel**: 检验是否满足折扣的单调性假设

### 时间偏好类型

**延迟敏感型 (Delay-Sensitive)**
- **特征**: 无差异点随延迟快速下降
- **k值**: 高折扣率 (k > 0.1)
- **决策**: 偏好即时满足

**延迟不敏感型 (Delay-Insensitive)**  
- **特征**: 无差异点随延迟缓慢下降
- **k值**: 低折扣率 (k < 0.01)
- **决策**: 能够等待更大奖励

## 临床/研究应用

### 冲动性评估
- **物质使用**: 成瘾者通常表现高延迟折扣
- **ADHD**: 注意缺陷患者折扣率较高
- **赌博障碍**: 病理性赌徒延迟折扣严重

### 决策能力评估  
- **财务决策**: 投资和储蓄行为预测
- **健康决策**: 健康行为的时间偏好
- **学业成就**: 学习投入的时间视角

### 临床群体差异

| 群体 | 平均k值 | 无差异点模式 | 决策特点 |
|------|---------|--------------|----------|
| **健康成人** | 0.01-0.05 | 随延迟单调递减 | 平衡的时间偏好 |
| **物质依赖** | 0.1-0.5 | 快速下降 | 严重即时偏好 |
| **ADHD** | 0.05-0.2 | 不规则下降 | 冲动决策倾向 |
| **老年人** | 0.005-0.02 | 缓慢下降 | 更重视未来 |

## 数据分析方法

### 基础指标计算

```r
# R代码示例
# 计算各延迟条件的无差异点
ip_7day <- data$indifference_point[data$delay == 7]
ip_30day <- data$indifference_point[data$delay == 30]
ip_90day <- data$indifference_point[data$delay == 90] 
ip_365day <- data$indifference_point[data$delay == 365]

# 计算折扣率k (双曲模型)
calculate_k <- function(large_amount, small_amount, delay) {
  (large_amount - small_amount) / (small_amount * delay)
}

# AUC计算 (梯形规则)
calculate_auc <- function(delays, indifference_points, max_delay = 365) {
  # 标准化延迟和无差异点
  delays_norm <- delays / max_delay
  ip_norm <- indifference_points / 100
  
  # 计算AUC
  sum(diff(delays_norm) * (ip_norm[-length(ip_norm)] + ip_norm[-1]) / 2)
}
```

### 模型拟合

**双曲折扣模型**
- **公式**: V = A/(1 + kD)
- **参数**: k (折扣率), A (大金额)
- **拟合**: 非线性回归估计k值

**指数折扣模型** 
- **公式**: V = A × exp(-kD)
- **对比**: 与双曲模型比较拟合优度

**广义双曲模型**
- **公式**: V = A/(1 + kD)^s
- **参数**: k (折扣率), s (敏感性参数)

### 质量控制标准
- **完成度**: 所有延迟条件都有收敛的无差异点
- **一致性**: Johnson-Bickel标准检查单调性
- **收敛**: 滴定程序达到预设精度要求
- **反应时**: 合理的决策时间范围

## 个体差异与发展

### 年龄发展趋势
- **儿童期**: k值较高，延迟折扣严重
- **青少年期**: k值开始下降但仍较高
- **成年期**: k值稳定在较低水平
- **老年期**: k值进一步降低，更重视未来

### 性别差异
- **一般模式**: 男性k值略高于女性
- **变异性**: 个体差异大于性别差异
- **情境敏感**: 特定领域可能有性别差异

### 文化差异
- **集体主义**: 通常k值较低，更重视长期
- **个人主义**: k值相对较高
- **经济发展**: 发达地区k值通常较低

## 注意事项

1. **任务理解**: 确保参与者理解两种选择的含义
2. **滴定精度**: 设置适当的收敛标准
3. **延迟范围**: 涵盖足够广的延迟范围
4. **金额现实性**: 使用对参与者有意义的金额
5. **环境控制**: 避免外界因素影响决策
6. **疲劳控制**: 合理安排休息避免决策疲劳

## 数据预处理建议

### 质量检查
- **单调性检查**: 使用Johnson-Bickel标准
- **异常值检测**: 识别不合理的无差异点
- **收敛检查**: 确认滴定程序正常收敛

### 数据清洗
- **极端值**: 处理k=0或k=∞的情况
- **不一致**: 剔除严重违反单调性的数据
- **缺失值**: 处理未完成的滴定序列

### 统计建议
- **非参数检验**: k值通常不符合正态分布
- **对数转换**: ln(k+1)转换可能改善分布
- **稳健统计**: 使用中位数等稳健指标

### 报告标准
- **无差异点**: 各延迟条件的具体数值
- **折扣参数**: k值和模型拟合优度
- **一致性指标**: AUC值和单调性检查结果
- **个体特征**: 年龄、性别等基本信息的关联分析