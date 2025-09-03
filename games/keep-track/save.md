# Keep-Track 数据保存机制

## 游戏概述
记忆追踪实验 - 一项工作记忆任务，要求被试追踪并记住来自不同目标类别中的最后一个项目。

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
   - 生成CSV文件：`keep-track_results.csv`
   - 使用jsPsych的`localSave`方法

## 实验结构

### 任务类别（6个）
- **动物**：鱼、鸟、蛇、牛、鲸
- **颜色**：红色、黄色、绿色、蓝色、棕色  
- **国家**：中国、美国、英国、印度、巴西
- **距离**：英里、公里、米、英尺、英寸
- **金属**：铁、钛、铝、铅、黄铜
- **亲属**：妈妈、爸爸、哥哥、姐姐、阿姨

### 难度级别
- **3个目标类别**（低难度）
- **4个目标类别**（中难度）
- **5个目标类别**（高难度）

### 实验流程
1. **练习阶段**：3个目标类别的练习试次
2. **测试阶段**：每个难度级别3个区块，共9个区块
3. **注意检查**：定期注意力检查试次

## 数据结构

每个试次记录以下数据：

| 字段 | 类型 | 描述 |
|------|------|------|
| `trial_id` | String | 试次类型（instruction/prompt/stim/response/attention_check） |
| `exp_stage` | String | 实验阶段（practice/test） |
| `load` | Number | 认知负荷（目标类别数量：3/4/5） |
| `targets` | Array | 目标类别列表 |
| `responses` | String | 被试回答（每个目标类别的最后一个词） |
| `correct_responses` | Object | 正确答案（每个目标类别的实际最后词） |
| `rt` | Number | 反应时间（毫秒） |
| `stimulus` | String | 呈现的刺激项目 |
| `category` | String | 刺激所属类别 |
| `key_press` | Number | 按键编码 |
| `trial_type` | String | jsPsych试次类型 |
| `trial_index` | Number | 试次索引 |
| `time_elapsed` | Number | 累计实验时间 |

## 数据输出格式

### JSON格式（服务器保存）
```json
[
  {
    "trial_id": "response",
    "exp_stage": "test",
    "load": 3,
    "targets": ["动物", "颜色", "国家"],
    "responses": "鲸 蓝色 巴西",
    "correct_responses": {"动物": "鲸", "颜色": "蓝色", "国家": "巴西"},
    "rt": 5432,
    "trial_type": "survey-text",
    "trial_index": 45,
    "time_elapsed": 123456
  }
  // ... 更多试次数据
]
```

### CSV格式（本地下载）
包含相同数据字段，以逗号分隔的表格格式便于统计分析。

## 认知指标

### 工作记忆容量
- 各难度级别的准确率
- 错误类型分析（遗漏、错误回忆）

### 认知负荷效应
- 难度递增时的表现衰减
- 不同类别的记忆表现差异

## 文件位置
- 主要逻辑：`index.html`（第30-70行）
- 实验设计：`experiment.js`
- jsPsych框架：`js/jspsych/` 目录

## 使用说明
实验会自动处理数据保存，无需手动操作。如果在本地环境运行，数据将自动下载为CSV文件供后续分析使用。数据包含详细的试次信息，支持精细的认知能力分析。