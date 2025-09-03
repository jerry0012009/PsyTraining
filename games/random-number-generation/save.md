# 随机数字生成任务 - 数据保存机制

## 概述
这是一个基于 jsPsych 框架的随机数字生成任务，用于评估执行功能和认知灵活性。

## 数据保存机制

### 1. 数据获取
- 使用 `jsPsych.data.dataAsJSON()` 获取完整的实验数据
- 数据包含所有试验的详细信息，包括数字选择序列、反应时间、随机性指标等

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
- 文件名：`random-number-generation_results.csv`

```javascript
jsPsych.data.localSave('random-number-generation_results.csv', 'csv');
```

### 3. 数据内容

#### 试验数据包含：
- `trial_id`：试验类型标识（"stim", "wait", "practice_intro", "test_intro"等）
- `exp_stage`：实验阶段（"practice", "test"）
- `button_pressed`：点击的数字按钮（1-9）
- `rt`：反应时间
- `timing_response`：反应时间限制（800ms）
- `response_ends_trial`：反应是否结束试验（false）

#### 任务特点：
- 虚拟数字键盘：1-9 数字按钮
- 练习阶段：10 个试验
- 正式测试：162 个试验（注：代码中实际只执行了 practice_stims.length 次）
- 每个试验时间限制：800ms
- 试验间隔：200ms 等待时间

#### 任务后问卷：
- 任务理解总结
- 任务评论反馈

### 4. 触发时机
- 实验完成时在 `on_finish` 回调中触发
- 每个试验结束时在 `on_trial_finish` 中添加试验ID

### 5. 错误处理
- 服务器返回非200状态码时仍然重定向
- 其他错误时自动切换到本地保存
- 确保数据不会丢失

### 6. 界面交互
- 使用 `single-stim-button` 插件处理按钮点击
- 数字按钮点击后变红色提供视觉反馈
- 试验结束后数字暂时消失，然后重新出现开始下个试验

## 数据分析价值
该任务评估：
- **执行功能**（随机性生成、工作记忆更新）
- **认知控制**（抑制重复模式、避免序列偏好）
- **认知灵活性**（策略切换、模式打破）
- **注意力**（持续注意、监控表现）

### 随机性分析指标：
- 数字重复频率
- 序列模式识别
- 均匀分布检验
- 随机性熵计算
- 游程检验

数据可用于心理学研究、认知评估和神经心理学测试，特别适用于研究执行功能障碍和认知控制能力。