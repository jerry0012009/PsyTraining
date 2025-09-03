# 心理不应期双选择任务 - 数据保存机制

## 概述
这是一个基于 jsPsych 框架的心理不应期双选择任务，用于评估双任务执行能力和认知处理速度。

## 数据保存机制

### 1. 数据获取
- 使用 `jsPsych.data.dataAsJSON()` 获取完整的实验数据
- 数据包含所有试验的详细信息，包括双重反应时间、正确性、刺激信息等

### 2. 保存方式

#### 主要保存方式：服务器保存
- 通过 Ajax POST 请求将数据发送到 `/save` 端点
- 数据格式：JSON 字符串
- 成功后重定向到 `/next` 页面

```javascript
$.ajax({
    type: "POST",
    url: '/save',
    data: { "data": data },
    success: function(){ document.location = "/next" },
    dataType: "application/json"
});
```

#### 备用保存方式：本地保存
- 当服务器保存失败时，自动触发本地保存
- 保存为 CSV 格式文件
- 文件名：`psychological-refractory-period-two-choices_results.csv`

```javascript
jsPsych.data.localSave('psychological-refractory-period-two-choices_results.csv', 'csv');
```

### 3. 数据内容

#### 试验数据包含：
- `trial_id`：试验类型标识
- `exp_stage`：实验阶段（练习/正式）
- `rt`：双重反应时间数组
- `key_presses`：按键记录数组
- `choice1_stim`：第一个选择刺激（彩色方块）
- `choice2_stim`：第二个选择刺激（数字）
- `choice1_correct_response`：第一个任务正确反应键码
- `choice2_correct_response`：第二个任务正确反应键码
- `ISI`：刺激间间隔
- `trial_num`：试验编号

#### 按键映射：
- 彩色方块：Z键（90）、X键（88）
- 数字：N键（78）、M键（77）

#### 任务后问卷：
- 任务理解总结
- 任务评价反馈

### 4. 触发时机
- 实验完成时在 `on_finish` 回调中触发
- 每个试验结束时在 `on_trial_finish` 中添加试验ID

### 5. 错误处理
- 服务器返回非200状态码时仍然重定向
- 其他错误时自动切换到本地保存
- 确保数据不会丢失

### 6. 性能评估
```javascript
function assessPerformance() {
    var missed_percent = missed_count/trial_count
    credit_var = (missed_percent < 0.4 && avg_rt > 200)
}
```

## 数据分析价值
该任务评估：
- 执行功能（双任务协调）
- 注意力（分配注意、选择性注意）
- 处理速度（序列反应时间）
- 认知控制（任务切换、反应抑制）

数据可用于心理学研究、认知评估和神经心理学测试，特别适用于研究心理不应期效应和双任务干扰。