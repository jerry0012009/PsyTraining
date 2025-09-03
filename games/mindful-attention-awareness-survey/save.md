# Mindful Attention Awareness Survey (MAAS) - 数据保存机制

## 概述
正念注意力觉知调查（MAAS）是一个广泛使用的心理测评工具，用于测量个体在日常生活中保持正念状态的倾向。该量表包含15个项目，评估个体对当下体验的开放和接受性注意力，以及对正在发生事件的觉察程度。

## 数据保存方式

### 1. 主要保存机制
- **服务器提交**: 优先尝试POST数据到服务器端点 `/save`
- **本地备份**: 服务器不可用时，自动触发本地文件下载

### 2. 本地保存格式
- **文件名**: `正念注意力觉知调查_结果.json`（中文文件名）
- **文件类型**: JSON格式
- **触发条件**: 服务器POST请求失败时自动下载

### 3. 数据结构

```json
[
  {
    "name": "mindful-attention-awareness-survey_2_options",
    "value": "4",
    "options": "almost always|very frequently|somewhat frequently|somewhat infrequently|very infrequently|almost never",
    "text": "我可能正在经历某种情绪，但直到一段时间后才意识到。"
  },
  {
    "name": "mindful-attention-awareness-survey_3_options",
    "value": "5",
    "options": "almost always|very frequently|somewhat frequently|somewhat infrequently|very infrequently|almost never",
    "text": "我会因为粗心、不付注意或想着其他事情而打破或洒漏东西。"
  }
  // ... 其他题目数据
]
```

#### 数据字段说明：
- `name`: 题目标识符（如 mindful-attention-awareness-survey_2_options）
- `value`: 用户选择的选项值（1-6的数字）
- `options`: 英文选项列表（6个频率等级）
- `text`: 题目的中文文本内容

### 4. 评分系统

#### 6点频率量表：
- **1分 = 几乎总是 (almost always)**
- **2分 = 非常频繁 (very frequently)**
- **3分 = 比较频繁 (somewhat frequently)**
- **4分 = 比较少见 (somewhat infrequently)**
- **5分 = 非常少见 (very infrequently)**
- **6分 = 几乎从不 (almost never)**

#### 计分方式：
- **总分范围**: 15-90分（15个题目×1-6分）
- **计分方法**: 直接累加所有题目得分
- **高分含义**: 得分越高表示正念水平越高

#### 题目内容维度：
调查涵盖以下正念维度：
- 情绪觉察延迟
- 注意力分散导致的意外
- 专注困难
- 自动化行为
- 身体感觉觉察
- 记忆注意力
- 未来/过去导向思维
- 无意识进食

### 5. 保存时机
- 用户完成全部15个题目
- 每个题目都是必填项
- 点击"完成"按钮提交表单
- 数据验证通过后触发保存流程

### 6. 技术实现
- 使用jQuery向导插件管理多步骤表单
- 每个步骤包含多个题目（分3个页面显示）
- 表单验证确保所有题目都已回答
- AJAX提交失败时自动下载JSON文件

## 数据用途
MAAS调查数据可用于：
- 正念水平基线评估
- 正念训练效果评估
- 注意力调节能力研究
- 心理健康状态评估
- 冥想练习指导个性化
- 认知行为治疗辅助评估
- 压力管理训练效果监测

## 量表特点
- **国际标准量表**: MAAS是国际通用的正念评估工具
- **良好信效度**: 经过大量研究验证的可靠测量工具
- **简洁有效**: 15个题目即可全面评估正念水平
- **适用性广**: 适用于普通人群和临床群体