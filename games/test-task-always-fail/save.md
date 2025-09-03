# Test Task Always Fail - 数据保存机制

## 概述
这是一个基于jsPsych框架的测试任务，故意设计为总是失败（credit_var 始终为 false）。任务要求参与者对十字形刺激做出反应，用于测试实验系统的错误处理机制。

## 数据保存机制

### 数据收集
- **框架**: jsPsych实验框架
- **数据类型**: 
  - 反应时间 (rt)
  - 按键反应 (key_press)
  - 试验标识 (trial_id)
  - 任务性能数据 (performance_var, credit_var)
  - 注意力检查结果
  - 任务后问卷响应

### 数据保存流程
1. **数据序列化**: 使用 `jsPsych.data.dataAsJSON()` 将所有试验数据序列化为JSON格式
2. **服务器保存尝试**: 
   - 通过AJAX POST请求发送到 `/save` 端点
   - 数据格式: JSON
3. **本地备份保存**: 
   - 当服务器不可用时，自动触发本地保存
   - 使用 `jsPsych.data.localSave()` 函数
   - 保存格式: CSV
   - 文件名: `test-task-always-fail_results.csv`

### 数据内容结构
- **试验数据**: 每个试验的反应时间、按键、刺激信息
- **性能评估**: credit_var (始终为false), performance_var (始终为0)
- **任务元数据**: 实验长度、试验计数、遗漏试验统计
- **问卷数据**: 参与者对任务的总结和意见反馈

### 关键特征
- **故意失败设计**: credit_var 硬编码为 false，用于测试系统错误处理
- **双重保存机制**: 服务器优先，本地备份
- **多数据格式**: 支持JSON（服务器）和CSV（本地）格式
- **完整数据记录**: 包含原始试验数据和计算得出的性能指标

### 文件位置
- 本地保存文件: `test-task-always-fail_results.csv`（下载到用户默认下载文件夹）
- 服务器保存: 通过 `/save` API端点处理