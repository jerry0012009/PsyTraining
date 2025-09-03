# Selection-Optimization-Compensation Survey - 数据保存机制

## 概述
选择-优化-补偿量表(SOC)是一个基于Web的心理测评问卷，用于测量个体在资源受限情况下如何管理目标和任务的策略模式。该量表基于Baltes & Baltes (1990)的SOC理论模型。

## 数据保存方式

### 1. 问卷数据收集
- **框架**: jQuery Wizard + 传统HTML表单
- **数据结构**: JSON格式，包含每个问题的回答详情
- **调查标识**: `selection-optimization-compensation-survey`

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
        a.download = 'selection-optimization-compensation-survey_result.json';
        a.href = 'data:' + data;
        a.click(); // 触发下载
    }
});
```

### 3. 保存的数据内容

#### 数据字段结构
每个回答记录包含：
- `name`: 问题字段名称（如：selection-optimization-compensation-survey_4_options）
- `value`: 选择的数值（0或1，表示选择的陈述）
- `options`: 两个选项描述
- `text`: 问题原文内容

#### SOC量表维度
该量表测量四个核心维度：

**1. 选择性选择 (Elective Selection - 12题)**
- 目标聚焦与优先级设定
- 专注少数重要目标的能力
- 避免目标分散的策略

**2. 基于损失的选择 (Loss-based Selection - 12题)**  
- 面对资源减少时的目标调整
- 放弃次要目标的能力
- 重新聚焦核心目标的策略

**3. 优化 (Optimization - 24题)**
- 目标达成的方法和手段
- 资源配置的优化策略
- 技能和能力的最大化利用

**4. 补偿 (Compensation - 24题)**
- 面对能力下降时的替代策略
- 寻求外部帮助和支持
- 使用辅助手段和工具

### 4. 量表计分方式
- **计分范围**: 每题0-1分，总分0-72分
- **各维度计分**:
  - 选择性选择：0-12分
  - 基于损失的选择：0-12分
  - 优化：0-24分  
  - 补偿：0-24分
- **高分解释**: 分数越高，表示该策略使用频率越高

### 5. 问卷特点
- **题目类型**: 强迫选择题（二选一）
- **总题量**: 72题
- **测量对象**: 成年人目标管理策略
- **理论基础**: SOC成功老化理论模型

### 6. 文件保存格式
- **本地保存**: `selection-optimization-compensation-survey_result.json`
- **数据格式**: JSON数组，包含所有问题的详细回答
- **编码格式**: UTF-8

### 7. 问卷结构说明
- **总页数**: 7页（欢迎页 + 说明页 + 4页问题 + 完成页）
- **必答题**: 72题，全部为二选一题型
- **页面分布**: 
  - 第3页：12题（选择性选择）
  - 第4页：12题（基于损失的选择）
  - 第5页：24题（优化）
  - 第6页：24题（补偿）
- **完成时间**: 约10-15分钟

### 8. 使用说明
调查完成后，数据会自动尝试提交到服务器。如果服务器不可用，系统会自动生成JSON文件并提示用户下载。该量表可用于评估个体在面对资源限制时的适应策略模式，在发展心理学、老年心理学和积极心理学研究中具有重要应用价值。