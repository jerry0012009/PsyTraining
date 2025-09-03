# Rosenberg Self-Esteem Survey 任务数据保存说明

## 任务概述
Rosenberg Self-Esteem Survey（罗森伯格自尊量表）是评估个体自尊水平的经典心理测量工具。量表包含10个项目，采用4点Likert量表，评估个体对自我价值和自我接受的总体感受。

## 数据保存机制

### 技术架构
- **界面框架**: Material Design Lite + jQuery
- **表单管理**: jQuery Wizard插件（多步骤表单）
- **数据验证**: jQuery Validate插件
- **进度显示**: jQuery UI Progressbar

### 量表设计

#### 量表结构
- **总项目数**: 10个自尊相关陈述
- **评分方式**: 4点Likert量表（0-3分）
- **计分方法**: 正向题直接计分，反向题反向计分
- **总分范围**: 0-30分（分数越高自尊水平越高）

#### 项目内容与计分
```javascript
// 正向计分项目（原值）
项目1: "总的来说，我对自己感到满意。"
项目3: "我觉得自己有很多优点。"
项目4: "我能够像大多数人一样把事情做好。"
项目7: "我觉得自己是一个有价值的人，至少与他人平等。"
项目10: "我对自己持积极的态度。"

// 反向计分项目（3-原值）
项目2: "有时我觉得自己一无是处。"
项目5: "我觉得自己没有什么值得骄傲的。"
项目6: "我有时确实感到没用。"
项目8: "我希望能更尊重自己。"
项目9: "总的来说，我倾向于认为自己是个失败者。"
```

### 保存的数据字段

#### 单项反应数据
```javascript
{
    name: "rosenberg-self-esteem-survey_X_options",  // 项目标识符
    value: "0|1|2|3",                                // 选择的数值
    options: "非常不同意: 0|不同意: 1|同意: 2|非常同意: 3",  // 选项标签
    text: "项目的具体文字内容"                        // 项目陈述
}
```

#### 选项标签系统
- **非常不同意**: 标签显示"0"，但实际计分根据项目性质决定
- **不同意**: 标签显示"1"，实际计分根据项目性质决定
- **同意**: 标签显示"2"，实际计分根据项目性质决定
- **非常同意**: 标签显示"3"，实际计分根据项目性质决定

### 反向计分机制

#### HTML实现的反向计分
```html
<!-- 反向计分项目示例：项目2 -->
<input type="radio" name="rosenberg-self-esteem-survey_3_options" 
       value="3" meta-text="有时我觉得自己一无是处。">
<span class="mdl-radio__label">非常不同意: 0</span>

<input type="radio" name="rosenberg-self-esteem-survey_3_options" 
       value="0" meta-text="有时我觉得自己一无是处。">
<span class="mdl-radio__label">非常同意: 3</span>
```

#### 计分逻辑
- **正向题**: value值直接对应标签值（0,1,2,3）
- **反向题**: value值与标签值相反（3,2,1,0）
- **显示标签**: 始终显示0-3的一致标签
- **实际得分**: 通过value值计算真实得分

### 界面交互控制

#### 多步骤表单流程
```javascript
$("#questions").wizard({
    stepsWrapper: "#wrapped",
    submit: ".submit",
    beforeForward: function(event, state) {
        // 页面验证逻辑
        if (state.stepIndex === 3) {
            // 验证第3页（项目1-6）所有必填项
        } else if (state.stepIndex === 4) {
            // 验证第4页（项目7-10）所有必填项
            expfactory_finished = true;
        }
    }
});
```

#### 进度条控制
```javascript
afterSelect: function(event, state) {
    $("#progressbar").progressbar("value", state.percentComplete);
    if (expfactory_finished == true) {
        $(".submit").enable();  // 启用提交按钮
    }
}
```

### 数据验证机制

#### 必填项验证
```javascript
// 检查每页必填项是否完成
function is_required(elements) {
    var missing = false;
    elements.each(function(index, element) {
        var pid = "#" + $(element).attr("name");
        $(pid).css("color", "red");  // 标红未完成项目
        missing = true;
    });
    if (missing == true) {
        alert("Please answer all required questions in red.");
    }
}
```

#### 页面完成检查
- **第3页验证**: 项目1-6必须全部选择
- **第4页验证**: 项目7-10必须全部选择
- **视觉反馈**: 未完成项目标题变红
- **阻止前进**: 未完成页面无法继续

### 数据传输机制

#### AJAX提交
```javascript
$.ajax({
    type: 'POST',
    url: '/save',
    data: {'data': results},
    success: function() {
        document.location = '/next';
    },
    error: function(err) {
        if (err.status == 200) {
            document.location = '/next';
        } else {
            // 本地下载备份
            var data = "text/json;charset=utf-8," + JSON.stringify(results);
            var a = document.createElement('a');
            a.download = 'rosenberg-self-esteem-survey_result.json';
            a.href = 'data:' + data;
        }
    }
});
```

#### 数据结构组装
```javascript
var results = [];
$elements.each(function(index, element) {
    var result = {
        name: $(element).attr("name"),           // 项目标识
        value: $(element).attr("value"),         // 选择值
        options: $(element).attr("meta-options"), // 选项信息
        text: $(element).attr("meta-text")       // 项目文本
    };
    results.push(result);
});
```

### 心理测量特性

#### 信效度特征
1. **内部一致性**: Cronbach's α通常在0.85-0.95之间
2. **重测信度**: 2-8周重测相关通常>0.80
3. **构念效度**: 与其他自尊量表高度相关
4. **区分效度**: 与抑郁、焦虑等负性情绪相关

#### 常模与解释
- **高自尊**: 总分≥26分
- **中等自尊**: 总分20-25分
- **低自尊**: 总分≤19分
- **临床关注**: 总分≤15分需要关注

### 自尊理论基础

#### 自尊的认知成分
1. **自我接受**: 对自身价值的积极评价
2. **自我效能**: 对自己能力的信心
3. **自我价值感**: 感受到自己的重要性
4. **比较自尊**: 相对于他人的自我评价

#### 自尊的情感成分
1. **自我满意**: 对自己的积极情感
2. **自我尊重**: 对自身的尊敬态度
3. **自豪感**: 对自己成就的积极情绪
4. **自我悦纳**: 对自身特征的接受

### 临床应用价值

#### 心理健康评估
- **抑郁症**: 低自尊是抑郁症的重要特征
- **焦虑障碍**: 自尊与社交焦虑密切相关
- **人格障碍**: 边缘性人格的自尊不稳定
- **自杀风险**: 极低自尊增加自杀风险

#### 发展心理学应用
- **青少年发展**: 自尊与身份认同发展
- **学业成就**: 学业自尊与学习动机
- **社会适应**: 自尊与人际关系质量
- **心理韧性**: 自尊作为保护性因子

### 数据分析指标

#### 基础统计指标
1. **总分计算**: 正向题+反向计分题之和
2. **项目分析**: 各项目得分分布和相关
3. **因子结构**: 探索性和验证性因子分析
4. **信度分析**: 内部一致性系数计算

#### 临床解释指标
1. **自尊水平分类**: 根据常模划分等级
2. **项目模式分析**: 识别特定的自尊问题
3. **变化评估**: 干预前后的自尊变化
4. **风险标识**: 极端低分的临床意义

### 数据导出格式
jQuery以JSON数组格式收集，包含：
- 每个项目的选择值和元数据
- 项目文本和选项标签信息
- 可计算总分和分项得分
- 支持心理测量学分析的完整数据

## 临床应用价值
Rosenberg自尊量表广泛应用于：
- **心理健康筛查**: 自尊水平评估和心理健康预测
- **临床诊断辅助**: 情绪障碍和人格障碍的评估
- **治疗效果评估**: 心理治疗前后自尊变化测量
- **发展心理研究**: 不同年龄阶段自尊发展轨迹
- **教育心理评估**: 学生自尊与学业成就关系研究

## 注意事项
- 确保被试理解各选项的含义差异
- 注意反向计分题目可能引起的混淆
- 考虑社会期望偏见对自我报告的影响
- 解释结果时需结合其他心理指标