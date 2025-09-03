# MPQ Control Survey - 数据保存机制

## 数据保存方式

### 服务器端保存
- 通过Ajax POST请求将数据发送到 `/save` 端点
- 数据格式：`{'data': results}`

### 本地保存（当服务器不可用时）
- 自动触发JSON文件下载
- 下载文件名：`mpq_control_survey_result.json`
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
- 用户完成所有必填问题
- 点击提交按钮
- 表单验证通过

## 示例数据格式
```json
[
  {
    "name": "mpq_control_survey_2_options",
    "value": "1",
    "options": "正确|错误", 
    "text": "我在完成一项活动之前就停止了。"
  },
  {
    "name": "mpq_control_survey_3_options",
    "value": "2",
    "options": "正确|错误",
    "text": "我花时间考虑各个方面。"
  }
]
```

## 调查内容
这是一个多维人格问卷（MPQ）的控制（vs冲动性）量表调查，包含多个评估个体控制冲动能力的问题项目。