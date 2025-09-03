# 数据保存机制

## 保存方式
- **框架**: jsPsych 数据收集系统
- **数据格式**: JSON
- **保存位置**: 浏览器控制台 / jsPsych数据对象

## 数据内容

### 主要数据结构
- **试验数据**: 通过 `jsPsych.data.getTrialsOfType()` 收集
- **反应时间**: 记录每次按键的响应时间 (rt)
- **准确性**: 记录每次试验的正确性 (correct)
- **试验阶段**: 区分练习阶段 ("practice") 和测试阶段 ("test")

### 实验摘要计算
```javascript
function compute_experiment_summary() {
  var trials = jsPsych.data.getTrialsOfType('poldrack-categorize');
  // 计算总体准确率和平均反应时间
  return {
    rt: Math.floor(sum_rt / correct_rt_count),
    accuracy: Math.floor(correct_trial_count / count * 100)
  }
}
```

### 保存的具体数据
1. **每次试验记录**:
   - `trial_id`: 试验标识
   - `exp_stage`: "practice" 或 "test"
   - `correct`: 是否正确
   - `rt`: 反应时间(毫秒)
   - `condition`: 试验条件 (congruent/incongruent)

2. **实验摘要**:
   - 总体准确率百分比
   - 平均反应时间(毫秒)

## 访问数据的方法
- 使用 `jsPsych.data.get()` 获取所有数据
- 使用 `jsPsych.data.getTrialsOfType('poldrack-categorize')` 获取分类试验数据
- 在实验结束时自动显示汇总统计信息

## 认知测量指标
- **执行功能**: 通过不一致条件下的表现测量抑制控制
- **注意力**: 通过反应时间和准确性测量选择性注意
- **处理速度**: 通过平均反应时间测量信息处理速度