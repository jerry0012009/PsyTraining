# Save Data Documentation - Alcohol & Drugs Survey

## 数据输出格式

### 基本信息
- **框架**: jQuery + 表单验证系统
- **输出格式**: TSV (Tab-Separated Values) 格式数据
- **配置文件**: `survey.tsv` 定义问题和选项
- **保存机制**: 表单数据提交 + 可能的AJAX保存
- **调查类型**: 酒精和药物使用习惯调查

## 保存流程

1. **表单数据收集**: jQuery收集所有表单响应
2. **数据验证**: 验证必填项和数据格式
3. **数据序列化**: 转换为结构化格式
4. **提交保存**: 通过表单提交或AJAX保存

```javascript
// 数据收集示例
function collectSurveyData() {
    var surveyData = {};
    
    // 收集单选题响应
    $('input[type="radio"]:checked').each(function() {
        var questionId = $(this).attr('name');
        var answerValue = $(this).val();
        surveyData[questionId] = answerValue;
    });
    
    // 收集多选题响应
    $('input[type="checkbox"]:checked').each(function() {
        var questionId = $(this).attr('name');
        if (!surveyData[questionId]) {
            surveyData[questionId] = [];
        }
        surveyData[questionId].push($(this).val());
    });
    
    return surveyData;
}
```

## 数据结构

### 调查问题类型

| 问题类型 | 描述 | 数据格式 | 示例 |
|----------|------|----------|------|
| `radio` | 单选题 | 数值编码 | 1,2,3,4,5 |
| `checkbox` | 多选题 | 数值数组 | [1,3,5] |
| `instruction` | 指导文本 | 无数据 | - |

### 响应数据字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `question_id` | string | 问题标识符 (基于问题顺序) |
| `question_type` | string | 问题类型 ("radio"/"checkbox") |
| `response_value` | number/array | 响应值编码 |
| `response_text` | string | 响应文本内容 |
| `page_number` | number | 问题所在页码 |
| `completion_time` | number | 完成时间戳 |
| `is_required` | boolean | 是否为必填项 |

## 调查内容结构

### 烟草使用评估 (第3页)

**吸烟历史**
- 终生吸烟情况 (是/否)
- 吸烟持续时间 (不到1年到超过10年)
- 当前吸烟频率 (每天/有时/完全不吸)

**吸烟强度**
- 每日吸烟量 (支数)
- 晨起吸烟时间 (5分钟内到60分钟后)

**其他烟草产品**
- 多选题：嚼烟、雪茄、烟斗、鼻烟、电子烟等

### 酒精使用评估 (第4页)

**AUDIT量表 (Alcohol Use Disorders Identification Test)**

**饮酒频率和量度**
- 饮酒频率 (从不到每周4次或更多)
- 典型饮酒量 (1-2杯到10杯或更多)
- 大量饮酒频率 (从不到每天)

**问题饮酒指标**
- 无法控制饮酒
- 影响日常功能
- 晨起饮酒需求
- 饮酒后内疚
- 酒精相关失忆
- 酒精相关伤害
- 他人担心或建议

### 药物使用评估 (第5页及以后)

**大麻使用**
- 过去6个月使用情况
- 使用频率和量度

**其他药物**
- 处方药误用
- 非法药物使用
- 物质使用史

## 示例数据

### TSV格式输出示例

```tsv
question_id	question_type	response_value	response_text	page_number	timestamp
q3_1	radio	1	是	3	1640995200000
q3_2	radio	5	5-10年	3	1640995201000
q3_3	radio	3	每天	3	1640995202000
q3_4	radio	4	10-20支	3	1640995203000
q3_5	radio	2	6-30分钟	3	1640995204000
q3_6	checkbox	[1,5,7]	嚼烟,电子烟,小雪茄	3	1640995205000
q4_1	radio	3	每月2-4次	4	1640995210000
q4_2	radio	2	3或4杯	4	1640995211000
```

### JSON格式示例

```json
{
  "survey_metadata": {
    "completion_time": "2024-01-01T12:00:00Z",
    "total_pages": 6,
    "completion_duration": 480000
  },
  "tobacco_use": {
    "lifetime_smoking": {
      "question_id": "q3_1",
      "response_value": 1,
      "response_text": "是"
    },
    "smoking_duration": {
      "question_id": "q3_2", 
      "response_value": 5,
      "response_text": "5-10年"
    },
    "current_frequency": {
      "question_id": "q3_3",
      "response_value": 3,
      "response_text": "每天"
    },
    "daily_amount": {
      "question_id": "q3_4",
      "response_value": 4,
      "response_text": "10-20支"
    }
  },
  "alcohol_use": {
    "drinking_frequency": {
      "question_id": "q4_1",
      "response_value": 3,
      "response_text": "每月2-4次"
    },
    "typical_amount": {
      "question_id": "q4_2",
      "response_value": 2,
      "response_text": "3或4杯"
    },
    "audit_score": 8
  }
}
```

## 临床/研究应用

### 物质使用筛查
- **筛查阳性**: 识别有问题使用的个体
- **风险分层**: 低、中、高风险分组
- **干预建议**: 基于风险水平的干预推荐

### AUDIT评分系统
- **0-7分**: 低风险饮酒
- **8-15分**: 有害饮酒
- **16-19分**: 有害使用
- **20-40分**: 可能依赖

### 烟草依赖评估
- **Fagerström依赖指标**:
  - 每日吸烟量
  - 晨起吸烟时间
  - 戒断症状

### 多物质使用模式
- **共病模式**: 多种物质同时使用
- **替代模式**: 一种物质替代另一种
- **渐进模式**: 从软性到硬性物质

## 数据分析方法

### 描述性分析

```r
# R代码示例
# AUDIT总分计算
audit_items <- c("q4_1", "q4_2", "q4_3", "q4_4", "q4_5", 
                 "q4_6", "q4_7", "q4_8", "q4_9", "q4_10")
audit_total <- rowSums(data[audit_items] - 1)  # 调整为0起始

# 烟草依赖评分
fagerstrom_items <- c("q3_4", "q3_5")  # 每日吸烟量 + 晨起时间
fagerstrom_score <- calculate_fagerstrom(data[fagerstrom_items])

# 风险分层
risk_categories <- cut(audit_total, 
                      breaks = c(-1, 7, 15, 19, 40),
                      labels = c("低风险", "有害饮酒", "有害使用", "可能依赖"))
```

### 筛查阳性率
- **酒精**: AUDIT ≥ 8分的比例
- **烟草**: 每日吸烟者比例
- **大麻**: 过去6个月使用者比例

### 共病分析
- **物质间相关**: 不同物质使用的相关性
- **聚类分析**: 物质使用模式的聚类
- **潜在类别**: 使用者亚群识别

## 质量控制标准

### 数据完整性
- **必填项检查**: 所有必填问题都有响应
- **逻辑一致性**: 响应逻辑是否合理
- **跳题逻辑**: 跳题规则是否正确执行

### 响应质量
- **直线反应**: 避免所有问题选择相同选项
- **逻辑矛盾**: 识别前后不一致的回答
- **极端响应**: 过度选择极端选项

### 社会期望偏差
- **匿名保证**: 确保响应者了解匿名性
- **诚实指导**: 强调诚实回答的重要性
- **敏感性处理**: 对敏感问题的特殊处理

## 伦理和隐私考虑

### 数据保护
- **去标识化**: 移除个人身份信息
- **数据加密**: 敏感数据的加密存储
- **访问控制**: 限制数据访问权限

### 知情同意
- **同意表单**: 明确的参与同意
- **风险告知**: 说明数据使用风险
- **撤回权利**: 参与者撤回数据的权利

### 结果反馈
- **风险告知**: 高风险个体的告知义务
- **资源推荐**: 提供相关帮助资源
- **专业转介**: 必要时的专业转介

## 注意事项

1. **文化适应**: 问题表述的文化适宜性
2. **年龄适用**: 不同年龄群体的适用性
3. **语言理解**: 确保参与者理解问题含义
4. **隐私保护**: 保护敏感个人信息
5. **结果处理**: 高风险结果的处理流程
6. **法律合规**: 符合当地法律法规要求

## 数据预处理建议

### 数据清洗
- **缺失值处理**: 系统性缺失的处理方法
- **异常值检测**: 识别不合理的响应值
- **一致性检查**: 跨问题的逻辑一致性

### 得分计算
- **AUDIT评分**: 标准化的酒精问题评分
- **依赖指标**: 各种物质的依赖程度
- **风险分层**: 基于评分的风险分类

### 报告生成
- **个人报告**: 个体风险评估报告
- **群体报告**: 样本整体使用情况
- **比较分析**: 与规范样本的比较
- **趋势分析**: 时间序列的变化趋势

### 后续跟进
- **干预推荐**: 基于风险水平的干预建议
- **资源链接**: 相关帮助资源的链接
- **专业转介**: 高风险个体的专业转介流程