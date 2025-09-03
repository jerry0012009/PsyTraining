# Meditation Expertise Survey - 数据保存机制

## 概述
冥想经验调查是一个专门评估个体冥想练习水平和经验的心理测评工具。该调查采用多维度评估方式，包括当前练习状态、历史练习经历和静修经验，用于量化测量冥想专业水平。

## 数据保存方式

### 1. 主要保存机制
- **服务器提交**: 优先尝试POST数据到服务器端点 `/save`
- **本地备份**: 服务器不可用时，自动触发本地文件下载

### 2. 本地保存格式
- **文件名**: `meditation-expertise_result.json`
- **文件类型**: JSON格式
- **触发条件**: 服务器POST请求失败时自动下载

### 3. 数据结构

```json
[
  {
    "name": "meditation-expertise_2_options",
    "value": "6",
    "options": "daily or almost daily| 2-4 times per week| about once per week| less than once per week",
    "text": "I meditate"
  },
  {
    "name": "meditation-expertise_3_options", 
    "value": ".33",
    "options": "5-15 minutes/day|15-30 minutes/day|>30 minutes/day",
    "text": "On days when I meditate, the duration is"
  },
  {
    "name": "meditation-expertise_4",
    "value": "2.5",
    "text": "For how many years have you been meditating at this frequency and duration?  Enter a number e.g. 5, 2.5, 0.75"
  }
  // ... 其他字段数据
]
```

#### 数据字段说明：
- `name`: 字段标识符（如 meditation-expertise_2_options）
- `value`: 用户选择的选项值或输入的数值
- `options`: 选择题的完整选项列表
- `text`: 问题的完整文本内容

### 4. 评分系统

#### 当前冥想练习（必填项）：
**冥想频率权重：**
- 每日或几乎每日：6分
- 每周2-4次：3分
- 约每周一次：1分
- 少于每周一次：0.5分

**冥想时长权重：**
- 5-15分钟/天：0.12分
- 15-30分钟/天：0.33分
- >30分钟/天：0.67分

**练习年数：** 用户输入的实际年数（支持小数，如2.5年）

#### 历史练习经历（可选项）：
- 与当前练习使用相同的频率和时长权重系统
- 记录之前不同阶段的冥想练习情况

#### 静修经验（可选项）：
- 总静修小时数：天数 × 每日冥想小时数的累计总和
- 例如：9天静修×每日14小时 + 10天静修×每日14小时 = 266小时

### 5. 专业水平计算
综合评估包括：
- 当前练习强度 = 频率权重 × 时长权重 × 练习年数
- 历史练习贡献（如有）
- 静修经验加权（如有）

### 6. 保存时机
- 用户完成必填的当前冥想练习信息
- 可选填写历史练习和静修经验信息
- 点击"完成"按钮提交表单
- 数据验证通过后触发保存流程

### 7. 技术实现
- 使用jQuery AJAX进行数据提交
- 支持数值输入验证（整数或小数）
- 多步骤向导界面，支持跳过可选步骤
- 自动文件下载作为数据保存备份方案

## 数据用途
该调查数据可用于：
- 冥想经验水平分级评估
- 冥想练习一致性研究
- 正念训练效果追踪
- 冥想与认知能力关联性研究
- 个性化冥想指导方案制定