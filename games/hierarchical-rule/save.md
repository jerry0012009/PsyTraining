# 层次规则任务 - 数据保存机制

## 概述
层次规则任务（Hierarchical Rule Task）是一个复杂的认知控制实验，用于测量抽象推理、认知灵活性和层次规则学习能力。该任务基于Wisconsin卡片分类任务（WCST）和概念形成范式设计，通过要求参与者发现并应用隐藏的分类规则来评估前额叶执行功能。参与者需要根据视觉刺激的不同特征维度（如颜色、形状、方向）学习分类规则，为研究抽象思维、工作记忆和认知灵活性提供重要的实验工具。

## 数据保存机制

### 保存位置和方式
- **主要方式**: AJAX POST请求到服务器端点 `/save`
- **备用方式**: 当服务器不可用时，自动下载CSV文件到本地
- **文件格式**: JSON格式（服务器）或CSV格式（本地）
- **文件名**: `hierarchical-rule_results.csv`

### 数据保存流程
1. 使用jsPsych框架管理整个实验流程和数据收集
2. 每个试次记录刺激特征、反应选择、正确性等数据
3. 实验结束时序列化所有数据为JSON格式
4. 优先通过AJAX POST发送到服务器
5. 服务器不可用时触发本地CSV文件下载

### jsPsych数据结构
```javascript
{
  "rt": 1234,                             // 反应时间(毫秒)
  "stimulus": "<div class = centerbox><div class = stimBox><img class = hierarchicalStim src =images/41.bmp </img><img class = hierarchicalBorder src =images/3_border.png </img></div></div>", // 呈现的复合刺激
  "key_press": 75,                        // 按键响应(74='J', 75='K', 76='L')
  "correct": true,                        // 反应正确性
  "trial_type": "poldrack-single-stim",   // 试次类型
  "trial_index": 89,                      // 试次索引
  "time_elapsed": 23456,                  // 实验开始以来的总时间
  "internal_node_id": "0.0.5.2",         // jsPsych内部节点ID
  "trial_id": "hierarchical_stim",        // 试次标识
  "exp_stage": "hierarchical_test",       // 实验阶段
  "stim": 4,                              // 刺激编号
  "orientation": "horizontal",            // 刺激方向(vertical/slant/horizontal)
  "border": "green",                      // 边框颜色(red/blue/green/yellow)
  "correct_response": 75,                 // 正确反应键值
  "trial_num": 89,                        // 试次编号
  "possible_responses": [74, 75, 76],     // 可能的反应按键
  "timing_stim": 1000,                    // 刺激呈现时间
  "timing_response": 3000,                // 反应窗口时间
  "credit_var": true,                     // 任务完成质量评估
  "performance_var": 245                  // 总正确试次数
}
```

## 实验设计与刺激

### 刺激特征维度
该任务使用多维度复合视觉刺激，每个刺激包含以下特征：

1. **刺激内容（Stim）**:
   - 6种不同的几何图形或符号
   - 编码为数字1-6
   - 作为刺激的核心内容特征

2. **方向特征（Orientation）**:
   - **垂直方向**（vertical）：刺激垂直呈现
   - **倾斜方向**（slant）：刺激倾斜呈现  
   - **水平方向**（horizontal）：刺激水平呈现
   - 编码为数字1-3

3. **边框颜色（Border）**:
   - **红色边框**（red）：刺激周围红色边框
   - **蓝色边框**（blue）：刺激周围蓝色边框
   - **绿色边框**（green）：刺激周围绿色边框
   - **黄色边框**（yellow）：刺激周围黄色边框
   - 编码为数字1-4

### 规则学习机制
实验包含两种规则学习条件：

#### 1. 层次规则条件（Hierarchical Rule）
- **规则结构**: 基于两个特征维度的复合规则
- **绿色边框规则**: 按刺激内容分类（6种刺激→2个按键类别）
- **黄色边框规则**: 按方向特征分类（3种方向→3个按键）
- **认知要求**: 需要整合两个特征维度，体现层次性思维

#### 2. 平面规则条件（Flat Rule）
- **规则结构**: 随机的刺激-反应映射
- **学习方式**: 通过反馈逐步学习每个刺激的正确反应
- **认知要求**: 主要依赖记忆和联想学习

### 实验参数 (`experiment.js:132-210`):
- **试次数量**: 每个规则条件360个试次
- **刺激组合**: 4种边框颜色 × 6种刺激 × 3种方向 = 72种可能组合
- **反应按键**: J键(74)、K键(75)、L键(76)
- **休息间隔**: 每60个试次后提供休息

### 实验结构:
1. **指导阶段**: 展示所有18种刺激，说明任务要求
2. **层次规则测试**: 360个试次，学习基于特征的分类规则
3. **休息间隔**: 5次休息机会，显示当前得分
4. **后测问卷**: 收集策略使用和主观体验
5. **可选平面规则**: 根据配置可能包含平面规则条件

### 试次时间流程:
- 注视点: 250-750ms（随机）
- 刺激呈现: 1000ms
- 反应窗口: 3000ms
- 反馈呈现: 1000ms
- 试次间间隔: 0ms

## 数据保存实现代码

**实验初始化和数据收集** (`index.html:30-36`):
```javascript
jsPsych.init({
    timeline: hierarchical_rule_experiment,
    display_element: "getDisplayElement",
    fullscreen: true,
    on_trial_finish: function(data){
        addID('hierarchical-rule')  // 添加实验标识符
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
                    jsPsych.data.localSave('hierarchical-rule_results.csv', 'csv');
                }
            }
        });
    })
}
```

**刺激生成逻辑** (`experiment.js:144-190`):
```javascript
colors = jsPsych.randomization.shuffle([1, 2, 3, 4]) // 边框颜色随机化
stims = jsPsych.randomization.shuffle([1, 2, 3, 4, 5, 6]) // 刺激内容随机化
orientations = [1, 2, 3] // 方向特征

for (var c = 0; c < colors.length; c++) {
  for (var s = 0; s < stims.length / 2; s++) {
    for (var o = 0; o < orientations.length; o++) {
      if (c < colors.length / 2) {
        // 平面规则条件：随机映射
        flat_stims.push({
          stimulus: stim_prefix + path_source + stims[s] + orientations[o] + '.bmp </img>' +
            border_prefix + path_source + colors[c] + '_border.png' + postfix,
          data: {
            stim: stims[s],
            orientation: orientation_data[orientations[o] - 1],
            border: color_data[colors[c] - 1],
            exp_stage: "flat_test",
            correct_response: random_correct.pop()
          }
        })
      } else {
        // 层次规则条件：基于特征的映射
        if (c == 2) { // 绿色边框：按刺激内容分类
          correct_response = choices[s]
        } else if (c == 3) { // 黄色边框：按方向分类
          correct_response = choices[o]
        }
        hierarchical_stims.push({
          stimulus: stim_prefix + path_source + stims[s + (stims.length / 2)] + orientations[o] +
            '.bmp </img>' + border_prefix + path_source + colors[c] + '_border.png' + postfix,
          data: {
            stim: stims[s + (stims.length / 2)],
            orientation: orientation_data[orientations[o] - 1],
            exp_stage: "hierarchical_test",
            border: color_data[colors[c] - 1],
            correct_response: correct_response
          }
        })
      }
    }
  }
}
```

**反馈计算逻辑** (`experiment.js:76-86`):
```javascript
var getFeedback = function() {
  var last_trial = jsPsych.data.getLastTrialData()
  if (last_trial.key_press === -1) {
    return '<div class = centerbox><div class = "center-text">请反应更快!</div></div>'
  } else if (last_trial.correct === true) {
    total_correct += 1
    return '<div class = centerbox><div style = "color: lime"; class = "center-text">正确!</div></div>'
  } else {
    return '<div class = centerbox><div style = "color: red"; class = "center-text">错误</div></div>'
  }
}
```

## 核心认知测量

### 1. 抽象推理能力
- **定义**: 发现和应用抽象分类规则的能力
- **测量**: 层次规则条件的学习曲线和最终表现
- **计算**: 学习率、渐近表现水平、规则发现时间
- **意义**: 反映前额叶抽象思维和概念形成能力

### 2. 认知灵活性
- **定义**: 在不同规则间灵活转换的能力
- **测量**: 规则转换时的转换成本和适应速度
- **计算**: 转换试次的RT增加和错误率上升
- **意义**: 体现认知控制和注意转换能力

### 3. 工作记忆容量
- **定义**: 维持和操作规则信息的能力
- **测量**: 复杂规则条件下的表现稳定性
- **计算**: 表现变异性、错误后调整、注意维持
- **意义**: 反映工作记忆的执行控制功能

### 4. 学习效率
- **定义**: 从反馈中快速学习的能力
- **测量**: 学习曲线的斜率和学习阶段长度
- **计算**: 达到学习标准的试次数、错误减少率
- **意义**: 体现强化学习和适应性行为

### 5. 规则表征复杂性
- **定义**: 处理多维度规则的能力
- **测量**: 层次规则vs平面规则的表现差异
- **计算**: 条件间准确率和反应时间的对比
- **意义**: 反映认知复杂性的处理能力

## 认知神经科学基础

### 1. 前额叶皮层功能
- **背外侧前额叶(DLPFC)**: 抽象规则表征和工作记忆维持
- **腹外侧前额叶(VLPFC)**: 规则选择和认知灵活性
- **前额叶极区(FPC)**: 层次化认知控制和元认知
- **眶额皮层(OFC)**: 反馈处理和价值学习

### 2. 皮层-纹状体回路
- **认知回路**: 背侧前额叶-背侧纹状体，支持规则学习
- **情绪回路**: 眶额-腹侧纹状体，处理奖赏和反馈
- **运动回路**: 运动皮层-背侧纹状体，执行反应选择
- **边缘回路**: 前扣带-腹侧纹状体，动机和认知努力

### 3. 神经递质系统
- **多巴胺系统**: 预测误差信号和强化学习
- **胆碱能系统**: 注意调节和不确定性处理
- **去甲肾上腺素系统**: 觉醒和认知努力调节
- **GABA系统**: 抑制控制和神经网络稳定

### 4. 发展与老化
- **青少年期**: 前额叶仍在发育，抽象推理能力提升
- **成年期**: 认知功能达到峰值，规则学习最优
- **老年期**: 前额叶功能下降，认知灵活性减退
- **神经可塑性**: 训练可改善规则学习和认知灵活性

## 数据质量控制

### 性能评估函数 (`experiment.js:19-66`):
```javascript
function assessPerformance() {
    var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
    var missed_count = 0
    var trial_count = 0
    var rt_array = []
    
    // 记录参与者的选择分布
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
        if (choice_counts[key] > trial_count * 0.85) {
            responses_ok = false
        }
    })
    
    var missed_percent = missed_count/experiment_data.length
    
    // 质量控制标准
    credit_var = (missed_percent < 0.4 && avg_rt > 200 && responses_ok)
    
    if (credit_var === true) {
        performance_var = total_correct
    } else {
        performance_var = 0
    }
    
    jsPsych.data.addDataToLastTrial({
        "credit_var": credit_var, 
        "performance_var": performance_var
    })
}
```

### 数据质量标准:
1. **遗漏率控制**: 遗漏试次比例 < 40%
2. **反应时间过滤**: 反应时间 > 200ms
3. **反应分布检查**: 避免单一按键反应 > 85%
4. **学习验证**: 检查是否达到基本学习水平

## 临床应用价值

### 1. 精神分裂症研究
- **抽象思维缺陷**: 层次规则学习困难
- **认知灵活性受损**: 规则转换表现下降
- **工作记忆异常**: 复杂规则维持困难
- **额叶功能评估**: 认知症状的客观测量

### 2. ADHD评估
- **注意维持问题**: 长时间任务中表现下降
- **执行控制缺陷**: 规则应用不一致
- **学习效率低下**: 反馈利用能力减弱
- **药物疗效监测**: 兴奋剂对执行功能的改善

### 3. 老年认知评估
- **抽象能力衰退**: 复杂规则学习困难
- **认知灵活性下降**: 策略转换能力减退
- **前额叶老化**: 执行功能的年龄相关变化
- **痴呆风险评估**: 早期认知功能下降的指标

### 4. 其他临床应用
- **自闭症谱系障碍**: 认知灵活性和抽象思维评估
- **双相情感障碍**: 情绪发作期的执行功能变化
- **脑损伤评估**: 前额叶损伤的功能评估
- **物质依赖**: 决策能力和认知控制的评估

## 实验参数设置

### 刺激配置 (`experiment.js:144-154`):
```javascript
colors = jsPsych.randomization.shuffle([1, 2, 3, 4]) // 4种边框颜色
stims = jsPsych.randomization.shuffle([1, 2, 3, 4, 5, 6]) // 6种刺激内容
orientations = [1, 2, 3] // 3种方向
color_data = ['red', 'blue', 'green', 'yellow']
orientation_data = ['vertical', 'slant', 'horizontal']
random_correct = jsPsych.randomization.repeat(choices, 6) // 随机正确反应
```

### 时间参数:
- **刺激呈现**: 1000ms
- **反应窗口**: 3000ms
- **反馈持续**: 1000ms
- **注视点**: 250-750ms（随机）
- **休息间隔**: 每60个试次

### 试次分布:
- **层次规则**: 360个试次
- **平面规则**: 360个试次（可选）
- **总时长**: 22分钟（仅层次）或40分钟（双条件）

## 数据分析方法

### 1. 学习曲线分析
```javascript
// 滑动窗口准确率计算
function calculateLearningCurve(data, windowSize = 20) {
    var learningCurve = []
    for (var i = windowSize-1; i < data.length; i++) {
        var window = data.slice(i-windowSize+1, i+1)
        var accuracy = window.reduce((sum, trial) => sum + trial.correct, 0) / windowSize
        learningCurve.push({
            trial: i+1,
            accuracy: accuracy,
            phase: getPhase(accuracy)
        })
    }
    return learningCurve
}

// 学习阶段划分
function getPhase(accuracy) {
    if (accuracy < 0.33) return "random"
    else if (accuracy < 0.6) return "learning" 
    else return "mastery"
}
```

### 2. 规则发现分析
```javascript
// 规则发现时间点检测
function detectRuleDiscovery(data, criterion = 0.75, window = 10) {
    for (var i = window-1; i < data.length; i++) {
        var recentTrials = data.slice(i-window+1, i+1)
        var accuracy = recentTrials.reduce((sum, trial) => sum + trial.correct, 0) / window
        if (accuracy >= criterion) {
            return i+1 // 规则发现试次
        }
    }
    return null // 未发现规则
}
```

### 3. 特征维度分析
```javascript
// 按特征维度分析表现
function analyzeByDimension(data) {
    var byBorder = {}
    var byOrientation = {}
    var byStim = {}
    
    data.forEach(trial => {
        // 按边框颜色分组
        if (!byBorder[trial.border]) byBorder[trial.border] = []
        byBorder[trial.border].push(trial.correct)
        
        // 按方向分组
        if (!byOrientation[trial.orientation]) byOrientation[trial.orientation] = []
        byOrientation[trial.orientation].push(trial.correct)
        
        // 按刺激内容分组
        if (!byStim[trial.stim]) byStim[trial.stim] = []
        byStim[trial.stim].push(trial.correct)
    })
    
    return {
        border: calculateGroupStats(byBorder),
        orientation: calculateGroupStats(byOrientation),
        stim: calculateGroupStats(byStim)
    }
}
```

### 4. 序列效应分析
```javascript
// 错误后调整效应
function analyzePostErrorAdjustment(data) {
    var postErrorTrials = []
    
    for (var i = 1; i < data.length; i++) {
        if (!data[i-1].correct) { // 前一试次错误
            postErrorTrials.push({
                prevError: true,
                currentRT: data[i].rt,
                currentCorrect: data[i].correct,
                trialNum: i+1
            })
        }
    }
    
    return {
        count: postErrorTrials.length,
        avgRT: postErrorTrials.reduce((sum, t) => sum + t.currentRT, 0) / postErrorTrials.length,
        accuracy: postErrorTrials.reduce((sum, t) => sum + t.currentCorrect, 0) / postErrorTrials.length
    }
}
```

## 个体差异与影响因素

### 1. 认知能力差异
- **工作记忆容量**: 影响复杂规则的维持和操作
- **处理速度**: 影响学习速度和反应效率
- **抽象推理**: 影响规则发现和概念形成
- **注意控制**: 影响相关特征的选择性注意

### 2. 人格特质影响
- **开放性**: 与抽象思维和创新规则发现相关
- **尽责性**: 与持续努力和任务坚持相关
- **神经质**: 与焦虑和表现压力相关
- **外向性**: 与冒险尝试和探索行为相关

### 3. 发展轨迹
- **儿童期**: 具体操作思维，抽象规则学习困难
- **青少年期**: 抽象思维发展，但不如成人稳定
- **成年期**: 抽象推理达到峰值，学习效率最高
- **老年期**: 认知灵活性下降，但经验可部分补偿

### 4. 环境因素
- **教育背景**: 高等教育提高抽象思维能力
- **文化差异**: 东西方文化在分类思维上的差异
- **社会经济地位**: 影响认知发展和表现
- **压力状态**: 慢性压力损害前额叶功能

## 技术实现特点

### 1. 刺激呈现系统
- **复合刺激**: HTML叠加实现多层视觉特征
- **图像预加载**: 确保刺激呈现的时间精度
- **随机化控制**: 平衡刺激特征的分布
- **视觉一致性**: 标准化的尺寸和对比度

### 2. 反馈系统设计
- **即时反馈**: 每个试次后立即提供结果
- **积分系统**: 累计正确数作为激励机制
- **颜色编码**: 绿色正确、红色错误的直观反馈
- **进度显示**: 休息时显示当前得分

### 3. 循环控制机制
- **动态循环**: 基于刺激队列的循环控制
- **条件执行**: 根据配置选择单一或双重条件
- **休息管理**: 自动在指定试次后提供休息
- **状态追踪**: 实时更新试次计数和表现

### 4. 数据完整性
- **全面记录**: 刺激特征、反应、时间等完整信息
- **质量评估**: 多维度的数据质量控制
- **错误处理**: 网络失败时的本地保存机制
- **格式兼容**: 支持多种统计软件的数据格式

## 扩展研究方向

### 1. 任务变体
- **情绪规则学习**: 使用情绪面孔的分类规则
- **语言规则任务**: 基于语义特征的分类学习
- **动态规则变化**: 规则在实验过程中的动态改变
- **多层次规则**: 更复杂的规则层次结构

### 2. 技术整合
- **fMRI同步**: 研究规则学习的神经网络
- **EEG记录**: 分析反馈相关脑电成分
- **眼动追踪**: 监测视觉注意分配策略
- **TMS干预**: 测试特定脑区的因果作用

### 3. 计算建模
- **强化学习模型**: 建模反馈驱动的规则学习
- **贝叶斯推理**: 描述规则发现的概率过程
- **神经网络模型**: 模拟皮层-纹状体学习回路
- **元学习算法**: 建模学会学习的能力

### 4. 临床转化
- **诊断工具**: 开发标准化的临床评估版本
- **认知训练**: 设计适应性的规则学习训练
- **治疗监测**: 跟踪药物和心理干预效果
- **个体化评估**: 基于个人特征的定制化测试

## 结果解释指导

### 1. 正常表现指标
- **最终准确率**: >70%（层次规则）
- **学习速度**: <100试次达到学习标准
- **表现稳定性**: 学会后维持>80%准确率
- **反应时间**: 平均RT 800-1500ms

### 2. 异常模式识别
- **学习障碍**: 300试次后仍未达到60%准确率
- **维持困难**: 学会后表现显著下降
- **认知僵化**: 错误策略的持续使用
- **注意缺陷**: 随机反应模式或极高遗漏率

### 3. 认知评估意义
- **轻度异常**: 可能的执行功能问题
- **中度异常**: 建议神经心理学评估
- **重度异常**: 强烈建议临床转诊
- **模式分析**: 结合学习曲线和错误类型分析

### 4. 干预建议
- **认知训练**: 针对抽象推理和认知灵活性
- **策略教学**: 明确的规则发现策略指导
- **工作记忆训练**: 提高复杂信息的维持能力
- **注意训练**: 改善选择性注意和认知控制

### 5. 研究应用价值
- **基础研究**: 理解抽象思维的认知机制
- **临床研究**: 评估精神疾病的认知症状
- **发展研究**: 追踪认知能力的发展轨迹
- **教育应用**: 评估和培养抽象思维能力

该层次规则任务为评估高级认知功能提供了综合性的测量工具，其复杂的刺激设计和规则结构能够深入评估抽象推理、认知灵活性和学习能力等核心执行功能，为认知神经科学研究和临床神经心理学评估提供了重要的实验手段。