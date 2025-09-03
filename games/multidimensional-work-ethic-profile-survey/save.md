# Multidimensional Work Ethic Profile Survey - 数据保存机制

## 数据保存方式

### 服务器端保存
- 通过Ajax POST请求将数据发送到 `/save` 端点
- 数据格式：`{'data': results}`

### 本地保存（当服务器不可用时）
- 自动触发JSON文件下载
- 下载文件名：`multidimensional-work-ethic-profile-survey_result.json`
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
- 用户完成所有必填问题（共9页调查问卷）
- 点击提交按钮
- 表单验证通过

## 示例数据格式
```json
[
  {
    "name": "question_1_options",
    "value": "1",
    "options": "非常不同意|不同意|不确定|同意|非常同意",
    "text": "工作应该被视为生活的核心活动之一。"
  },
  {
    "name": "question_2_options",
    "value": "4",
    "options": "非常不同意|不同意|不确定|同意|非常同意",
    "text": "人们应该以工作为荣。"
  }
]
```

## 调查内容
这是一个多维工作伦理档案调查，基于Miller等人(2002)开发的多维工作伦理测量工具。该调查评估个体对工作伦理的多个维度的态度和信念，包括：
- 工作的重要性
- 对工作的责任感
- 工作的意义和价值
- 工作态度和行为准则

## 参考文献
Miller, M. J., Woehr, D. J., & Hudspeth, N. (2002). The meaning and measurement of work ethic: Construction and initial validation of a multidimensional inventory. Journal of Vocational Behavior, 60(3), 451-489.