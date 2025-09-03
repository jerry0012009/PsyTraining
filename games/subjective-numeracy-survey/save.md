# 主观数字能力调查 - 数据保存说明

## 调查概述
主观数字能力调查(Subjective Numeracy Survey)是一项心理测量工具，用于评估个体对自己数学和数字处理能力的主观认知水平，涉及分数、百分比、概率理解等多个维度。

## 数据保存机制

### 技术框架
- **前端技术**: HTML + jQuery + Material Design
- **数据处理**: jQuery Wizard插件
- **文件类型**: 基于表单的调查问卷

### 数据收集方式

#### 1. 表单数据收集
通过radio button收集李克特量表数据：
```javascript
var $inputs = $("input:checked");
var $text = $("input:text");
var $number = $("input[type = number]");
var $elements = $inputs.add($text).add($number);
```

#### 2. 关键数据字段
每个问题包含以下字段：
- **name**: 问题标识符(如"subjective-numeracy-survey_2_options")
- **value**: 选择的数值(1-6的李克特量表)
- **options**: 选项描述(如"完全不擅长: 1|2|3|4|5|非常擅长: 6")
- **text**: 问题文本(如"您在处理分数方面的能力如何？")

#### 3. 调查内容维度
1. **数字处理能力**
   - 分数处理能力
   - 百分比理解能力
   - 实际计算能力(15%小费、75折计算)

2. **数字信息偏好**
   - 图表和表格的有用性感知
   - 数字vs文字表述偏好
   - 百分比vs文字预测偏好
   - 数值信息使用频率

### 数据保存流程

#### 1. 数据预处理
```javascript
var results = [];
$elements.each(function(index, element) {
    var result = {
        name: $(element).attr("name"),
        value: $(element).attr("value") || $(element).val(),
        options: $(element).attr("meta-options"),
        text: $(element).attr("meta-text")
    };
    results.push(result);
});
```

#### 2. 保存尝试机制
**主要保存方式** - POST到服务器：
```javascript
$.ajax({
    type: 'POST',
    url: '/save',
    data: {'data': results},
    success: function() {
        console.log('success');
        document.location = '/next';
    }
});
```

**备用保存方式** - 本地文件下载：
```javascript
error: function(err) {
    console.log("Error with POST" + err.status + ", downloading to local file.");
    var data = "text/json;charset=utf-8," + JSON.stringify(results);
    var a = document.createElement('a');
    a.download = '主观数字能力调查_结果.json';
    a.href = 'data:' + data;
    // 触发下载
}
```

### 数据输出格式

#### JSON结构示例
```json
[
    {
        "name": "subjective-numeracy-survey_2_options",
        "value": "4",
        "options": "完全不擅长: 1|2|3|4|5|非常擅长: 6",
        "text": "您在处理分数方面的能力如何？"
    },
    {
        "name": "subjective-numeracy-survey_3_options", 
        "value": "5",
        "options": "完全不擅长: 1|2|3|4|5|非常擅长: 6",
        "text": "您在处理百分比方面的能力如何？"
    }
]
```

### 心理测量指标

#### 1. 主观数字能力评估
- **能力感知**: 个体对数字处理技能的自我评估
- **信心水平**: 对数字相关任务的信心程度
- **应用倾向**: 在决策中使用数字信息的偏好

#### 2. 认知风格测量
- **分析性思维**: 偏好数字vs直觉判断
- **信息处理偏好**: 定量vs定性信息使用倾向

## 注意事项

### 数据质量保证
1. **必填验证**: 所有问题必须回答才能提交
2. **红色标记**: 未回答问题以红色显示提醒
3. **进度跟踪**: 可视化进度条显示完成状态

### 文件命名规范
- 服务器保存失败时自动下载为: `主观数字能力调查_结果.json`
- 使用UTF-8编码确保中文字符正常显示

### 数据分析建议
1. 计算各维度的平均得分
2. 分析数字偏好与实际能力的关系
3. 评估自信程度与任务表现的一致性
4. 识别数字焦虑或数字回避倾向