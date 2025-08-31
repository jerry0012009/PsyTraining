# Save Data Documentation - Angling Risk Task (Always Sunny)

## 数据输出格式

### 基本信息
- **框架**: jsPsych心理学实验框架
- **输出格式**: CSV文件
- **文件名**: `angling-risk-task_results.csv`
- **保存机制**: 服务器POST + 本地CSV下载备份
- **版本特点**: Always Sunny版本 - 固定晴朗天气条件

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
        jsPsych.data.localSave('angling-risk-task_results.csv', 'csv');
    }
});
```

## 数据结构

### 核心字段说明

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `trial_type` | string | 试验类型 ("single-stim-button", "survey-text") |
| `trial_index` | number | 试验序号 |
| `time_elapsed` | number | 累计用时 (毫秒) |
| `internal_node_id` | string | jsPsych内部节点ID |
| `subject` | string | 被试ID |
| `rt` | number | 反应时间 (毫秒，-1表示超时) |
| `stimulus` | string | 刺激HTML内容 |
| `button_pressed` | number | 按下的按钮 (0=继续钓鱼, 1=停止钓鱼) |
| `response` | string | 文本输入响应 |

### Always Sunny版本特定字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `exp_stage` | string | 实验阶段 ("practice"/"test") |
| `caught_blue` | boolean | 是否钓到蓝鱼 |
| `weather` | string | 天气条件 (固定为"晴朗") |
| `round_over` | number | 轮次结束标志 (0/1) |
| `trial_num` | number | 轮内试验编号 |
| `trip_bank` | number | 本轮积分 |
| `tournament_bank` | number | 总积分 |
| `red_fish_num` | number | 红鱼数量 |
| `total_fish_num` | number | 总鱼数量 |
| `credit_var` | boolean | 信用变量（数据有效性） |
| `performance_var` | number | 表现变量（总积分或0） |

## Always Sunny版本特点

### 实验设计差异
- **固定天气**: 所有轮次都是晴朗天气，消除天气变量
- **纯风险评估**: 专注于基础风险决策，无情境变化
- **稳定概率**: 红鱼/蓝鱼概率保持相对稳定
- **学习纯化**: 排除天气变化的混杂影响

### 认知测量优势
- **内在风险偏好**: 测量个体基本的风险态度
- **学习能力**: 在稳定环境下的策略学习
- **决策一致性**: 无外部变量干扰的决策稳定性

## 示例数据

### CSV格式示例

```csv
trial_type,trial_index,time_elapsed,rt,stimulus,button_pressed,exp_stage,caught_blue,weather,trip_bank,tournament_bank,credit_var,performance_var
single-stim-button,0,2456,1234,"<div class='centerbox'>...",0,practice,false,晴朗,15,15,true,195
single-stim-button,1,4567,2345,"<div class='centerbox'>...",1,practice,true,晴朗,30,45,true,195
survey-text,2,6789,3456,"你认为湖中有多少条鱼？",,"","","",,"",true,195
```

### 关键数据结构示例

```json
{
  "trial_type": "single-stim-button",
  "exp_stage": "test",
  "weather": "晴朗",
  "trip_bank": 60,
  "tournament_bank": 195,
  "caught_blue": true,
  "button_pressed": 1,
  "rt": 1156,
  "credit_var": true,
  "performance_var": 195
}
```

## 认知指标评估

### 基础风险决策
- **风险偏好**: 在稳定环境下的风险态度
- **最优停止**: 最优停止问题的解决能力
- **概率学习**: 对鱼类分布概率的学习

### 决策稳定性
- **策略一致性**: 相似情境下决策的一致性
- **认知稳定**: 无外界变化时的认知表现
- **内在动机**: 纯内在驱动的决策模式

### 学习机制
- **强化敏感性**: 对积分反馈的敏感程度
- **策略优化**: 逐步改进决策策略的能力
- **经验整合**: 整合历史信息指导决策

## Always Sunny vs 标准版对比

### 设计目的差异

| 方面 | Always Sunny版 | 标准版 |
|------|---------------|--------|
| **天气条件** | 固定晴朗 | 晴朗/暴雨交替 |
| **测量重点** | 基础风险偏好 | 情境适应性 |
| **复杂度** | 简化版本 | 完整复杂版本 |
| **适用人群** | 认知负荷敏感者 | 一般成人 |

### 数据解读差异
- **Always Sunny**: 更适合测量个体基础风险态度
- **标准版**: 更适合评估认知灵活性和适应能力
- **互补使用**: 两版本结合可全面评估风险决策能力

## 临床/研究应用

### 基础风险评估
- **风险偏好类型**: 识别风险规避vs风险寻求个体
- **决策障碍**: 排除情境因素后的纯决策问题
- **认知简化**: 适用于认知资源有限的群体

### 特殊群体应用
- **老年人**: 简化版本减少认知负荷
- **注意缺陷**: 避免注意分散到天气变化
- **对照研究**: 作为标准版的基线对照

## 数据分析方法

### 基础指标
- **平均钓鱼次数**: 每轮平均尝试次数
- **最优停止率**: 接近理论最优的比例
- **风险偏好系数**: 量化个体风险态度

### 学习分析
- **学习曲线**: 跨轮次的表现改进
- **策略收敛**: 策略稳定化的速度
- **个体差异**: 学习速度的个体特征

### 质量控制
- **数据有效性**: `credit_var = true`
- **反应质量**: RT在合理范围内
- **任务投入**: 非随机决策模式

## 注意事项

1. **版本选择**: 根据研究目的选择Always Sunny或标准版
2. **基线测量**: 可作为标准版的基线对照
3. **认知负荷**: 适合认知资源有限的参与者
4. **动机维持**: 虽然简化，仍需维持任务动机
5. **数据比较**: 与标准版数据对比需考虑版本差异
6. **适用范围**: 更适合基础风险偏好的纯净测量

## 数据预处理建议

### Always Sunny特定处理
- **天气字段**: 所有记录的weather字段都应为"晴朗"
- **稳定性检查**: 验证决策模式的内在一致性
- **基线建立**: 可作为复杂版本的认知基线

### 与标准版联合分析
- **版本效应**: 评估天气变化对决策的影响
- **个体分层**: 根据Always Sunny表现预测标准版表现
- **认知负荷**: 评估情境复杂度对不同个体的影响

### 质量评估
- **决策理性**: 评估决策是否符合基本理性原则
- **学习证据**: 检查是否存在明显的学习趋势
- **策略识别**: 识别个体采用的决策策略类型