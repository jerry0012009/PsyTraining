# Save Data Documentation - Adaptive N-Back

## 数据输出格式

### 基本信息
- **框架**: jsPsych心理学实验框架
- **输出格式**: CSV文件
- **文件名**: `adaptive-n-back_results.csv`
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
        jsPsych.data.localSave('adaptive-n-back_results.csv', 'csv');
    }
});
```

## 数据结构

### 核心字段说明

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `trial_id` | string | 试验标识符，通常为 "stim" |
| `exp_stage` | string | 实验阶段，"adaptive" 表示自适应阶段 |
| `load` | number | N-back难度等级 (1,2,3,4...) |
| `target` | string | 目标刺激字母 |
| `stim` | string | 当前呈现的刺激字母 |
| `block_num` | number | 当前块数 |
| `trial_num` | number | 当前试验编号 |
| `correct` | boolean | 是否回答正确 |
| `key_press` | number | 按键响应码 (-1=未响应, 32=空格键) |
| `rt` | number | 反应时间(毫秒) |
| `credit_var` | boolean | 信用变量，用于评估表现 |

### 性能评估字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `exp_id` | string | 实验ID："adaptive-n-back" |
| `full_screen` | boolean | 是否全屏模式 |
| `focus_shifts` | number | 焦点切换次数 |

## 示例数据

### CSV格式示例

```csv
trial_id,exp_stage,load,target,stim,block_num,trial_num,correct,key_press,rt,credit_var,exp_id,full_screen,focus_shifts
stim,adaptive,2,B,F,1,1,true,32,856,true,adaptive-n-back,true,0
stim,adaptive,2,F,B,1,2,true,-1,1200,true,adaptive-n-back,true,0
stim,adaptive,2,B,B,1,3,true,32,1024,true,adaptive-n-back,true,0
```

### JSON原始数据结构

```json
[
  {
    "trial_id": "stim",
    "exp_stage": "adaptive", 
    "load": 2,
    "target": "B",
    "stim": "F",
    "block_num": 1,
    "trial_num": 1,
    "correct": true,
    "key_press": 32,
    "rt": 856,
    "exp_id": "adaptive-n-back",
    "full_screen": true,
    "focus_shifts": 0,
    "credit_var": true
  }
]
```

## 认知指标评估

### 自适应算法
- **提升条件**: 连续块中错误次数 < 3 → 难度+1
- **降低条件**: 连续块中错误次数 > 5 → 难度-1
- **最低难度**: N=1

### 表现评估标准
- **有效数据**: 漏报率 < 40%
- **反应时下限**: 平均RT > 200ms
- **反应分布**: 按键响应分布合理

## 临床/研究应用

### 工作记忆评估
- **空间工作记忆**: 位置n-back任务
- **语言工作记忆**: 字母n-back任务
- **执行控制**: 自适应难度调整

### 认知训练指标
- **基线能力**: 初始稳定难度等级
- **学习曲线**: 难度提升速度
- **持续性**: 注意力保持时间

## 注意事项

1. **数据完整性**: 确保所有试验都有完整的RT和正确性记录
2. **注意力检查**: 包含attention-check试验验证数据有效性  
3. **全屏模式**: 建议全屏进行以减少干扰
4. **焦点监控**: 记录焦点切换次数评估注意集中度