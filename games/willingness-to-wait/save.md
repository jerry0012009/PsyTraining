# 数据保存说明 - 等待意愿测试

## 实验概述

等待意愿测试是一个基于jsPsych框架的认知实验，用于测量参与者的延迟满足能力。参与者需要决定是立即收集0分币还是等待一段时间获取30分币。

## 数据收集内容

### 试验数据
1. **反应时间** (`rt`): 参与者按键的反应时间
2. **延迟时间** (`delay`): 每个试验的等待时间设置
3. **实验阶段** (`exp_stage`): 'practice' 或 'test'
4. **试验类型** (`trial_id`): 包括 'stim', 'feedback', 'welcome', 'end' 等
5. **键盘响应** (`key_press`): 用户按键记录（空格键收集币）

### 性能评估
- **总收入** (`total_money`): 参与者获得的总金额
- **信用变量** (`credit_var`): 基于错过试验比例和平均反应时间的表现评估
- **表现变量** (`performance_var`): 最终表现得分

### 问卷数据
- 任务描述问题的开放式回答
- 对实验的评论和意见

## 数据保存机制

### 保存流程
1. **数据序列化**：
   ```javascript
   var data = jsPsych.data.dataAsJSON();
   ```
   - 将所有试验数据转换为JSON格式

2. **服务器保存**（优先）：
   ```javascript
   $.ajax({
       type: "POST",
       url: '/save',
       data: { "data": data },
       success: function(){ document.location = "/next" }
   })
   ```

3. **本地保存**（备用）：
   ```javascript
   jsPsych.data.localSave('willingness-to-wait_results.csv', 'csv');
   ```
   - 文件名：`willingness-to-wait_results.csv`
   - 格式：CSV表格格式

### 数据添加机制
- 每个试验结束时通过 `addID('willingness-to-wait')` 添加实验标识
- 关键数据通过 `jsPsych.data.addDataToLastTrial()` 添加到试验记录中
- 包括延迟时间、实验阶段、表现评估等关键指标

## 技术特点
- 使用jsPsych框架的内置数据管理系统
- 支持自动化的本地文件下载作为备用保存方案
- 数据格式标准化，便于后续统计分析
- 包含完整的试验时间线和用户交互记录

## 认知测量指标
- **延迟满足能力**：通过等待行为评估自控力
- **决策模式**：分析在不同延迟条件下的选择倾向
- **时间偏好**：测量对即时与延迟奖励的偏好程度