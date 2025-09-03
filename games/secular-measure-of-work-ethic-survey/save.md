# Secular Measure of Work Ethic Survey - 数据保存机制

## 概述
世俗工作伦理量表是一个基于Web的心理测评问卷，用于测量个体对工作的态度、价值观和伦理观念。

## 数据保存方式

### 1. 问卷数据收集
- **框架**: jQuery Wizard + 传统HTML表单
- **数据结构**: JSON格式，包含每个问题的回答详情
- **调查标识**: `secular-measure-of-work-ethic-survey`

### 2. 数据保存流程

#### 表单提交处理
```javascript
// 收集所有输入数据
var $inputs = $("input:checked");
var $text = $("input:text");  
var $number = $("input[type = number]");
var $elements = $inputs.add($text).add($number);

// 构建结果数据
$elements.each(function(index, element) {
    result.name = $(element).attr("name");
    result.value = $(element).attr("value");
    result.options = $(element).attr("meta-options");
    result.text = $(element).attr("meta-text");
    results.push(result);
});
```

#### 数据保存机制
```javascript
$.ajax({
    type: 'POST',
    url: '/save',
    data: {'data': results},
    success: function() { document.location = '/next' },
    
    // 服务器不可用时本地下载
    error: function(err) {
        var data = "text/json;charset=utf-8," + JSON.stringify(results);
        var a = document.createElement('a');
        a.download = 'secular-measure-of-work-ethic-survey_result.json';
        a.href = 'data:' + data;
        a.click(); // 触发下载
    }
});
```

### 3. 保存的数据内容

#### 数据字段结构
每个回答记录包含：
- `name`: 问题字段名称（如：secular-measure-of-work-ethic-survey_2_options）
- `value`: 选择的数值（0-3，对应不同程度的同意度）
- `options`: 选项描述（"非常不同意: 0|不同意: 1|同意: 2|非常同意: 3"）
- `text`: 问题原文内容

#### 问卷内容概览
该量表包含10个核心工作伦理问题：
1. 工作完成本身的奖励价值
2. 诚信、勤奋、正直的重要性
3. 职业生涯的重要性
4. 工作与社会认知的关系
5. 工作的道德义务感
6. 对挑战的欢迎态度
7. 准时上班的重要性
8. 工作作为表达渠道
9. 工作与人生完美的关系
10. 工作的内在动机

### 4. 量表计分方式
- **计分范围**: 每题0-3分，总分0-30分
- **评分标准**: 
  - 0 = 非常不同意
  - 1 = 不同意  
  - 2 = 同意
  - 3 = 非常同意
- **高分解释**: 分数越高，表示工作伦理观念越强

### 5. 文件保存格式
- **本地保存**: `secular-measure-of-work-ethic-survey_result.json`
- **数据格式**: JSON数组，包含所有问题的详细回答
- **编码格式**: UTF-8

### 6. 问卷结构说明
- **总页数**: 5页（欢迎页 + 说明页 + 2页问题 + 完成页）
- **必答题**: 10题，全部为单选题
- **响应格式**: 4点李克特量表
- **完成时间**: 约3-5分钟

### 7. 使用说明
调查完成后，数据会自动尝试提交到服务器。如果服务器不可用，系统会自动生成JSON文件并提示用户下载。文件包含参与者对所有工作伦理相关问题的详细回答，可用于后续的心理学分析和研究。