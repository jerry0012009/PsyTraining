# Kirby 数据保存机制

## 游戏概述
Kirby延迟折扣任务 - 基于Kirby & Marakovic (1996)研究的跨期决策实验，评估被试对即时与延迟奖励的偏好。

## 数据保存方式

### 保存触发条件
- 实验结束时自动保存所有试次数据
- 使用jsPsych框架的`on_finish`回调函数

### 保存机制
1. **服务器保存**（主要方式）：
   - POST请求到 `/save` 端点
   - 数据格式：JSON字符串
   - 成功后跳转到 `/next` 页面

2. **本地下载**（备用方式）：
   - 当服务器端点不可用时自动启用
   - 生成CSV文件：`kirby_results.csv`
   - 使用jsPsych的`localSave`方法

## 实验结构

### 任务类型
延迟折扣任务 - 在即时较小奖励与延迟较大奖励之间做选择

### 选择参数（27个试次）
基于Kirby & Marakovic (1996)的标准化参数：

#### 即时奖励金额（美元）
[54, 55, 19, 31, 14, 47, 15, 25, 78, 40, 11, 67, 34, 27, 69, 49, 80, 24, 33, 28, 34, 25, 41, 54, 54, 22, 20]

#### 延迟奖励金额（美元）
[55, 75, 25, 85, 25, 50, 35, 60, 80, 55, 30, 75, 35, 50, 85, 60, 85, 35, 80, 30, 50, 30, 75, 60, 80, 25, 55]

#### 延迟天数
[117, 61, 53, 7, 19, 160, 13, 14, 192, 62, 7, 119, 186, 21, 91, 89, 157, 29, 14, 179, 30, 80, 20, 111, 30, 136, 7]

### 操作方式
- **'Q'键**：选择左侧选项（即时奖励）
- **'P'键**：选择右侧选项（延迟奖励）

## 数据结构

每个试次记录以下数据：

| 字段 | 类型 | 描述 |
|------|------|------|
| `trial_id` | String | 试次类型（choice/instruction/attention_check） |
| `small_amount` | Number | 即时奖励金额（美元） |
| `large_amount` | Number | 延迟奖励金额（美元） |
| `later_delay` | Number | 延迟天数 |
| `key_press` | Number | 按键编码（81='Q', 80='P'） |
| `rt` | Number | 反应时间（毫秒） |
| `stimulus` | String | 呈现的选择界面HTML |
| `possible_responses` | Array | 可用按键选项 |
| `trial_type` | String | jsPsych试次类型 |
| `trial_index` | Number | 试次索引 |
| `time_elapsed` | Number | 累计实验时间 |
| `credit_var` | Boolean | 表现合格标志 |
| `performance_var` | String | 奖励支付信息 |

## 数据输出格式

### JSON格式（服务器保存）
```json
[
  {
    "trial_id": "choice",
    "small_amount": 54,
    "large_amount": 55,
    "later_delay": 117,
    "key_press": 81,
    "rt": 2345,
    "stimulus": "<div class='centerbox'>...",
    "possible_responses": [81, 80],
    "trial_type": "poldrack-single-stim",
    "trial_index": 5,
    "time_elapsed": 45678
  }
  // ... 更多试次数据
]
```

### CSV格式（本地下载）
包含相同数据字段，以逗号分隔的表格格式便于统计分析。

## 认知指标

### 延迟折扣率
- 个体折扣参数k值计算
- 不同延迟条件下的选择模式

### 选择一致性
- 跨试次的选择模式一致性
- 异常选择检测

### 时间偏好
- 即时vs延迟选择比例
- 不同金额-延迟比下的偏好

## 奖励机制
- 实验结束时随机选择一个试次
- 根据该试次选择给予相应奖励
- 激励被试做出真实偏好选择

## 表现评估标准
- 缺失反应率 < 40%
- 平均反应时间 > 200ms
- 满足标准者获得credit_var = true

## 文件位置
- 主要逻辑：`index.html`（第30-70行）
- 实验设计：`experiment.js`
- jsPsych框架：`js/jspsych/` 目录

## 使用说明
实验会自动处理数据保存，包含完整的跨期决策数据。如果在本地环境运行，数据将自动下载为CSV文件。数据支持延迟折扣建模和个体时间偏好分析。