# 刺激选择性停止信号任务 - 数据保存说明

## 游戏概述
刺激选择性停止信号任务(Stimulus Selective Stop Signal Task)是一项认知控制实验，要求被试对不同形状做出反应，同时在特定停止信号(蓝色星星)出现时抑制反应，而在忽略信号(橙色星星)出现时继续反应。

## 数据保存机制

### 技术框架
- **实验库**: jsPsych
- **数据系统**: jsPsych.data
- **文件类型**: JavaScript实验

### 数据收集方式

#### 1. 试验数据收集
数据通过以下方式添加到每个试验：
```javascript
jsPsych.data.addDataToLastTrial({
    exp_stage: "practice" | "test",
    trial_num: current_trial,
    credit_var: boolean
})
```

#### 2. 关键数据字段
- **trial_id**: 试验标识('stim', 'fixation', 'feedback'等)
- **rt**: 反应时间(毫秒)，-1表示未反应
- **key_press**: 按键反应(77=M键, 90=Z键)
- **correct_response**: 正确反应按键
- **condition**: 试验条件('stop', 'ignore', 'go')
- **SS_trial_type**: 停止信号试验类型('stop', 'go')
- **exp_stage**: 实验阶段('practice', 'test')
- **trial_num**: 试验编号
- **SSD**: 停止信号延迟时间

#### 3. 性能评估数据
在实验结束时通过`assessPerformance()`函数计算：
- **credit_var**: 表现是否达标(布尔值)
- **平均反应时间**: 中位数反应时间
- **准确率**: 非停止试验的正确率
- **停止成功率**: 停止信号试验的成功抑制率

### 数据保存流程

1. **练习阶段数据收集**
   - NoSS练习：无停止信号的基本反应练习
   - SS练习：包含停止信号的完整练习

2. **测试阶段数据收集**
   - 6个测试块，每块50个试验
   - 动态SSD调整(阶梯程序)
   - 实时反馈计算

3. **最终数据处理**
   - 在`end_block`的`on_finish`回调中执行
   - 计算整体表现指标
   - 生成`credit_var`用于实验信效度验证

### 数据输出格式
数据存储在jsPsych的内部数据结构中，可通过以下方式访问：
```javascript
// 获取特定类型的试验数据
var stop_signal_data = jsPsych.data.getTrialsOfType('stop-signal');

// 获取完整实验数据
var all_data = jsPsych.data.getData();
```

### 认知指标计算
- **执行控制**: 停止信号反应时间(SSRT)计算
- **注意控制**: 选择性抑制能力评估
- **反应抑制**: 成功停止率与失败停止率分析
- **处理速度**: 基准反应时间测量

## 注意事项
1. 数据质量控制基于反应时间(>200ms)和反应分布
2. SSD动态调整确保约50%的停止成功率
3. 区分蓝色(停止)和橙色(忽略)信号的选择性反应
4. 包含注意力检查机制确保数据有效性