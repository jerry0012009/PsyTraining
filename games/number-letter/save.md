# Save Data Documentation - Number-Letter

## 数据输出格式

### 基本信息
- **框架**: jsPsych心理学实验框架  
- **输出格式**: CSV文件
- **文件名**: `number-letter_results.csv`
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
        jsPsych.data.localSave('number-letter_results.csv', 'csv');
    }
});
```

## 数据结构

### 核心字段说明

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `trial_id` | string | 试验标识符："stim"(刺激试验), "gap"(间隔), "instruction"(指导), "end"(结束) |
| `exp_stage` | string | 实验阶段："test" 表示正式测试阶段 |
| `stim_place` | string | 刺激位置："topleft", "topright", "bottomleft", "bottomright" |
| `stim_id` | string | 刺激内容，如 "G9"(字母+数字组合) |
| `condition` | string | 任务条件："top_oddeven"(上半区奇偶判断), "bottom_consonantvowel"(下半区辅音元音判断), "rotate_switch"(旋转切换) |
| `correct` | boolean | 是否回答正确 |
| `key_press` | number | 按键响应码 (90="Z"键, 77="M"键, -1=未响应) |
| `rt` | number | 反应时间(毫秒) |
| `response_ends_trial` | boolean | 响应是否结束试验 |

### 任务配置字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `exp_id` | string | 实验ID："number-letter" |
| `full_screen` | boolean | 是否全屏模式 |
| `focus_shifts` | number | 焦点切换次数 |

### 问卷数据字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `responses` | string | JSON格式的问卷回答内容 |
| `trial_id` | string | "post task questions" 表示任务后问卷 |

## 示例数据

### CSV格式示例

```csv
trial_id,exp_stage,stim_place,stim_id,condition,correct,key_press,rt,exp_id,full_screen,focus_shifts
stim,test,topleft,G3,top_oddeven,true,90,1245,number-letter,true,0
gap,,,,,,,-1,150,number-letter,true,0
stim,test,bottomright,A4,bottom_consonantvowel,true,77,892,number-letter,true,0
stim,test,topright,M6,rotate_switch,true,77,1156,number-letter,true,0
```

### JSON原始数据结构

```json
[
  {
    "trial_id": "stim",
    "exp_stage": "test",
    "stim_place": "topleft",
    "stim_id": "G3",
    "condition": "top_oddeven",
    "correct": true,
    "key_press": 90,
    "rt": 1245,
    "exp_id": "number-letter",
    "full_screen": true,
    "focus_shifts": 0
  }
]
```

## 认知指标评估

### 任务切换能力
- **切换成本**: 比较旋转切换条件与单一条件的RT差异
- **错误率**: 不同条件下的准确率差异
- **学习效应**: 练习过程中的表现改善

### 执行控制评估
- **冲突解决**: 处理数字/字母双重任务要求的能力
- **注意控制**: 在不同空间位置间转换注意的灵活性
- **工作记忆**: 记住并执行不同规则的能力

### 表现评估标准
- **有效数据**: 整体错误率 < 30%
- **注意力检查**: 焦点切换次数合理
- **反应时范围**: 200ms < RT < 3000ms

## 任务结构

### 实验阶段
1. **纯上半区块** (32试验): 仅奇偶判断任务
2. **纯下半区块** (32试验): 仅辅音元音判断任务  
3. **旋转切换块** (128试验): 位置和任务规则动态切换

### 刺激设计
- **数字**: 奇数(3,5,7,9) vs 偶数(2,4,6,8)
- **字母**: 辅音(G,K,M,R) vs 元音(A,E,I,U)
- **按键映射**: Z键(奇数/辅音), M键(偶数/元音)

## 临床/研究应用

### 执行功能障碍评估
- **ADHD**: 任务切换和持续注意缺陷
- **认知老化**: 执行控制灵活性下降  
- **前额叶损伤**: 规则学习和切换困难

### 训练价值
- **认知灵活性**: 提高在不同任务间切换的能力
- **双重任务**: 训练同时处理多种信息的技能
- **空间注意**: 增强不同空间位置的注意分配

## 注意事项

1. **数据完整性**: 确保所有试验都有完整的RT和正确性记录
2. **全屏模式**: 建议全屏进行以减少干扰和提高数据质量
3. **指导理解**: 包含指导阅读时间检查确保参与者理解规则
4. **焦点监控**: 记录焦点切换次数评估注意集中度
5. **练习效应**: 考虑不同阶段间的学习和疲劳影响