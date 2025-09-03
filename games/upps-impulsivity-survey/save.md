# UPPS-P Impulsivity Scale Survey - 数据保存方式

## 游戏简介
UPPS-P冲动性量表调查是一个心理学问卷调查，用于评估个体在不同情境下的冲动性行为倾向。

## 数据保存机制

### 1. 主要保存方式
- **方法**: AJAX POST 请求
- **目标端点**: `/save`
- **数据格式**: JSON数组，包含所有问卷回答

### 2. 备用保存方式
当服务器端点不可用时，系统会自动启用本地下载保存：
- **触发条件**: AJAX请求失败（非200状态码）
- **保存方式**: 浏览器下载JSON文件
- **文件名**: `upps-impulsivity-survey_result.json`
- **数据类型**: `text/json;charset=utf-8`

## 数据结构

每个回答记录包含以下字段：

```json
{
  "name": "问题标识符",
  "value": "选择的数值",
  "options": "所有可选项",  
  "text": "问题文本内容"
}
```

### 示例数据
```json
[
  {
    "name": "upps-impulsivity-survey_2_options",
    "value": "3",
    "options": "Agree Strongly|Agree Some|Disagree Some|Disagree Strongly",
    "text": "I have a reserved and cautious attitude toward life."
  },
  {
    "name": "upps-impulsivity-survey_3_options", 
    "value": "2",
    "options": "Agree Strongly|Agree Some|Disagree Some|Disagree Strongly",
    "text": "I have trouble controlling my impulses."
  }
]
```

## 数据收集范围

系统收集以下类型的用户输入：
- 单选按钮选择（:checked状态的input）
- 文本输入框内容（input:text）
- 数字输入框内容（input[type=number]）

## 技术实现细节

### 数据收集代码位置
- **文件**: `index.html`
- **行数**: 1127-1148行（数据准备）
- **行数**: 1151-1186行（保存逻辑）

### 关键功能
1. **表单验证**: 确保所有必填项都已完成
2. **数据过滤**: 排除系统控制字段（forward, backward, process）
3. **错误处理**: 服务器不可用时自动切换到本地保存
4. **用户反馈**: 保存成功后跳转到下一页面

## 使用说明

1. **正常流程**: 用户完成问卷后点击提交，数据通过AJAX发送到服务器
2. **离线模式**: 如果服务器不可用，系统会提供"Download"按钮供用户下载结果文件
3. **数据完整性**: 系统确保所有必填项都有回答后才允许提交

## 注意事项

- 数据保存前会进行完整性验证
- 本地保存的JSON文件可以直接用于数据分析
- 所有问卷回答都会被记录，包括问题文本和选项信息
- 系统支持中文界面，问题文本已本地化