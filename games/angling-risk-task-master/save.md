# Save Data Documentation - Angling Risk Task

## 数据输出格式

### 基本信息
- **框架**: jsPsych心理学实验框架
- **输出格式**: CSV文件
- **文件名**: `angling-risk-task_results.csv`
- **保存机制**: 服务器POST + 本地CSV下载备份

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

### 风险任务特定字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `exp_stage` | string | 实验阶段 ("practice"/"test") |
| `caught_blue` | boolean | 是否钓到蓝鱼 |
| `weather` | string | 天气条件 ("晴朗"/"暴雨") |
| `round_over` | number | 轮次结束标志 (0/1) |
| `trial_num` | number | 轮内试验编号 |
| `trip_bank` | number | 本轮积分 |
| `tournament_bank` | number | 总积分 |
| `red_fish_num` | number | 红鱼数量 |
| `total_fish_num` | number | 总鱼数量 |
| `credit_var` | boolean | 信用变量（数据有效性） |
| `performance_var` | number | 表现变量（总积分或0） |

## 示例数据

### CSV格式示例

```csv
trial_type,trial_index,time_elapsed,rt,stimulus,button_pressed,exp_stage,caught_blue,weather,trip_bank,tournament_bank,credit_var,performance_var
single-stim-button,0,2456,1234,"<div class='centerbox'>...",0,practice,false,晴朗,15,15,true,180
single-stim-button,1,4567,2345,"<div class='centerbox'>...",1,practice,true,晴朗,30,45,true,180
survey-text,2,6789,3456,"你认为湖中有多少条鱼？",,"","","",,"",true,180
```

### 关键数据结构示例

```json
{
  "trial_type": "single-stim-button",
  "exp_stage": "test",
  "weather": "晴朗",
  "trip_bank": 45,
  "tournament_bank": 180,
  "caught_blue": false,
  "button_pressed": 0,
  "rt": 1245,
  "credit_var": true,
  "performance_var": 180
}
```

## 认知指标评估

### 风险决策指标
- **风险倾向**: 继续钓鱼vs停止钓鱼的选择模式
- **损失敏感性**: 面对潜在损失时的决策变化
- **风险调节**: 根据情境调整风险策略的能力

### 学习与适应
- **强化学习**: 从反馈中学习最优策略
- **情境敏感性**: 对天气变化的策略调整
- **经验积累**: 跨轮次的表现改善

### 执行控制
- **冲动控制**: 抑制继续钓鱼冲动的能力
- **目标导向**: 长期积分最大化策略
- **认知灵活性**: 策略切换能力

## 任务机制详解

### 游戏规则
- **钓鱼选择**: 每轮可选择继续钓鱼或停止
- **鱼类效应**: 蓝鱼增加积分，红鱼清零本轮积分
- **天气影响**: 暴雨天气增加红鱼概率
- **积分规则**: 只有停止钓鱼才能保留本轮积分

### 风险结构
- **晴朗天气**: 红鱼概率较低，相对安全
- **暴雨天气**: 红鱼概率较高，高风险高回报
- **动态调整**: 湖中鱼类数量动态变化

## 临床/研究应用

### 风险决策评估
- **病理性赌博**: 过度风险偏好的识别
- **焦虑障碍**: 过度风险规避行为
- **冲动障碍**: 无法抑制继续钓鱼的冲动

### 神经心理学评估
- **前额叶功能**: 执行控制和风险评估
- **边缘系统**: 情绪驱动的风险决策
- **学习系统**: 强化学习和策略调整

## 数据分析方法

### 关键指标计算

**风险偏好指标:**
- 平均每轮钓鱼次数
- 高风险情境(暴雨)下的决策模式
- 损失后的行为调整

**学习曲线:**
- 跨轮次的积分增长趋势
- 策略优化速度
- 适应性学习能力

**反应时间分析:**
- 决策复杂度的RT反映
- 冲突情境下的思考时间
- 策略确定性的RT指标

### 质量控制标准
- **有效数据**: `credit_var = true`
- **反应时间**: 平均RT > 200ms
- **漏报率**: < 40%的试验超时
- **完成度**: 完成规定轮数的实验

## 注意事项

1. **任务理解**: 确保参与者理解积分规则和风险结构
2. **练习充分**: 练习阶段掌握任务操作
3. **动机维持**: 说明积分的重要性以维持动机
4. **环境控制**: 避免外界干扰影响决策
5. **数据完整性**: 确保所有关键字段完整记录
6. **个体差异**: 考虑年龄、性别、教育水平对风险偏好的影响

## 数据预处理建议

### 异常值处理
- **RT异常**: 过短(<200ms)或过长(>10s)的响应
- **策略异常**: 完全随机或完全固定的选择模式
- **注意缺陷**: 连续超时或错误操作

### 分析维度
- **按天气条件**: 比较晴朗vs暴雨天气下的决策
- **按实验阶段**: 练习vs正式测试的表现差异
- **按时间进程**: 学习曲线和疲劳效应
- **个体差异**: 风险偏好的个体特征分析

### 高级分析方法
- **强化学习建模**: 使用Q-learning等模型拟合决策过程
- **贝叶斯分析**: 评估个体的主观概率估计
- **计算建模**: 结合认知模型理解决策机制