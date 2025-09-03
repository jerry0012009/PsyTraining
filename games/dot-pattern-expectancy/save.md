# 点模式期待任务 - 数据保存机制

## 概述
点模式期待任务（Dot Pattern Expectancy）是基于AX-CPT（AX Continuous Performance Test）范式的认知控制实验，用于测量工作记忆、认知灵活性和上下文处理能力。该任务最初由Cohen等人在1999年开发，通过测量参与者对不同线索-探测刺激组合的反应模式，评估前额叶认知控制功能和上下文维持能力，为研究执行功能障碍、精神分裂症和注意缺陷提供重要的实验工具。

## 数据保存机制

### 保存位置和方式
- **主要方式**: AJAX POST请求到服务器端点 `/save`
- **备用方式**: 当服务器不可用时，自动下载CSV文件到本地
- **文件格式**: JSON格式（服务器）或CSV格式（本地）
- **文件名**: `dot-pattern-expectancy_results.csv`

### 数据保存流程
1. 使用jsPsych框架管理整个实验流程和数据收集
2. 每个试次包含线索-探测序列，分别记录反应数据
3. 实验结束时序列化所有数据为JSON格式
4. 优先通过AJAX POST发送到服务器
5. 服务器不可用时触发本地CSV文件下载

### jsPsych数据结构
```javascript
{
  "rt": 723,                              // 反应时间(毫秒)
  "stimulus": "<div class = centerbox><div class = img-container><img src = \"images/probe1.png\"></img></div></div>", // 呈现的刺激
  "key_press": 37,                        // 按键响应(37=左箭头, 40=下箭头, -1=无反应)
  "correct": true,                        // 反应正确性
  "trial_type": "poldrack-single-stim",   // 试次类型
  "trial_index": 156,                     // 试次索引
  "time_elapsed": 45680,                  // 实验开始以来的总时间
  "internal_node_id": "0.0.4.3",         // jsPsych内部节点ID
  "trial_id": "probe",                    // 试次标识(cue/probe/fixation/feedback)
  "exp_stage": "test",                    // 实验阶段(practice/test)
  "condition": "AX",                      // 条件类型(AX/AY/BX/BY)
  "trial_num": 76,                        // 试次编号
  "possible_responses": [37, 40],         // 可能的反应按键
  "timing_stim": 500,                     // 刺激呈现时间
  "timing_response": 1500,                // 反应窗口时间
  "credit_var": true                      // 任务完成质量评估
}
```

## 实验设计与刺激

### AX-CPT范式原理
该任务基于线索-探测序列设计，包含四种基本条件：

1. **AX条件（目标序列，70%）**:
   - **线索**: 特定的蓝色圆点图案（A线索）
   - **探测**: 特定的黑色圆点图案（X探测）
   - **正确反应**: 左箭头键
   - **认知过程**: 工作记忆维持和目标检测

2. **AY条件（线索有效，探测无关，10%）**:
   - **线索**: A线索（有效线索）
   - **探测**: 非X探测（Y探测）
   - **正确反应**: 下箭头键
   - **认知过程**: 抑制优势反应，认知灵活性

3. **BX条件（线索无关，探测目标，10%）**:
   - **线索**: 非A线索（B线索）
   - **探测**: X探测（目标探测）
   - **正确反应**: 下箭头键
   - **认知过程**: 上下文处理和工作记忆更新

4. **BY条件（控制条件，10%）**:
   - **线索**: B线索（无关线索）
   - **探测**: Y探测（无关探测）
   - **正确反应**: 下箭头键
   - **认知过程**: 基线反应控制

### 刺激参数 (`experiment.js:124-149`):
- **线索刺激**: 6种蓝色圆点图案，1种为A线索，5种为B线索
- **探测刺激**: 6种黑色圆点图案，1种为X探测，5种为Y探测
- **试次比例**: AX(70%) : AY(10%) : BX(10%) : BY(10%)
- **图像预加载**: 所有刺激图像在实验开始前预加载

### 实验结构:
1. **指导阶段**: 详细说明线索-探测规则和反应要求
2. **练习阶段**: 32个试次，包含反馈学习
3. **正式测试**: 4个区块，每区块32个试次，共128个试次
4. **休息间隔**: 各区块间提供休息时间
5. **后测问卷**: 收集策略使用和主观体验

### 试次时间流程:
- 注视点: 2000ms
- 线索呈现: 500ms
- 线索后固视点: 2000ms
- 探测呈现: 500ms
- 反应窗口: 1500ms
- 反馈呈现: 1000ms（仅练习阶段）

## 数据保存实现代码

**实验初始化和数据收集** (`index.html:30-36`):
```javascript
jsPsych.init({
    timeline: dot_pattern_expectancy_experiment,
    display_element: "getDisplayElement",
    fullscreen: true,
    on_trial_finish: function(data){
        addID('dot-pattern-expectancy')  // 添加实验标识符
    }
})
```

**实验结束数据保存** (`index.html:38-68`):
```javascript
on_finish: function(data){
    // 序列化数据
    var promise = new Promise(function(resolve, reject) {
        var data = jsPsych.data.dataAsJSON();
        resolve(data);
    })
    
    promise.then(function(data) {
        $.ajax({
            type: "POST",
            url: '/save',
            data: { "data": data },
            success: function(){ document.location = "/next" },
            dataType: "application/json",
            
            // 端点不可用，本地保存
            error: function(err) {
                if (err.status == 200){
                    document.location = "/next";
                } else {
                    // 如果错误，假设本地保存
                    jsPsych.data.localSave('dot-pattern-expectancy_results.csv', 'csv');
                }
            }
        });
    })
}
```

**反馈计算逻辑** (`experiment.js:76-97`):
```javascript
var getFeedback = function() {
  var curr_trial = jsPsych.progress().current_trial_global
  var curr_data = jsPsych.data.getData()[curr_trial - 1]
  var condition = curr_data.condition
  var response = curr_data.key_press
  var feedback_text = ''
  var correct = -1
  
  if (response == -1) {
    feedback_text = '<div class = centerbox><div class = center-text>请反应快一点！</p></div>'
  } else if (condition == "AX" && response == 37) {
    feedback_text = '<div class = centerbox><div style="color:green"; class = center-text>正确！</div></div>'
    correct = true
  } else if (condition != "AX" && response == 40) {
    feedback_text = '<div class = centerbox><div style="color:green"; class = center-text>正确！</div></div>'
    correct = true
  } else {
    feedback_text = '<div class = centerbox><div style="color:red"; class = center-text>错误</div></div>'
    correct = false
  }
  
  jsPsych.data.addDataToLastTrial({'correct': correct})
  return feedback_text
}
```

## 核心认知测量

### 1. 工作记忆维持
- **定义**: 在延迟期间保持线索信息的能力
- **测量**: AX条件的准确率和反应时间
- **计算**: AX_Accuracy = (AX正确数 / AX总试次) × 100%
- **意义**: 反映前额叶工作记忆容量和维持功能

### 2. 认知灵活性
- **定义**: 根据上下文灵活调整反应的能力  
- **测量**: AY条件的错误率（假阳性）
- **计算**: AY_Error_Rate = (AY错误数 / AY总试次) × 100%
- **意义**: 高错误率表明过度依赖线索预期，缺乏灵活性

### 3. 上下文处理
- **定义**: 利用上下文信息指导行为的能力
- **测量**: BX条件的错误率（假阴性）
- **计算**: BX_Error_Rate = (BX错误数 / BX总试次) × 100%
- **意义**: 高错误率表明上下文处理缺陷

### 4. 期待偏向指数
- **定义**: 对AX序列的期待程度
- **计算**: d'-context = Z(AX_Hit_Rate) - Z(BX_False_Alarm_Rate)
- **解释**: 越高表示对目标序列的敏感性越好

### 5. 反应偏向指数
- **定义**: 总体反应倾向的保守性
- **计算**: Response_Bias = -0.5 × [Z(AX_Hit_Rate) + Z(BX_False_Alarm_Rate)]
- **解释**: 正值表示保守倾向，负值表示自由倾向

## 认知神经科学基础

### 1. 前额叶皮层功能
- **背外侧前额叶(DLPFC)**: 工作记忆维持和认知控制
- **腹外侧前额叶(VLPFC)**: 反应抑制和认知灵活性
- **前扣带皮层(ACC)**: 冲突监测和错误检测
- **眶额皮层(OFC)**: 期待生成和价值评估

### 2. 网络连接模式
- **中央执行网络**: 支持工作记忆和认知控制
- **突显网络**: 检测重要信息和转换注意
- **默认模式网络**: 内部导向处理和期待生成
- **背侧注意网络**: 自上而下的注意控制

### 3. 神经调质系统
- **多巴胺系统**: 期待信号和奖赏预测
- **胆碱能系统**: 注意调节和上下文处理
- **去甲肾上腺素系统**: 觉醒水平和认知灵活性
- **GABA系统**: 抑制控制和神经振荡

## 数据质量控制

### 性能评估函数 (`experiment.js:19-61`):
```javascript
function assessPerformance() {
    var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
    var missed_count = 0
    var trial_count = 0
    var rt_array = []
    
    // 记录参与者的选择
    var choice_counts = {}
    choice_counts[-1] = 0
    for (var k = 0; k < choices.length; k++) {
        choice_counts[choices[k]] = 0
    }
    
    for (var i = 0; i < experiment_data.length; i++) {
        if (experiment_data[i].possible_responses != 'none') {
            trial_count += 1
            rt = experiment_data[i].rt
            key = experiment_data[i].key_press
            choice_counts[key] += 1
            if (rt == -1) {
                missed_count += 1
            } else {
                rt_array.push(rt)
            }
        }
    }
    
    // 计算平均反应时间
    var avg_rt = -1
    if (rt_array.length !== 0) {
        avg_rt = math.median(rt_array)
    }
    
    // 检查反应分布是否合理
    var responses_ok = true
    Object.keys(choice_counts).forEach(function(key, index) {
        if (choice_counts[key] > trial_count * 0.9) {
            responses_ok = false
        }
    })
    
    var missed_percent = missed_count/trial_count
    
    // 质量控制标准
    credit_var = (missed_percent < 0.4 && avg_rt > 200 && responses_ok)
    jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
}
```

### 数据质量标准:
1. **遗漏率控制**: 遗漏试次比例 < 40%
2. **反应时间过滤**: 反应时间 > 200ms
3. **反应分布检查**: 避免单一按键反应 > 90%
4. **注意力检查**: 可选的注意力检查试次

## 临床应用价值

### 1. 精神分裂症研究
- **工作记忆缺陷**: AX条件表现下降
- **上下文处理异常**: BX条件错误率升高
- **认知灵活性受损**: AY条件错误率升高
- **药物治疗监测**: 抗精神病药物对认知功能的影响

### 2. ADHD评估
- **注意维持困难**: AX条件反应时间变异性增大
- **冲动控制问题**: AY条件错误率升高
- **工作记忆缺陷**: 整体准确率下降
- **兴奋剂疗效**: 药物对执行控制的改善

### 3. 老年认知评估
- **工作记忆衰退**: AX条件表现随年龄下降
- **认知灵活性下降**: AY和BX条件错误增加
- **痴呆风险评估**: 认知控制缺陷的早期指标
- **认知训练效果**: 干预前后的变化测量

### 4. 其他临床应用
- **双相情感障碍**: 情绪发作期的认知控制变化
- **强迫症**: 认知灵活性和错误监测异常
- **创伤后应激障碍**: 注意偏向和认知控制受损
- **物质依赖**: 执行控制和冲动控制缺陷

## 实验参数设置

### 刺激设计 (`experiment.js:141-149`):
```javascript
var trial_proportions = ["AX", "AX", "AX", "AX", "AX", "AX", "AX", "AX", "AX", "AX", "AX", "BX", "BX", "AY", "AY", "BY"]
var practice_block = jsPsych.randomization.repeat(trial_proportions, 2)  // 32试次
var block1_list = jsPsych.randomization.repeat(trial_proportions, 2)     // 32试次
var block2_list = jsPsych.randomization.repeat(trial_proportions, 2)     // 32试次  
var block3_list = jsPsych.randomization.repeat(trial_proportions, 2)     // 32试次
var block4_list = jsPsych.randomization.repeat(trial_proportions, 2)     // 32试次
```

### 时间参数:
- **线索呈现**: 500ms
- **线索后延迟**: 2000ms固视点
- **探测呈现**: 500ms
- **反应窗口**: 1500ms
- **反馈时间**: 1000ms（练习阶段）
- **区块间休息**: 自定义时长

### 试次分布:
- **练习阶段**: 32试次（22个AX + 4个BX + 4个AY + 2个BY）
- **测试阶段**: 128试次（88个AX + 16个BX + 16个AY + 8个BY）
- **总计**: 160试次

## 数据分析方法

### 1. 基础表现指标
```javascript
// 各条件的基本统计
AX_Accuracy = AX_Correct / AX_Total
AY_Accuracy = AY_Correct / AY_Total  
BX_Accuracy = BX_Correct / BX_Total
BY_Accuracy = BY_Correct / BY_Total

AX_RT = mean(AX_Correct_RTs)
AY_RT = mean(AY_Correct_RTs)
BX_RT = mean(BX_Correct_RTs) 
BY_RT = mean(BY_Correct_RTs)
```

### 2. 高阶认知指标
```javascript
// 工作记忆维持指数
WM_Maintenance = AX_Accuracy - BY_Accuracy

// 认知灵活性指数  
Cognitive_Flexibility = AY_Accuracy - BY_Accuracy

// 上下文处理指数
Context_Processing = BX_Accuracy - BY_Accuracy

// 期待偏向强度
Expectancy_Bias = (AX_RT - AY_RT) / (AX_RT + AY_RT)
```

### 3. 信号检测分析
```javascript
// 将AX作为信号，其他作为噪音
Hit_Rate = AX_Correct / AX_Total
False_Alarm_Rate = (AY_Errors + BX_Errors + BY_Errors) / (AY_Total + BX_Total + BY_Total)

d_prime = Z(Hit_Rate) - Z(False_Alarm_Rate)
criterion = -0.5 * (Z(Hit_Rate) + Z(False_Alarm_Rate))
```

### 4. 序列效应分析
- **重复抑制**: 连续AX试次的表现变化
- **转换成本**: 条件转换时的表现下降
- **学习效应**: 跨区块的表现改善
- **疲劳效应**: 后期区块的表现下降

## 个体差异与发展变化

### 1. 发展轨迹
- **儿童期**: 工作记忆容量限制，AX表现较差
- **青少年期**: 认知控制仍在发展，AY错误率较高
- **成年早期**: 认知控制功能达到峰值
- **中老年期**: 工作记忆和认知灵活性逐步下降

### 2. 个体差异因素
- **工作记忆容量**: 影响AX条件表现
- **抑制控制能力**: 影响AY条件表现  
- **处理速度**: 影响整体反应时间
- **注意控制**: 影响维持表现的稳定性

### 3. 基因多态性
- **COMT基因**: 影响前额叶多巴胺代谢和工作记忆
- **DAT1基因**: 影响多巴胺转运和认知控制
- **DRD4基因**: 影响多巴胺受体和注意调节
- **BDNF基因**: 影响神经可塑性和认知功能

### 4. 环境因素
- **教育水平**: 高教育与更好的认知控制相关
- **社会经济地位**: 影响认知发展和表现
- **压力水平**: 慢性压力损害前额叶功能
- **生活方式**: 运动、睡眠质量影响认知表现

## 技术实现特点

### 1. 图像刺激管理
- **预加载机制**: 确保刺激呈现的时间精度
- **随机化策略**: 平衡刺激-条件分配
- **图像格式**: 标准化的PNG格式圆点图案
- **尺寸控制**: 一致的视觉角度和对比度

### 2. 实验流程控制
- **条件平衡**: 确保各条件试次数的准确分配
- **时间精度**: jsPsych插件提供毫秒级控制
- **反馈逻辑**: 实时计算并呈现反馈
- **数据完整性**: 自动记录所有试次信息

### 3. 用户体验设计
- **清晰指导**: 详细的任务说明和示例
- **渐进学习**: 练习阶段的充分训练
- **适度休息**: 区块间的疲劳缓解
- **直观反馈**: 颜色编码的正确/错误反馈

## 扩展研究方向

### 1. 任务变体
- **情绪AX-CPT**: 使用情绪面孔作为线索和探测
- **空间AX-CPT**: 结合空间位置信息的版本
- **听觉AX-CPT**: 使用听觉刺激的模态变体
- **双任务AX-CPT**: 结合其他认知任务的干扰版本

### 2. 技术整合
- **fMRI同步**: 研究任务相关的脑激活模式
- **EEG记录**: 分析事件相关电位和脑振荡
- **眼动追踪**: 监测视觉注意分配策略
- **近红外光谱**: 实时监测前额叶激活

### 3. 临床转化
- **诊断工具**: 开发临床筛查和评估版本
- **治疗监测**: 跟踪药物治疗和心理干预效果
- **认知训练**: 设计适应性训练程序
- **个体化评估**: 基于个人特征的定制化测试

### 4. 计算建模
- **双系统模型**: 反应性vs主动性控制系统
- **神经网络模型**: 模拟前额叶-皮层下回路
- **贝叶斯模型**: 描述期待更新和决策过程
- **强化学习**: 建模适应性行为和学习机制

## 结果解释指导

### 1. 正常表现范围
- **AX准确率**: >85%
- **AY准确率**: >70%
- **BX准确率**: >70%
- **BY准确率**: >85%
- **d'值**: >1.5

### 2. 异常模式识别
- **工作记忆缺陷**: AX准确率<70%
- **认知灵活性受损**: AY准确率<50%
- **上下文处理异常**: BX准确率<50%
- **整体注意缺陷**: 所有条件表现均下降

### 3. 临床解释建议
- **轻度异常**: 建议进一步认知评估
- **中度异常**: 考虑神经心理学检查
- **重度异常**: 强烈建议临床转诊
- **模式分析**: 结合错误类型和反应时间分析

### 4. 干预建议
- **工作记忆训练**: 针对AX表现差的个体
- **认知灵活性训练**: 针对AY表现差的个体
- **上下文处理训练**: 针对BX表现差的个体
- **综合认知训练**: 多域缺陷的综合干预

该点模式期待任务为评估前额叶认知控制功能提供了综合性的测量工具，其基于AX-CPT范式的设计能够分离测量工作记忆、认知灵活性和上下文处理等核心执行功能成分，为认知神经科学研究和临床神经心理学评估提供了重要的实验手段。