# 近期探测任务 - 数据保存机制

## 概述
这是一个基于 jsPsych 框架的近期探测任务，用于评估工作记忆和认知控制能力。参与者需要记住6个字母的记忆集，然后判断探测字母是否在记忆集中。

## 数据保存机制

### 1. 数据获取
- 使用 `jsPsych.data.dataAsJSON()` 获取完整的实验数据
- 数据包含所有试验的详细信息，包括记忆集、探测刺激、反应时间、正确性等

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
- 文件名：`recent-probes_results.csv`

```javascript
jsPsych.data.localSave('recent-probes_results.csv', 'csv');
```

### 3. 数据内容

#### 试验数据包含：
- `trial_id`：试验类型标识（"stim", "probe", "fixation", "ITI_fixation"等）
- `exp_stage`：实验阶段（"practice", "test"）
- `trial_num`：试验编号
- `stim`：当前记忆集（6个字母数组）
- `stims_1back`：前一个记忆集
- `stims_2back`：前两个记忆集
- `probe_letter`：探测字母
- `probeType`：探测类型（rec_pos, rec_neg, xrec_pos, xrec_neg）
- `correct_response`：正确反应键码
- `key_press`：实际按键
- `rt`：反应时间
- `correct`：反应是否正确

#### 探测类型说明：
- **rec_pos**：探测字母在当前记忆集中（正确答案：左箭头键37）
- **rec_neg**：探测字母来自前一个记忆集但不在当前记忆集中（右箭头键39）
- **xrec_pos**：探测字母在当前记忆集中但不在前一个记忆集中（左箭头键37）
- **xrec_neg**：探测字母既不在当前也不在前一个记忆集中（右箭头键39）

#### 按键映射：
- 左箭头键（37）：探测字母在记忆集中
- 右箭头键（39）：探测字母不在记忆集中

#### 实验结构：
- 练习阶段：4个试验
- 测试阶段：3轮，每轮24个试验，总共72个试验
- 注意力检查：在第1轮和第3轮后进行

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

### 6. 性能评估
```javascript
function assessPerformance() {
    var missed_percent = missed_count/trial_count
    credit_var = (missed_percent < 0.4 && avg_rt > 200 && responses_ok)
}
```

评估标准：
- 错过试验比例 < 40%
- 平均反应时间 > 200ms
- 反应分布合理（没有按键偏好）

### 7. 时间参数
- 记忆集呈现：2500ms
- 探测刺激呈现：2000ms（练习）/ 7000ms（测试）
- 固定十字：1000ms或3000ms
- 试验间间隔：5000ms

## 数据分析价值
该任务评估：
- **工作记忆**（记忆集维持、更新）
- **认知控制**（干扰抑制、冲突解决）
- **执行功能**（监控、策略调整）
- **注意力**（选择性注意、持续注意）

### 关键分析指标：
- 不同探测类型的正确率和反应时间
- 记忆负荷效应
- 干扰控制能力
- 前摄干扰和回溯干扰模式

数据可用于心理学研究、认知评估和神经心理学测试，特别适用于研究工作记忆缺陷和执行功能障碍。