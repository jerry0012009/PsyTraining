# Save Data Documentation - Affective Conflict Resolution Task

## 数据输出格式

### 基本信息
- **框架**: jQuery + 原生JavaScript
- **输出格式**: JSON数组
- **保存机制**: AJAX POST请求到 `/save` 端点
- **游戏类型**: 情绪冲突解决任务（情绪Stroop范式）

## 保存流程

1. **实时数据收集**: 每道试验完成后保存到 `resultList` 数组
2. **服务器上传**: 任务结束时POST到 `/save` 端点
3. **错误处理**: 如果服务器响应失败，显示错误信息但不进行本地保存

```javascript
// 保存流程
async function sendResults(data) {
    $.ajax({
        type: "POST",
        url: '/save',
        data: { "data": data },
        success: function () { document.location = "/next" },
        dataType: "application/json",
        error: function (err) {
            if (err.status == 200) {
                document.location = "/next";
            } else {
                console.log("我们这边出现了一些问题...");
            }
        }
    });
}
```

## 数据结构

### 每道试验记录的字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `emotion` | string | 图像面部表情情绪 (SAD/ANGRY/HAPPY/SCARED) |
| `text` | string | 叠加文字情绪 (SAD/ANGRY/HAPPY/SCARED) |
| `startTime` | number | 刺激呈现开始时间戳 (毫秒) |
| `endTime` | number | 用户响应时间戳 (毫秒) |
| `chosenEmotion` | string | 用户选择的情绪 (SAD/ANGRY/HAPPY/SCARED) |
| `correctness` | string | 正确性 ("correct"/"incorrect") |

### 实验设计特点
- **一致条件**: 面部表情与文字情绪相同
- **不一致条件**: 面部表情与文字情绪不同（情绪冲突）
- **随机化**: 图像、文字情绪和按钮位置随机化
- **阶段**: 16轮练习 + 144轮正式实验

## 示例数据

### JSON格式示例

```json
[
  {
    "emotion": "HAPPY",
    "text": "SAD", 
    "startTime": 1640995200000,
    "endTime": 1640995201245,
    "chosenEmotion": "SAD",
    "correctness": "correct"
  },
  {
    "emotion": "ANGRY",
    "text": "ANGRY",
    "startTime": 1640995202000,
    "endTime": 1640995203156,
    "chosenEmotion": "ANGRY", 
    "correctness": "correct"
  },
  {
    "emotion": "SAD",
    "text": "HAPPY",
    "startTime": 1640995204000,
    "endTime": 1640995205894,
    "chosenEmotion": "SAD",
    "correctness": "incorrect"
  }
]
```

## 认知指标评估

### 情绪冲突指标
- **Stroop效应**: 不一致条件vs一致条件的反应时间差
- **冲突解决能力**: 不一致试验的正确率
- **情绪干扰**: 面部表情对文字判断的影响程度

### 注意力控制指标
- **选择性注意**: 忽略面部表情，专注于文字的能力
- **抑制控制**: 抑制无关情绪信息的能力
- **认知灵活性**: 在冲突条件下的适应能力

### 情绪处理指标
- **情绪识别**: 对不同情绪类别的识别准确性
- **情绪敏感性**: 对特定情绪的反应时间模式
- **情绪调节**: 情绪冲突对任务表现的影响

## 临床/研究应用

### 情绪调节评估
- **情绪控制**: 评估情绪冲突下的认知控制能力
- **注意偏向**: 检测对特定情绪的注意偏向
- **冲突监测**: 评估冲突检测和解决能力

### 心理健康指标
- **焦虑水平**: 高焦虑个体在冲突条件下表现更差
- **抑郁倾向**: 对负性情绪的过度关注
- **情绪稳定性**: 情绪冲突的影响程度

## 数据分析方法

### 关键指标计算

**反应时间分析:**
- 一致条件平均RT vs 不一致条件平均RT
- Stroop效应量 = RT_不一致 - RT_一致

**正确率分析:**
- 各情绪类别的识别准确率
- 一致vs不一致条件的准确率差异

**冲突效应分析:**
- 冲突试验的错误率和RT增长
- 情绪特异性冲突效应

### 质量控制标准
- **最小试验数**: 至少完成80%的正式试验
- **反应时间**: 平均RT在200-5000ms之间
- **准确率**: 总体准确率应高于60%

## 注意事项

1. **任务理解**: 确保参与者理解要判断文字而非面部表情
2. **练习充分**: 16轮练习确保任务熟练度
3. **环境控制**: 安静环境，减少外界干扰
4. **数据完整性**: 检查所有试验是否有完整的时间戳和响应
5. **情绪平衡**: 四种情绪类别的试验数量应该平衡
6. **反应时间**: 过快或过慢的响应可能表明注意不集中

## 数据预处理建议

### 异常值处理
- **RT过短**: < 200ms的反应可能是预期反应
- **RT过长**: > 5000ms的反应可能是注意分散
- **连续错误**: 连续多次错误可能表明理解问题

### 分析维度
- **按情绪类别**: 分析各情绪的识别模式
- **按一致性**: 比较一致vs不一致条件
- **按时间**: 分析练习效应和疲劳效应
- **个体差异**: 考虑个体的基线情绪状态