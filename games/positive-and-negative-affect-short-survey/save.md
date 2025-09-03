# 数据保存说明 - 正性与负性情绪量表（简化版）

## 概述
正性与负性情绪量表（PANAS）简化版是一个心理测量工具，用于评估个体的正性情绪(PA)和负性情绪(NA)状态。该调查包含10个情绪形容词，使用5点李克特量表进行评分。

## 数据保存机制

### 1. 服务器端保存（优先方式）
- **端点**: POST 请求到 `/save`
- **数据格式**: 表单数据，包含序列化的结果数组
- **成功后**: 重定向到 `/next` 页面

### 2. 本地文件保存（备用方式）
当服务器端点不可用时，系统会自动切换到本地保存模式：
- **文件名**: `positive-and-negative-affect-short-survey_result.json`
- **保存方式**: 浏览器下载
- **触发条件**: AJAX请求失败时

## 数据结构

保存的数据为JSON数组格式，每个元素包含以下字段：

```json
[
  {
    "name": "positive-and-negative-affect-short-survey_[N]_options",
    "value": "1-5",
    "options": "一点也不或几乎没有: 1|一点点:2|中等程度:3|相当多: 4|极度: 5",
    "text": "情绪形容词（如：坚定的、专注的、警觉的等）"
  }
]
```

### 字段说明
- **name**: 问题的唯一标识符，格式为 `positive-and-negative-affect-short-survey_[序号]_options`
- **value**: 用户选择的数值（1-5）
- **options**: 完整的选项列表，用"|"分隔
- **text**: 情绪形容词的中文描述

## 测量维度

### 正性情绪(PA)维度
- 坚定的
- 专注的  
- 警觉的
- 有灵感的
- 活跃的

### 负性情绪(NA)维度
- 恐惧的
- 紧张的
- 沮丧的
- 羞愧的
- 敌对的

## 评分说明
- **量表**: 5点李克特量表
- **评分范围**: 1（一点也不或几乎没有）到 5（极度）
- **指导语**: "请思考您自己通常的感受状态，您一般在多大程度上感到："

## 文件位置
- **配置文件**: `config.json` - 包含实验基本信息和参考文献
- **主程序**: `index.html` - 包含完整的问卷界面和数据处理逻辑
- **样式文件**: `css/` 目录下的各种样式文件
- **脚本文件**: `js/` 目录下的JavaScript库文件

## 参考文献
Thompson, E. R. (2007). Development and Validation of an Internationally Reliable Short-Form of the Positive and Negative Affect Schedule (PANAS). Journal of Cross-Cultural Psychology, 38(2), 227–242.