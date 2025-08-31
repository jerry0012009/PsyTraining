# Save Data Documentation - Berlin Numeracy Test

## 数据输出格式

### 基本信息
- **框架**: jsPsych v6+ JavaScript框架
- **输出格式**: JSON数据
- **保存机制**: AJAX POST请求到 `/save` 端点
- **任务类型**: 柏林数字能力测试 (Berlin Numeracy Test)

## 保存流程

1. **服务器保存**: POST到 `/save` 端点
2. **错误处理**: 如果服务器响应失败，显示错误信息
3. **页面跳转**: 成功后跳转到 "/next"

```javascript
// 保存流程
const settings = {
    fullscreen: true,
    on_finish: function (data) {
        var promise = new Promise(function (resolve, reject) {
            var data = jsPsych.data.get().json();
            resolve(data);
        })
        promise.then(function (data) {
            sendResults(data);
        })
    }
}

async function sendResults(data) {
    $.ajax({
        type: "POST",
        url: '/save',
        data: { "data": data },
        success: function () { document.location = "/next" },
        dataType: "application/json",
        error: function (err) {
            if (err.status == 200) {
                document.location = "/next";
            } else {
                console.log("保存出现问题...");
            }
        }
    });
}
```

## 数据结构

### jsPsych v6标准字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `trial_type` | string | 试验类型 (如"html-button-response", "survey-text") |
| `trial_index` | number | 试验序号 |
| `time_elapsed` | number | 累计用时 (毫秒) |
| `internal_node_id` | string | jsPsych内部节点ID |
| `subject` | string | 被试ID |
| `rt` | number | 反应时间 (毫秒) |
| `response` | number/string | 响应内容 |
| `stimulus` | string | 刺激HTML内容 |
| `button_pressed` | number | 按下的按钮编号 |

### 柏林数字能力测试特定字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `question_order` | number | 题目序号 |
| `question_id` | string | 题目标识符 |
| `question_text` | string | 题目内容 |
| `correct_answer` | number/string | 正确答案 |
| `user_answer` | number/string | 用户答案 |
| `is_correct` | boolean | 是否回答正确 |
| `difficulty_level` | string | 题目难度 ("easy"/"medium"/"hard") |
| `numeracy_score` | number | 数字能力得分 |
| `completion_time` | number | 完成时间 |
| `adaptive_termination` | boolean | 是否自适应终止 |

## 柏林数字能力测试设计

### 测试原理
- **自适应测试**: 根据答题表现调整后续题目难度
- **概率推理**: 评估在不确定情境下的数字推理能力
- **风险理解**: 测量对统计风险信息的理解能力

### 题目类型

**基础概率题**
- **内容**: 简单的百分比和分数转换
- **例题**: "10个人中有多少人..."
- **难度**: 容易

**条件概率题**
- **内容**: 涉及贝叶斯推理的概率问题
- **例题**: 医学诊断的假阳性问题
- **难度**: 中等到困难

**风险推理题**
- **内容**: 复杂的风险评估和比较
- **例题**: 医学治疗风险的比较
- **难度**: 困难

### 自适应算法
1. **起始题目**: 从中等难度开始
2. **动态调整**: 根据正确率调整难度
3. **终止条件**: 达到预设精度或最大题目数
4. **能力估计**: 使用项目反应理论估计能力

## 示例数据

### JSON格式示例

```json
[
  {
    "trial_type": "html-button-response",
    "trial_index": 0,
    "time_elapsed": 15420,
    "rt": 8750,
    "response": 0,
    "button_pressed": 0,
    "question_id": "BNT_01",
    "question_text": "在1000人中，有1人患有某种疾病...",
    "correct_answer": "9",
    "user_answer": "9", 
    "is_correct": true,
    "difficulty_level": "easy",
    "numeracy_score": 1
  },
  {
    "trial_type": "html-button-response", 
    "trial_index": 1,
    "time_elapsed": 28630,
    "rt": 13210,
    "response": 2,
    "button_pressed": 2,
    "question_id": "BNT_05",
    "question_text": "某种药物对80%的病人有效...",
    "correct_answer": "16",
    "user_answer": "25",
    "is_correct": false,
    "difficulty_level": "medium", 
    "numeracy_score": 1
  }
]
```

## 认知指标评估

### 数字能力维度

**基础计算能力**
- **测量**: 简单算术和百分比计算
- **指标**: 基础题目正确率
- **范围**: 0-100%

**概率推理能力**
- **测量**: 概率概念的理解和应用
- **指标**: 概率题目正确率
- **认知**: 统计思维能力

**风险理解能力**
- **测量**: 复杂风险信息的解释
- **指标**: 风险题目正确率  
- **应用**: 医学决策、金融决策

### 自适应能力估计
- **最大似然估计**: 基于项目反应理论的能力估计
- **95%置信区间**: 能力估计的不确定性
- **测量精度**: 估计误差的大小

## 临床/研究应用

### 认知评估
- **执行功能**: 复杂数字推理的执行能力
- **工作记忆**: 多步骤计算的记忆负荷
- **抽象推理**: 概率概念的抽象理解

### 健康素养评估
- **医学决策**: 理解医学风险信息的能力
- **预防行为**: 基于风险信息的行为决策
- **治疗依从**: 对治疗风险收益的理解

### 金融素养评估
- **投资决策**: 理解金融风险的能力
- **保险选择**: 概率风险的评估能力
- **理财规划**: 长期概率预期的规划能力

## 数字能力等级

### 能力分级

| 等级 | 得分范围 | 能力描述 | 应用能力 |
|------|----------|----------|----------|
| **低** | 0-2分 | 基础计算困难 | 简单百分比理解 |
| **中低** | 3-4分 | 基础计算良好 | 简单风险信息理解 |
| **中等** | 5-6分 | 概率推理入门 | 医学风险基本理解 |
| **中高** | 7-8分 | 概率推理良好 | 复杂风险信息处理 |
| **高** | 9-10分 | 高级统计推理 | 复杂决策支持 |

### 人群分布
- **一般人群**: 平均得分4-5分
- **高等教育**: 平均得分6-7分  
- **STEM背景**: 平均得分7-8分
- **统计专业**: 平均得分8-9分

## 数据分析方法

### 基础指标计算

```r
# R代码示例
# 总得分
total_score <- sum(data$is_correct)

# 各难度水平表现
easy_score <- sum(data$is_correct[data$difficulty_level == "easy"])
medium_score <- sum(data$is_correct[data$difficulty_level == "medium"])  
hard_score <- sum(data$is_correct[data$difficulty_level == "hard"])

# 反应时间分析
avg_rt <- mean(data$rt[data$is_correct == TRUE])
rt_by_difficulty <- aggregate(rt ~ difficulty_level, data, mean)
```

### 项目分析
- **项目难度**: 各题目的通过率
- **项目区分度**: 高低分组的差异
- **项目-总分相关**: 各题与总分的相关

### 能力估计
- **经典测验理论**: 简单的正确题目计数
- **项目反应理论**: 考虑题目难度的能力估计
- **贝叶斯估计**: 结合先验信息的能力估计

## 质量控制标准

### 数据有效性
- **完成度**: 完成至少3题以上
- **反应时间**: 每题至少5秒以上思考时间
- **随机作答**: 避免明显的随机选择模式
- **自适应终止**: 确认是否正常终止

### 测试环境
- **全屏模式**: 确保专注的测试环境
- **安静环境**: 避免外界干扰
- **设备稳定**: 确保网络和设备稳定性

## 注意事项

1. **语言理解**: 确保参与者理解题目的中文表述
2. **数学背景**: 了解参与者的数学教育背景
3. **文化适应**: 考虑文化背景对概率理解的影响
4. **时间压力**: 不设时间限制，允许充分思考
5. **动机维持**: 说明测试的重要性以维持动机
6. **反馈处理**: 决定是否提供即时正误反馈

## 数据预处理建议

### 异常检测
- **过短反应时间**: < 3秒可能为随机作答
- **过长反应时间**: > 300秒可能为注意分散
- **答题模式**: 识别明显的猜测模式

### 能力估计优化
- **起始能力**: 根据教育背景设定起始估计
- **终止精度**: 平衡测试长度和精度要求
- **能力范围**: 设定合理的能力估计范围

### 报告建议
- **得分报告**: 总分和各难度水平得分
- **能力等级**: 根据得分确定能力等级
- **信心区间**: 提供能力估计的不确定性
- **个性化反馈**: 基于表现提供学习建议

### 与其他测试的关联
- **认知能力**: 与智力测试的相关分析
- **学业成就**: 与数学成绩的相关
- **专业表现**: 与相关专业能力的预测效度
- **决策质量**: 与实际决策表现的关联