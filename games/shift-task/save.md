# Shift Task 数据保存机制

## 数据保存方式

这个任务使用jsPsych框架进行数据保存，具有双重保存策略：

### 1. 服务器保存 (首选)
- **端点**: `POST /save`
- **数据格式**: JSON
- **触发时机**: 实验完成时 (`on_finish` 回调)
- **成功后**: 自动跳转到 `/next`

### 2. 本地保存 (备用)
- **文件名**: `shift-task_results.csv`
- **格式**: CSV
- **触发条件**: 当服务器端点不可用或返回错误时
- **保存方法**: 调用 `jsPsych.data.localSave()`

## 保存的数据内容

### 基本信息
- `trial_id`: 试验类型标识
- `exp_id`: 实验标识符 ('shift_task')
- `exp_stage`: 实验阶段 ('practice' 或 'test')
- `rt`: 反应时间
- `key_press`: 按键响应 (37=左, 39=右, 40=下)

### 任务特定数据
- `shift_type`: 切换类型 ('stay', 'extra', 'intra', 'reversal')
- `rewarded_feature`: 当前奖励特征
- `rewarded_dim`: 当前奖励维度 (color/shape/pattern)
- `trials_since_switch`: 自上次切换以来的试验数
- `total_points`: 总得分
- `trial_num`: 试验编号

### 选择和正确性
- `stims`: 显示的刺激信息 (JSON格式)
- `choice_stim`: 被试选择的刺激 (JSON格式)
- `choice_position`: 选择位置 ('left', 'middle', 'right')
- `correct`: 选择是否正确 (boolean)
- `feedback`: 反馈信息 (1=得分, 0=无分, -1=未响应)

## 数据处理流程

1. **试验进行中**: 每个试验的数据通过 `jsPsych.data.addDataToLastTrial()` 添加
2. **实验结束**: 所有数据通过 `jsPsych.data.dataAsJSON()` 序列化
3. **保存尝试**: 首先尝试POST到服务器
4. **备用机制**: 失败时自动下载CSV文件到本地

## 认知评估指标

此任务测量以下认知能力：
- **认知灵活性**: 通过维度切换和规则切换测量
- **学习能力**: 通过错误率和适应性测量  
- **工作记忆**: 通过规则保持和更新测量
- **执行控制**: 通过抑制和转换测量

数据文件包含完整的试验序列，可用于计算这些认知指标。