# Need for Cognition and Faith in Intuition Survey - 数据保存机制

## 数据保存方式

### 服务器端保存
- 通过Ajax POST请求将数据发送到 `/save` 端点
- 数据格式：`{'data': results}`

### 本地保存（当服务器不可用时）
- 自动触发JSON文件下载
- 下载文件名：`need-for-cognition-faith-in-intuition-survey_result.json`
- 文件类型：JSON格式

## 数据结构

保存的数据是一个结果数组，每个结果对象包含以下字段：

```json
{
  "name": "问题名称/ID",
  "value": "用户选择的答案值",
  "options": "可选选项",
  "text": "问题文本内容"
}
```

## 触发条件
- 用户完成所有必填问题（共7页调查问卷）
- 点击提交按钮
- 表单验证通过

## 示例数据格式
```json
[
  {
    "name": "need_for_cognition_1_options",
    "value": "1",
    "options": "极不符合|不符合|有点不符合|中性|有点符合|符合|极符合",
    "text": "我真的很喜欢需要大量思考的任务。"
  },
  {
    "name": "faith_in_intuition_2_options", 
    "value": "5",
    "options": "极不符合|不符合|有点不符合|中性|有点符合|符合|极符合",
    "text": "我相信自己的第一印象。"
  }
]
```

## 调查内容
这是一个认知需求与直觉信念调查，基于Epstein等人(1996)的认知-经验自我理论开发。该调查测量个体在两个维度上的差异：

### 主要测量维度：
1. **认知需求(Need for Cognition)**
   - 评估个体对分析-理性思维的偏好程度
   - 测量享受认知努力和复杂思考的倾向

2. **直觉信念(Faith in Intuition)**  
   - 评估个体对直觉-经验性思维的信赖程度
   - 测量相信和依赖直觉判断的倾向

### 理论背景
- 基于认知-经验自我理论(Cognitive-Experiential Self-Theory)
- 区分两种信息处理系统：
  - **分析系统**：逻辑的、有意识的、规则导向的
  - **经验系统**：直觉的、自动的、情感导向的

## 参考文献
Epstein, S., Pacini, R., Denes-Raj, V., & Heier, H. (1996). Individual Differences in Intuitive-Experiential and Analytical-Rational Thinking Styles. Journal of Personality and Social Psychology, 71(2), 390–405.