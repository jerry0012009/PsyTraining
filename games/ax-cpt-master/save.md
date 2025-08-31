# Save Data Documentation - AX-CPT Task

## 数据输出格式

### 基本信息
- **框架**: jsPsych心理学实验框架  
- **输出格式**: CSV文件
- **文件名**: `ax-cpt_results.csv`
- **保存机制**: 服务器POST + 本地CSV下载备份
- **任务类型**: AX-CPT持续执行任务 (AX Continuous Performance Task)

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
        jsPsych.data.localSave('ax-cpt_results.csv', 'csv');
    }
});
```

## 数据结构

### jsPsych标准字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `trial_type` | string | 试验类型 ("poldrack-categorize", "poldrack-single-stim") |
| `trial_index` | number | 试验序号 |
| `time_elapsed` | number | 累计用时 (毫秒) |
| `internal_node_id` | string | jsPsych内部节点ID |
| `subject` | string | 被试ID |
| `rt` | number | 反应时间 (毫秒，-1表示无响应) |
| `response` | number | 响应按键编码 (-1表示无响应) |
| `stimulus` | string | 刺激内容 |
| `key_press` | number | 按键响应码 |
| `correct` | boolean | 是否正确响应 |
| `trial_id` | string | 试验标识符 |

### AX-CPT任务特定字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `exp_stage` | string | 实验阶段 ("practice"/"test") |
| `block_num` | number | 块号 |
| `trial_num` | number | 块内试验编号 |
| `condition` | string | 试验条件 ("AX"/"AY"/"BX"/"BY") |
| `cue` | string | 提示刺激 (通常是字母，如"A", "B") |
| `probe` | string | 探测刺激 (通常是字母，如"X", "Y") |
| `cue_switch` | boolean | 是否为提示转换试验 |
| `probe_switch` | boolean | 是否为探测转换试验 |
| `credit_var` | boolean | 信用变量（数据有效性） |
| `performance_var` | number | 表现变量 |
| `focus_shifts` | number | 焦点切换次数 |
| `full_screen` | boolean | 是否全屏模式 |

## AX-CPT任务设计

### 任务逻辑
- **目标试验**: 只有A提示后跟X探测时按"目标键" (通常空格键)
- **非目标试验**: 其他所有组合按"非目标键" (通常不响应)
- **工作记忆**: 需要记住提示刺激来正确响应探测刺激

### 试验条件类型

**AX试验 (目标条件)**
- **频率**: ~70%
- **要求**: A提示 + X探测 → 按目标键
- **认知**: 维持A提示，识别X探测

**AY试验 (提示干扰)**  
- **频率**: ~10%
- **要求**: A提示 + Y探测 → 按非目标键
- **认知**: 抑制因A提示产生的目标倾向

**BX试验 (探测干扰)**
- **频率**: ~10%  
- **要求**: B提示 + X探测 → 按非目标键
- **认知**: 抑制因X探测产生的目标倾向

**BY试验 (非目标条件)**
- **频率**: ~10%
- **要求**: B提示 + Y探测 → 按非目标键  
- **认知**: 基线非目标条件

## 示例数据

### CSV格式示例

```csv
trial_type,trial_index,rt,correct,condition,cue,probe,exp_stage,block_num,credit_var,performance_var
poldrack-categorize,10,456,true,AX,A,X,test,1,true,0.92
poldrack-categorize,11,523,true,AY,A,Y,test,1,true,0.92
poldrack-categorize,12,487,false,BX,B,X,test,1,true,0.92
poldrack-categorize,13,398,true,BY,B,Y,test,1,true,0.92
```

### 关键数据结构示例

```json
{
  "trial_type": "poldrack-categorize",
  "rt": 456,
  "correct": true,
  "condition": "BX",
  "cue": "B", 
  "probe": "X",
  "exp_stage": "test",
  "block_num": 2,
  "credit_var": true
}
```

## 认知指标评估

### 执行控制成分

**前摄干扰 (Proactive Interference)**
- **测量**: AY试验错误率
- **机制**: A提示激活目标倾向，需要抑制对Y的错误响应
- **指标**: AY_错误率，AY_RT vs AX_RT

**反应性控制 (Reactive Control)**  
- **测量**: BX试验错误率
- **机制**: 看到X探测时需要检查提示是否为A
- **指标**: BX_错误率，BX_RT vs BY_RT

**工作记忆维持 (Working Memory Maintenance)**
- **测量**: AX试验表现
- **机制**: 维持A提示直到X探测出现
- **指标**: AX_准确率，AX_RT稳定性

### 认知控制策略

**前摄控制策略**
- **特征**: AY错误少，BX错误多
- **机制**: 强烈维持提示信息
- **适应**: 高工作记忆需求情境

**反应性控制策略**
- **特征**: AY错误多，BX错误少  
- **机制**: 依赖探测刺激进行控制
- **适应**: 低工作记忆资源情境

## 临床/研究应用

### 认知控制评估
- **注意缺陷**: ADHD患者BX试验表现差
- **精神分裂症**: 工作记忆维持缺陷，AX表现差
- **老化研究**: 认知控制策略变化

### 神经机制研究
- **前额叶功能**: 工作记忆维持和认知控制
- **前扣带回**: 冲突监测和认知控制调节
- **多巴胺系统**: 工作记忆门控机制

### 临床群体特征

| 群体 | AX表现 | AY表现 | BX表现 | BY表现 | 策略特点 |
|------|--------|--------|--------|--------|----------|
| **健康成人** | 高准确/快RT | 高准确/慢RT | 高准确/慢RT | 高准确/快RT | 平衡控制 |
| **ADHD** | 正常 | 错误增多 | 错误显著增多 | 正常 | 反应性控制缺陷 |
| **精神分裂症** | 准确率下降 | 错误增多 | 正常/错误多 | 正常 | 工作记忆维持缺陷 |
| **老年人** | RT增加 | 错误增多 | 错误增多 | RT增加 | 混合策略缺陷 |

## 数据分析方法

### 基础指标计算

```r
# R代码示例
# 各条件准确率
AX_accuracy <- mean(data$correct[data$condition == "AX"])
AY_accuracy <- mean(data$correct[data$condition == "AY"]) 
BX_accuracy <- mean(data$correct[data$condition == "BX"])
BY_accuracy <- mean(data$correct[data$condition == "BY"])

# 各条件反应时间 (仅正确试验)
AX_rt <- mean(data$rt[data$condition == "AX" & data$correct == TRUE])
AY_rt <- mean(data$rt[data$condition == "AY" & data$correct == TRUE])
BX_rt <- mean(data$rt[data$condition == "BX" & data$correct == TRUE])
BY_rt <- mean(data$rt[data$condition == "BY" & data$correct == TRUE])
```

### 认知控制指标

**前摄干扰指标**
- AY错误率 (理想: < 15%)
- AY-AX RT差 (前摄控制成本)

**反应性控制指标**  
- BX错误率 (理想: < 10%)
- BX-BY RT差 (反应性控制成本)

**工作记忆指标**
- AX准确率 (理想: > 85%)
- AX RT变异性 (维持稳定性)

### 质量控制标准
- **整体准确率**: > 70%
- **AX准确率**: > 80% 
- **反应时间**: 200-2000ms
- **数据完整性**: `credit_var = true`

## d'prime 信号检测分析

### 信号检测指标
- **Hit Rate**: AX试验的正确响应率
- **False Alarm Rate**: 非AX试验的错误响应率  
- **d'**: 信号检测敏感性 = Z(Hit) - Z(FA)
- **Beta**: 反应偏向 = exp(0.5 * [Z(Hit)² - Z(FA)²])

### 按条件分析
- **AY-FA**: AY试验的虚警率 (前摄干扰)
- **BX-FA**: BX试验的虚警率 (反应性干扰)
- **BY-FA**: BY试验的虚警率 (基线虚警)

## 注意事项

1. **指导语理解**: 确保参与者理解只有AX需要响应
2. **练习充分**: 至少32个练习试验确保任务掌握
3. **条件平衡**: 各条件试验数量需要平衡
4. **反应键位**: 明确目标键和非目标键设置
5. **时间参数**: 提示-探测间隔时间的标准化
6. **环境控制**: 安静环境，避免外界干扰

## 数据预处理建议

### 试验筛选
- **RT范围**: 150ms < RT < 3000ms
- **连续错误**: 识别注意缺失的试验序列
- **练习效应**: 分析并控制学习趋势

### 异常检测
- **异常快速**: RT < 150ms可能为预期响应
- **异常缓慢**: RT > 3000ms可能为注意分散
- **策略转换**: 识别任务过程中的策略改变

### 统计分析
- **混合效应模型**: 考虑个体差异和试验内相关
- **信号检测分析**: d'和β指标的计算
- **认知建模**: 使用扩散模型等分析决策过程

### 发展与个体差异
- **年龄效应**: 认知控制的发展轨迹
- **智力关系**: 工作记忆与AX-CPT表现的关系  
- **人格特质**: 冲动性与认知控制策略的关联