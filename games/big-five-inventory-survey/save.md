# Save Data Documentation - Big Five Inventory Survey

## 数据输出格式

### 基本信息
- **框架**: jQuery + 表单验证系统 + jQuery Wizard插件
- **输出格式**: JSON对象 (POST到/save端点)
- **配置文件**: `survey.tsv` 定义问题和选项
- **保存机制**: AJAX POST到/save端点
- **调查类型**: 大五人格量表 (Big Five Inventory, BFI-44)

## 保存流程

1. **表单数据收集**: jQuery Wizard收集所有页面响应
2. **数据验证**: 验证必填项和数据完整性
3. **数据序列化**: 转换为标准化JSON格式
4. **AJAX提交**: POST到/save端点保存数据

```javascript
// 数据保存流程示例
$( "#form" ).wizard( "form" ).submit(function( event ) {
    event.preventDefault();
    var formData = collectSurveyData();
    
    $.ajax({
        url: '/save',
        type: 'POST',
        data: formData,
        success: function(response) {
            console.log('Survey data saved successfully');
        },
        error: function(xhr, status, error) {
            console.error('Failed to save survey data:', error);
        }
    });
});

function collectSurveyData() {
    var surveyData = {};
    $('input[type="radio"]:checked').each(function() {
        var questionId = $(this).attr('name');
        var answerValue = $(this).val();
        surveyData[questionId] = parseInt(answerValue);
    });
    return surveyData;
}
```

## 数据结构

### 调查响应字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `question_id` | string | 问题标识符 (q1, q2, ..., q44) |
| `response_value` | number | 响应值 (1-5的Likert量表) |
| `page_number` | number | 问题所在页码 |
| `completion_time` | timestamp | 完成时间戳 |
| `total_duration` | number | 总完成时间 (毫秒) |

### Likert量表编码
- **1**: 非常不同意
- **2**: 有点不同意  
- **3**: 既不同意也不反对
- **4**: 有点同意
- **5**: 非常同意

注：部分题目采用反向计分，在数据分析时需要进行转换。

## 示例数据

### JSON格式输出示例

```json
{
  "survey_metadata": {
    "survey_type": "big_five_inventory",
    "version": "BFI-44",
    "completion_time": "2024-01-01T12:00:00Z",
    "total_duration": 420000,
    "participant_id": "sub_001"
  },
  "responses": {
    "q1": 4,
    "q2": 2,
    "q3": 5,
    "q4": 3,
    "q5": 4,
    "q6": 2,
    "q7": 4,
    "q8": 3,
    "q9": 5,
    "q10": 4,
    "q11": 2,
    "q12": 4,
    "q13": 5,
    "q14": 4,
    "q15": 2,
    "q16": 5,
    "q17": 3,
    "q18": 4,
    "q19": 5,
    "q20": 4,
    "q21": 2,
    "q22": 3,
    "q23": 5,
    "q24": 2,
    "q25": 4,
    "q26": 1,
    "q27": 4,
    "q28": 5,
    "q29": 4,
    "q30": 2,
    "q31": 5,
    "q32": 3,
    "q33": 4,
    "q34": 3,
    "q35": 5,
    "q36": 4,
    "q37": 4,
    "q38": 2,
    "q39": 5,
    "q40": 2,
    "q41": 4,
    "q42": 3,
    "q43": 4,
    "q44": 2
  },
  "big_five_scores": {
    "extraversion": {
      "raw_score": 32,
      "percentile": 75,
      "items": ["q1", "q6_r", "q11", "q16", "q21_r", "q26", "q31_r", "q36"],
      "reliability": 0.88
    },
    "agreeableness": {
      "raw_score": 35,
      "percentile": 82,
      "items": ["q2_r", "q7", "q12_r", "q17", "q22", "q27_r", "q32", "q37", "q42_r"],
      "reliability": 0.79
    },
    "conscientiousness": {
      "raw_score": 30,
      "percentile": 68,
      "items": ["q3", "q8_r", "q13", "q18", "q23_r", "q28", "q33", "q38", "q43_r"],
      "reliability": 0.82
    },
    "neuroticism": {
      "raw_score": 28,
      "percentile": 45,
      "items": ["q4", "q9_r", "q14", "q19", "q24_r", "q29", "q34", "q39_r"],
      "reliability": 0.84
    },
    "openness": {
      "raw_score": 36,
      "percentile": 85,
      "items": ["q5", "q10", "q15", "q20", "q25", "q30", "q35_r", "q40", "q41_r", "q44"],
      "reliability": 0.81
    }
  }
}
```

## 大五人格维度

### 外向性 (Extraversion)
**测量题目**: 1, 6(R), 11, 16, 21(R), 26, 31(R), 36
- **高分特征**: 外向、健谈、精力充沛、果断
- **低分特征**: 内向、安静、较为保守

### 宜人性 (Agreeableness)  
**测量题目**: 2(R), 7, 12(R), 17, 22, 27(R), 32, 37, 42(R)
- **高分特征**: 信任他人、乐于助人、合作
- **低分特征**: 多疑、不合作、对立

### 尽责性 (Conscientiousness)
**测量题目**: 3, 8(R), 13, 18, 23(R), 28, 33, 38, 43(R)  
- **高分特征**: 有组织、可靠、自律
- **低分特征**: 粗心、不可靠、懒散

### 神经质 (Neuroticism)
**测量题目**: 4, 9(R), 14, 19, 24(R), 29, 34, 39(R)
- **高分特征**: 焦虑、情绪不稳定、易怒
- **低分特征**: 冷静、情绪稳定、自信

### 开放性 (Openness to Experience)
**测量题目**: 5, 10, 15, 20, 25, 30, 35(R), 40, 41(R), 44
- **高分特征**: 富有想象力、好奇、开放
- **低分特征**: 传统、实际、保守

注：(R)表示反向计分题目

## 数据分析方法

### 计分方式

```r
# R代码示例 - 大五人格计分
# 反向计分题目
reverse_items <- c("q6", "q21", "q31", "q2", "q12", "q27", "q42", 
                   "q8", "q18", "q23", "q43", "q9", "q24", "q39", 
                   "q35", "q41")

# 反向计分转换 (6 - 原始分数)
data[reverse_items] <- 6 - data[reverse_items]

# 计算各维度得分
extraversion <- rowSums(data[c("q1", "q6", "q11", "q16", "q21", "q26", "q31", "q36")])
agreeableness <- rowSums(data[c("q2", "q7", "q12", "q17", "q22", "q27", "q32", "q37", "q42")])
conscientiousness <- rowSums(data[c("q3", "q8", "q13", "q18", "q23", "q28", "q33", "q38", "q43")])
neuroticism <- rowSums(data[c("q4", "q9", "q14", "q19", "q24", "q29", "q34", "q39")])
openness <- rowSums(data[c("q5", "q10", "q15", "q20", "q25", "q30", "q35", "q40", "q41", "q44")])

# 计算百分位数
percentiles <- data.frame(
  extraversion_pct = percent_rank(extraversion) * 100,
  agreeableness_pct = percent_rank(agreeableness) * 100,
  conscientiousness_pct = percent_rank(conscientiousness) * 100,
  neuroticism_pct = percent_rank(neuroticism) * 100,
  openness_pct = percent_rank(openness) * 100
)
```

### 心理测量学特性

**信度 (内部一致性)**
- 外向性: α = .88
- 宜人性: α = .79  
- 尽责性: α = .82
- 神经质: α = .84
- 开放性: α = .81

**效度**
- 构念效度: 五因素模型得到广泛验证
- 聚合效度: 与其他人格量表高度相关
- 区分效度: 五个维度相对独立

## 临床/研究应用

### 个性评估
- **人格剖析**: 全面的人格特质评估
- **职业咨询**: 个人-职业匹配分析
- **临床诊断**: 人格障碍筛查的辅助工具

### 心理健康相关
- **神经质**: 焦虑、抑郁风险评估
- **外向性**: 社交能力和社会适应评估  
- **尽责性**: 自我控制和目标导向行为

### 研究应用
- **个体差异研究**: 人格与行为关系
- **发展心理学**: 人格发展和稳定性
- **社会心理学**: 人格与人际关系

## 质量控制标准

### 数据完整性
- **完成率检查**: 所有44题必须完成
- **一致性检查**: 检测前后矛盾的响应模式
- **反应时间**: 过快或过慢的响应需要标记

### 响应质量
- **极端响应**: 过度使用极端选项(1或5)的模式
- **中间响应**: 过度选择中性选项(3)的趋势
- **直线响应**: 所有题目选择相同选项的无效响应

### 社会期望偏差
- **印象管理**: 检测过度积极的自我呈现
- **诚实度检查**: 与诚实-谦逊量表交叉验证

## 注意事项

1. **文化适应性**: 确保题目翻译的文化适宜性
2. **年龄适用性**: 适合16岁以上人群使用
3. **语言理解**: 确保参与者充分理解题目含义
4. **反向题目**: 正确处理反向计分题目
5. **规范样本**: 使用适当的规范样本进行比较
6. **隐私保护**: 保护个人人格信息的隐私

## 数据预处理建议

### 数据清洗
- **缺失值处理**: 采用量表内均值插补或删除缺失过多的案例
- **异常值检测**: 识别极端的人格得分
- **反向计分**: 自动化处理反向题目的计分转换

### 得分转换
- **原始分数**: 各维度题目得分相加
- **标准化**: 转换为T分数或百分位数
- **剖析报告**: 生成个性化的人格剖析图

### 信度分析
- **Cronbach's α**: 计算各维度的内部一致性
- **项目-总分相关**: 识别有问题的题目
- **因子分析**: 验证五因素结构

### 报告生成
- **个人报告**: 详细的人格特质描述
- **比较分析**: 与规范群体的比较
- **发展建议**: 基于人格特点的个人发展建议
- **职业建议**: 人格与职业匹配的推荐

### 后续应用
- **追踪研究**: 人格稳定性的纵向研究
- **干预评估**: 心理干预对人格的影响
- **选拔决策**: 人事选拔和职业规划的参考