# 数据保存说明 - 概率选择任务（Probabilistic Selection Task）

## 概述
概率选择任务是一个基于强化学习的认知实验，用于测试参与者在不确定环境中的学习能力和决策模式。该任务使用jsPsych心理学实验框架构建，包含训练阶段和测试阶段，参与者需要通过反馈学习不同刺激的奖励概率。

## 数据保存机制

### 1. 服务器端保存（优先方式）
- **端点**: POST 请求到 `/save`
- **数据格式**: JSON字符串，包含完整的实验数据
- **成功后**: 重定向到 `/next` 页面

### 2. 本地文件保存（备用方式）
当服务器端点不可用时，系统会自动切换到本地保存模式：
- **文件名**: `probabilistic-selection_results.csv`
- **保存方式**: 使用jsPsych.data.localSave()方法保存为CSV文件
- **触发条件**: AJAX请求失败时

## 数据结构

### jsPsych数据格式
数据保存为jsPsych标准格式，每个试次包含以下主要字段：

```csv
"rt","key_press","trial_type","trial_index","time_elapsed","feedback","correct","stim_chosen","trial_num","condition","optimal_response","stims","possible_responses",...
```

### 关键数据字段说明
- **rt**: 反应时间（毫秒）
- **key_press**: 按键响应（通常是左右箭头键码37/39）
- **trial_type**: 试次类型（如'poldrack-categorize'）
- **feedback**: 反馈信息（正确/错误）
- **correct**: 是否选择了最优选项（布尔值）
- **stim_chosen**: 选择的刺激
- **condition**: 实验条件（如"80_20"表示80%vs20%的奖励概率）
- **optimal_response**: 最优响应键
- **stims**: 当前试次的刺激对

## 实验设计

### 训练阶段（Learning Phase）
- **刺激对**: 3对不同的抽象图形刺激
- **奖励概率**: 
  - 对A: 80% vs 20%（主要对比）
  - 对B: 70% vs 30%
  - 对C: 60% vs 40%
- **试次数**: 每对刺激多次重复，总计约120-180试次
- **反馈**: 每个选择后提供"正确"或"错误"反馈

### 测试阶段（Test Phase）
- **刺激组合**: 混合不同训练阶段的刺激
- **反馈**: 通常无反馈或延迟反馈
- **测试内容**: 检验学习到的价值表示和决策策略

## 认知测量指标

### 学习表现
- **整体准确率**: 选择高概率奖励刺激的百分比
- **学习曲线**: 随试次进行的表现改善趋势
- **条件差异**: 不同概率对比条件下的学习效果

### 决策策略
- **探索vs利用**: 对已知好选项的坚持程度
- **概率敏感性**: 对不同奖励概率的区分能力
- **选择一致性**: 相同刺激对的选择稳定性

### 认知灵活性
- **适应能力**: 对概率变化的适应速度
- **泛化能力**: 将学习规则应用到新刺激组合的能力

## 技术实现

### jsPsych框架特性
- **插件使用**: poldrack-categorize、poldrack-single-stim等
- **数据管理**: 自动收集时间戳、反应时、准确性等数据
- **实验流程**: 指导语→训练→测试→性能评估

### 性能评估算法
```javascript
// 计算信用变量（credit_var）
// 基于：遗漏率 < 40%，平均RT > 200ms，反应分布合理
credit_var = (missed_percent < 0.4 && avg_rt > 200 && responses_ok)
```

## 文件结构
- **config.json**: 实验配置和元数据
- **index.html**: 主页面，包含jsPsych初始化和数据保存逻辑
- **experiment.js**: 实验逻辑，包含试次定义和性能评估
- **images/**: 实验刺激图片文件夹
- **js/**: jsPsych框架和相关JavaScript库
- **style.css**: 实验界面样式

## 参考文献
Frank, M. J., Seeberger, L. C., & O'Reilly, R. C. (2004). By carrot or by stick: cognitive reinforcement learning in parkinsonism. Science, 306(5703), 1940-1943.

## 应用价值
该任务广泛用于研究：
- 强化学习机制
- 决策神经科学
- 帕金森病等神经疾病的认知影响
- 个体差异的神经基础