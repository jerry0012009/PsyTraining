# Save Data Documentation - Attention Network Task (ANT)

## 数据输出格式

### 基本信息
- **框架**: jsPsych心理学实验框架
- **输出格式**: CSV文件
- **文件名**: `attention-network-task_results.csv`
- **保存机制**: 服务器POST + 本地CSV下载备份
- **任务类型**: 注意网络任务 (Attention Network Task)

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
        jsPsych.data.localSave('attention-network-task_results.csv', 'csv');
    }
});
```

## 数据结构

### jsPsych标准字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `trial_type` | string | 试验类型 ("poldrack-categorize", "poldrack-instructions") |
| `trial_index` | number | 试验序号 |
| `time_elapsed` | number | 累计用时 (毫秒) |
| `internal_node_id` | string | jsPsych内部节点ID |
| `subject` | string | 被试ID |
| `rt` | number | 反应时间 (毫秒，-1表示超时) |
| `response` | number | 响应按键编码 |
| `stimulus` | string | 刺激HTML内容 |
| `key_press` | number | 按键响应码 |
| `correct` | boolean | 是否正确响应 |
| `trial_id` | string | 试验标识符 |

### ANT任务特定字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `exp_stage` | string | 实验阶段 ("practice"/"test") |
| `block_num` | number | 块号 |
| `trial_num` | number | 块内试验编号 |
| `flanker_type` | string | 箭头类型 ("congruent"/"incongruent"/"neutral") |
| `cue_type` | string | 提示类型 ("no_cue"/"center_cue"/"double_cue"/"spatial_cue") |
| `target_direction` | string | 目标方向 ("left"/"right") |
| `credit_var` | boolean | 信用变量（数据有效性） |
| `performance_var` | number | 表现变量 |
| `focus_shifts` | number | 焦点切换次数 |
| `full_screen` | boolean | 是否全屏模式 |

## ANT任务设计

### 注意网络类型

**1. 警觉网络 (Alerting)**
- **测量**: 双提示 vs 无提示条件
- **指标**: RT_无提示 - RT_双提示
- **功能**: 维持警觉状态的能力

**2. 定向网络 (Orienting)**  
- **测量**: 中央提示 vs 空间提示条件
- **指标**: RT_中央提示 - RT_空间提示
- **功能**: 注意空间定向能力

**3. 执行网络 (Executive)**
- **测量**: 不一致 vs 一致箭头条件
- **指标**: RT_不一致 - RT_一致
- **功能**: 解决冲突的执行控制

### 实验条件组合

| 提示类型 | 箭头类型 | 目标方向 | 测量网络 |
|----------|----------|----------|----------|
| 无提示 | 一致 | 左/右 | 警觉网络 |
| 中央提示 | 一致 | 左/右 | 定向网络 |
| 双提示 | 一致 | 左/右 | 警觉网络 |
| 空间提示 | 一致 | 左/右 | 定向网络 |
| 各种提示 | 不一致 | 左/右 | 执行网络 |
| 各种提示 | 中性 | 左/右 | 基线条件 |

## 示例数据

### CSV格式示例

```csv
trial_type,trial_index,rt,correct,flanker_type,cue_type,target_direction,exp_stage,block_num,credit_var,performance_var
poldrack-categorize,5,456,true,congruent,no_cue,right,test,1,true,0.85
poldrack-categorize,6,578,true,incongruent,spatial_cue,left,test,1,true,0.85
poldrack-categorize,7,623,false,incongruent,center_cue,right,test,1,true,0.85
```

### 关键数据结构示例

```json
{
  "trial_type": "poldrack-categorize",
  "rt": 456,
  "correct": true,
  "flanker_type": "incongruent",
  "cue_type": "spatial_cue",
  "target_direction": "left",
  "exp_stage": "test",
  "block_num": 2,
  "credit_var": true
}
```

## 认知指标评估

### 注意网络效率

**警觉网络 (Alerting Network)**
- **计算**: RT_无提示 - RT_双提示  
- **正常值**: 20-40ms
- **解释**: 数值越大，警觉网络效率越高

**定向网络 (Orienting Network)**
- **计算**: RT_中央提示 - RT_空间提示
- **正常值**: 40-60ms  
- **解释**: 数值越大，空间注意定向能力越强

**执行网络 (Executive Network)**
- **计算**: RT_不一致 - RT_一致
- **正常值**: 80-120ms
- **解释**: 数值越大，冲突解决成本越高

### 综合注意能力
- **整体注意效率**: 三个网络的综合评估
- **注意平衡性**: 各网络发展的均衡程度
- **注意稳定性**: 跨试验的表现一致性

## 临床/研究应用

### 注意缺陷评估
- **ADHD诊断**: 执行网络异常增强
- **焦虑障碍**: 警觉网络过度激活
- **抑郁症**: 注意网络整体效率下降

### 神经发育评估
- **儿童发育**: 各网络成熟度评估
- **老化研究**: 注意网络退化模式
- **认知训练**: 训练前后对比评估

### 临床群体差异

| 群体 | 警觉网络 | 定向网络 | 执行网络 | 特征 |
|------|----------|----------|----------|------|
| **ADHD** | 正常/增强 | 正常 | 显著增强 | 冲突解决困难 |
| **焦虑症** | 显著增强 | 正常/减弱 | 增强 | 过度警觉 |
| **抑郁症** | 减弱 | 减弱 | 增强 | 整体注意效率下降 |
| **老年人** | 增强 | 减弱 | 增强 | 定向能力下降 |

## 数据分析方法

### 网络效率计算

```r
# R代码示例
# 警觉网络效率
alerting <- mean(rt[cue_type == "no_cue"]) - mean(rt[cue_type == "double_cue"])

# 定向网络效率  
orienting <- mean(rt[cue_type == "center_cue"]) - mean(rt[cue_type == "spatial_cue"])

# 执行网络效率
executive <- mean(rt[flanker_type == "incongruent"]) - mean(rt[flanker_type == "congruent"])
```

### 质量控制标准
- **准确率**: 总体准确率 > 80%
- **反应时间**: 平均RT在150-1500ms之间
- **数据完整性**: `credit_var = true`
- **注意集中**: `focus_shifts < 5`

### 数据清洗
- **异常RT**: 剔除 < 100ms 或 > 2000ms 的试验
- **错误试验**: 分析错误模式，异常多的错误试验需剔除
- **练习效应**: 分析并控制练习效应影响

## 发展轨迹与规范

### 年龄发展模式

| 年龄组 | 警觉网络 | 定向网络 | 执行网络 |
|--------|----------|----------|----------|
| **6-7岁** | 20-30ms | 30-50ms | 150-200ms |
| **8-10岁** | 25-35ms | 40-60ms | 120-150ms |
| **成年人** | 30-40ms | 40-60ms | 80-120ms |
| **老年人** | 40-50ms | 20-40ms | 100-140ms |

### 个体差异因素
- **性别差异**: 女性执行网络通常更高效
- **教育水平**: 高教育水平执行网络更强
- **文化背景**: 集体主义文化执行网络发展更好

## 注意事项

1. **全屏模式**: 确保实验在全屏模式下进行
2. **练习充分**: 至少24个练习试验确保任务理解
3. **环境控制**: 安静环境，避免外界干扰
4. **反应手册**: 明确左右手反应键位
5. **数据完整性**: 确保所有条件都有足够的试验数
6. **疲劳控制**: 适当休息避免疲劳影响

## 数据预处理建议

### 试验筛选
- **正确试验**: 仅分析正确响应的试验
- **RT范围**: 100ms < RT < 2000ms
- **连续错误**: 剔除连续3次以上错误的序列

### 统计分析
- **重复测量ANOVA**: 分析条件间差异
- **相关分析**: 各网络间的相关模式
- **回归分析**: 预测因子对网络效率的影响

### 报告指标
- **网络效率**: 三个网络的具体数值
- **准确率**: 各条件下的正确率
- **稳定性**: 网络效率的个体内变异
- **平衡性**: 各网络发展的相对平衡程度