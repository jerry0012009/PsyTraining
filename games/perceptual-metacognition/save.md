# Save Data Documentation - Perceptual Metacognition

## 数据输出格式

### 基本信息
- **框架**: jsPsych心理学实验框架
- **输出格式**: CSV文件
- **文件名**: `perceptual-metacognition_results.csv`
- **保存机制**: 本地下载 + 服务器POST

## 保存流程

1. **服务器保存**: 优先尝试POST到 `/save` 端点
2. **本地保存**: 服务器不可用时，自动下载CSV文件到本地

```javascript
// 保存代码片段
$.ajax({
    type: "POST",
    url: '/save',
    data: { "data": data },
    success: function(){ document.location = "/next" },
    error: function(err) {
        // fallback: 本地保存
        jsPsych.data.localSave('perceptual-metacognition_results.csv', 'csv');
    }
});
```

## 数据结构

### 核心字段说明

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `trial_id` | string | 试验类型："stim"(感知任务), "catch"(简单任务), "confidence_rating"(信心评级), "fixation"(注视点) |
| `exp_stage` | string | 实验阶段："practice"(练习), "test"(正式测试) |
| `correct` | boolean | 感知判断是否正确 |
| `key_press` | number | 按键响应码 (37=左箭头, 39=右箭头, 或信心评级键) |
| `rt` | number | 反应时间(毫秒) |
| `stim_orientation` | number | 光栅刺激的朝向角度(度) |
| `contrast_level` | number | 刺激对比度等级 |
| `confidence` | string | 信心评级 ("confidence_1" 到 "confidence_6") |

### 任务配置字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `exp_id` | string | 实验ID："perceptual-metacognition" |
| `full_screen` | boolean | 是否全屏模式 |
| `focus_shifts` | number | 焦点切换次数 |
| `credit_var` | boolean | 表现是否达标的标识 |

### 刺激参数字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `spatial_frequency` | number | 空间频率(周期/视角度) |
| `stimulus_duration` | number | 刺激呈现时间(毫秒) |
| `fixation_duration` | number | 注视点持续时间(毫秒) |

## 示例数据

### CSV格式示例

```csv
trial_id,exp_stage,stim_orientation,contrast_level,correct,key_press,rt,confidence,exp_id,full_screen,focus_shifts
fixation,test,,,,,-1,,perceptual-metacognition,true,0
stim,test,45,0.8,true,39,856,,perceptual-metacognition,true,0
confidence_rating,test,,,,,1245,confidence_4,perceptual-metacognition,true,0
fixation,test,,,,,-1,,perceptual-metacognition,true,0
catch,test,90,1.0,true,37,623,,perceptual-metacognition,true,0
confidence_rating,test,,,,,892,confidence_6,perceptual-metacognition,true,0
```

### JSON原始数据结构

```json
[
  {
    "trial_id": "stim",
    "exp_stage": "test",
    "stim_orientation": 45,
    "contrast_level": 0.8,
    "correct": true,
    "key_press": 39,
    "rt": 856,
    "exp_id": "perceptual-metacognition",
    "full_screen": true,
    "focus_shifts": 0
  },
  {
    "trial_id": "confidence_rating",
    "exp_stage": "test",
    "confidence": "confidence_4",
    "key_press": 52,
    "rt": 1245,
    "exp_id": "perceptual-metacognition",
    "full_screen": true,
    "focus_shifts": 0
  }
]
```

## 认知指标评估

### 感知能力测量
- **对比度敏感性**: 不同对比度水平的检测阈值
- **朝向辨别**: 左倾vs右倾光栅的判断准确性
- **信号检测**: d'和criterion的计算

### 元认知能力评估
- **元认知敏感性**: 信心评级与判断准确性的相关程度
- **元认知偏差**: 过度自信或自信不足的倾向
- **校准度**: 主观信心与客观表现的匹配程度

### 表现评估标准
- **有效数据**: 漏报率 < 40%，平均RT > 200ms
- **反应分布**: 各按键响应分布合理，无单一按键过度使用(>85%)
- **注意力检查**: 通过简单catch试验验证专注度

## 任务设计

### 刺激参数
- **视觉刺激**: 正弦波光栅(Gabor patches)
- **朝向角度**: 左倾(-45°) vs 右倾(+45°)
- **对比度**: 自适应调整，维持约75%准确率
- **呈现时间**: 33毫秒(约2个刷新帧)

### 实验流程
1. **注视点**: 1000毫秒固定注视
2. **刺激呈现**: 33毫秒光栅刺激
3. **感知判断**: 左/右箭头键响应
4. **信心评级**: 1-6键表示信心水平(1=极不确定, 6=极确定)

### 试验类型
- **练习试验**: 高对比度简单刺激，熟悉任务
- **测试试验**: 自适应对比度刺激，主要数据收集
- **Catch试验**: 高对比度验证试验，检测注意力

## 元认知分析指标

### Type 1 表现(感知判断)
- **准确率**: 正确判断的比例
- **反应时**: 感知判断的速度
- **d'值**: 信号检测理论中的敏感性指标

### Type 2 表现(元认知判断)
- **Meta-d'**: 元认知敏感性的无偏估计
- **M-Ratio**: Meta-d'/d'的比值，元认知效率指标
- **信心-准确性相关**: 信心评级与判断正确性的相关

### 校准分析
- **校准曲线**: 不同信心水平下的实际准确率
- **过度/不足自信**: Brier分数和校准指标
- **元认知偏差**: 平均信心与平均准确率的差异

## 临床/研究应用

### 认知神经科学研究
- **前额叶功能**: 元认知监控的神经基础
- **意识研究**: 主观意识与客观表现的关系
- **决策神经科学**: 不确定性下的决策机制

### 临床评估应用
- **精神分裂症**: 元认知缺陷的评估
- **焦虑障碍**: 过度自信或自信不足模式
- **认知老化**: 元认知能力的年龄相关变化

### 个体差异研究
- **元认知特质**: 稳定的个体元认知特征
- **训练效果**: 元认知训练的可塑性评估
- **跨域迁移**: 感知元认知与其他域元认知的关系

## 数据分析注意事项

1. **试验排除**: 排除RT < 200ms或 > 3000ms的异常试验
2. **对比度调整**: 记录自适应过程中的对比度变化
3. **信心评级**: 确保使用完整的1-6评级范围
4. **Catch试验**: 验证参与者保持注意力和理解任务
5. **元认知指标**: 使用适当的统计方法计算Meta-d'等指标
6. **个体差异**: 考虑基线感知能力对元认知测量的影响