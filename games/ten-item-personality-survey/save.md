# 十项人格调查 - 数据保存说明

## 调查概述
十项人格调查(Ten-Item Personality Survey, TIPI)是基于大五人格模型的简化版人格测评工具，通过10个项目快速评估个体在外向性、宜人性、尽责性、情绪稳定性和开放性五个人格维度上的特征。

## 数据保存机制

### 技术框架
- **前端技术**: HTML + jQuery + Material Design
- **数据处理**: jQuery Wizard插件
- **文件类型**: 基于表单的心理调查问卷

### 数据收集方式

#### 1. 表单数据收集
通过radio button收集7点李克特量表数据：
```javascript
var $inputs = $("input:checked");
var $text = $("input:text");
var $number = $("input[type = number]");
var $elements = $inputs.add($text).add($number);
```

#### 2. 关键数据字段
每个人格项目包含以下字段：
- **name**: 项目标识符(如"ten-item-personality-survey_3_options")
- **value**: 评分值(1-7的李克特量表，部分项目反向计分)
- **options**: 评分选项(如"强烈不同意|比较不同意|有点不同意|既不同意也不反对|有点同意|比较同意|强烈同意")
- **text**: 人格描述(如"外向的，热情的"、"挑剔的，好争论的")

### 人格维度测量

#### 1. 大五人格维度
**外向性 (Extraversion)**
- 正向项目: "外向的，热情的"
- 反向项目: "保守的，安静的"

**宜人性 (Agreeableness)**
- 正向项目: (无直接正向项目)
- 反向项目: "挑剔的，好争论的"

**尽责性 (Conscientiousness)**
- 正向项目: "可靠的，自律的"
- 反向项目: "杂乱无章的，粗心的"

**情绪稳定性 (Emotional Stability)**
- 正向项目: "冷静的，情绪稳定的"
- 反向项目: "焦虑的，容易心烦的"

**开放性 (Openness to Experience)**
- 正向项目: "乐于接受新体验的，复杂的"
- 反向项目: "传统的，缺乏创造性的"

#### 2. 计分方式
- **正向项目**: 原始分数(1-7)
- **反向项目**: 8减去原始分数实现反向计分
- **维度得分**: 相关两个项目分数的平均值

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
    a.download = 'ten-item-personality-survey_result.json';
    a.href = 'data:' + data;
    // 触发下载
}
```

### 数据输出格式

#### JSON结构示例
```json
[
    {
        "name": "ten-item-personality-survey_3_options",
        "value": "5",
        "options": "强烈不同意|比较不同意|有点不同意|既不同意也不反对|有点同意|比较同意|强烈同意",
        "text": "外向的，热情的。"
    },
    {
        "name": "ten-item-personality-survey_4_options",
        "value": "3",
        "options": "强烈不同意|比较不同意|有点不同意|既不同意也不反对|有点同意|比较同意|强烈同意", 
        "text": "挑剔的，好争论的。"
    }
]
```

### 心理测量指标

#### 1. 人格维度计算
**外向性**: (项目1 + 反向计分项目6) / 2
**宜人性**: (反向计分项目2 + 项目7) / 2  
**尽责性**: (项目3 + 反向计分项目8) / 2
**情绪稳定性**: (反向计分项目4 + 项目9) / 2
**开放性**: (项目5 + 反向计分项目10) / 2

#### 2. 反向计分处理
对于反向项目，计分公式为: 8 - 原始评分
- 原始评分7 → 反向得分1
- 原始评分1 → 反向得分7

#### 3. 人格特征解释
- **高外向性**: 社交活跃、精力充沛、积极乐观
- **高宜人性**: 合作友善、信任他人、乐于助人
- **高尽责性**: 有组织性、自律性强、目标导向
- **高情绪稳定性**: 情绪稳定、抗压能力强、不易焦虑
- **高开放性**: 好奇心强、创造性强、乐于接受新体验

## 注意事项

### 数据质量保证
1. **必填验证**: 所有人格项目必须评分
2. **红色标记**: 未回答项目以红色显示提醒  
3. **进度跟踪**: 可视化进度条显示完成状态

### 测量特点
1. **快速测评**: 仅10个项目，3-5分钟完成
2. **维度平衡**: 每个人格维度对应2个项目
3. **反向计分**: 控制反应偏见，提高测量质量

### 文件命名规范
- 服务器保存失败时自动下载为: `ten-item-personality-survey_result.json`
- 使用UTF-8编码确保中文字符正常显示

### 数据分析建议
1. 按人格维度计算得分(1-7范围)
2. 生成个体人格轮廓图
3. 与常模数据比较确定相对位置
4. 注意反向项目的正确计分处理