# 数据保存说明 - 意愿接近统计学不太可能追求目标调查

## 数据收集方式

该调查问卷通过以下方式收集用户响应数据：

1. **输入项收集**：
   - 收集所有已选中的单选按钮选项 (`input:checked`)
   - 收集所有文本输入框内容 (`input:text`)
   - 收集所有数字输入框内容 (`input[type=number]`)

2. **数据结构**：
   每个响应项包含以下字段：
   ```json
   {
     "name": "问题名称标识符",
     "value": "用户选择的值",
     "options": "可选项元数据",
     "text": "问题文本内容"
   }
   ```

## 数据保存流程

### 主要保存方式
1. **服务器保存**（优先）：
   - 通过 AJAX POST 请求发送到 `/save` 端点
   - 数据格式：`{'data': results}`
   - 成功后跳转到 `/next` 页面

2. **本地下载**（备用）：
   - 当服务器请求失败时，自动触发本地文件下载
   - 文件名：`willingly-approached-set-of-statistically-unlikely-pursuits-survey_result.json`
   - 文件格式：JSON格式的完整响应数据

### 数据内容
- 调查问卷共包含多个李克特量表题目
- 每题包含5个选项，从"NO CHANCE"到"Definitely WILL"
- 测量参与者设定不合理高目标的倾向性
- 评估对统计学上不太可能实现目标的意愿程度

## 技术实现
- 使用 jQuery 进行DOM操作和AJAX请求
- 使用HTML5 download属性实现本地文件下载
- 数据格式化为标准JSON结构便于后续分析