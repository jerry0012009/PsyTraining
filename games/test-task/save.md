# 测试任务 - 数据保存说明

## 任务概述
测试任务(Test Task)是一个简单的反应时间测量实验，要求被试在看到十字形(+)刺激时按空格键做出反应。该任务主要用于测试实验系统的基本功能和数据收集机制。

## 数据保存机制

### 技术框架
- **实验库**: jsPsych
- **数据系统**: jsPsych.data
- **文件类型**: JavaScript实验

### 数据收集方式

#### 1. 试验数据收集
数据通过以下方式在每个试验结束时添加：
```javascript
on_finish: function() {
    jsPsych.data.addDataToLastTrial({'addingOnTrial': 'added!'})
}
```

#### 2. 关键数据字段
- **trial_id**: 试验标识('test', 'end', 'post task questions')
- **rt**: 反应时间(毫秒)，-1表示未反应
- **key_press**: 按键反应(32=空格键)
- **stimulus**: 显示的刺激内容(十字形HTML)
- **addingOnTrial**: 试验级别添加的标记数据
- **added_Data?**: 实验级别添加的标记数据

#### 3. 任务参数设置
```javascript
var experiment_len = 3;  // 试验总数
var gap = 0;             // 试验间隔
var choices = [32];      // 允许的按键(空格键)
var timing_response = 2000;  // 反应时间窗口(毫秒)
var timing_post_trial = 100; // 试验后间隔
```

### 性能评估机制

#### 1. 表现评估函数
在实验结束时通过`assessPerformance()`函数计算：
```javascript
function assessPerformance() {
    var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim');
    var missed_count = 0;
    var trial_count = 0;
    var rt_array = [];
    
    // 计算平均反应时间
    var avg_rt = math.median(rt_array);
    
    // 计算漏报率
    var missed_percent = missed_count/trial_count;
    
    // 设定达标标准
    credit_var = (missed_percent < 0.4 && avg_rt > 200);
    
    if (credit_var === true) {
        performance_var = Math.max(0, 1000 - avg_rt);
    } else {
        performance_var = 0;
    }
}
```

#### 2. 质量控制标准
- **credit_var**: 表现是否达标(布尔值)
  - 漏报率 < 40%
  - 平均反应时间 > 200ms
- **performance_var**: 表现分数(0-800分)
  - 达标时: max(0, 1000 - 平均反应时间)
  - 不达标时: 0分

### 数据保存流程

#### 1. 实验时序
1. **测试试验**: 3次十字形刺激反应
2. **数据添加**: 调用数据添加函数
3. **注意力检查**: 可选的注意力验证
4. **任务后问卷**: 收集主观体验
5. **结束评估**: 计算最终表现指标

#### 2. 数据收集节点
```javascript
// 试验级数据添加
var add_data = {
    type: 'call-function',
    func: function() {
        jsPsych.data.addDataToLastTrial({'added_Data?': 'success!'})
    }
}

// 结束时评估
var end_block = {
    type: 'poldrack-text',
    data: {
        trial_id: 'end',
        exp_id: 'test_task'
    },
    on_finish: assessPerformance
}
```

### 数据输出格式

#### 试验数据结构
```javascript
{
    "trial_id": "test",
    "rt": 456,
    "key_press": 32,
    "stimulus": "<div class='shapebox'><div id='cross'></div></div>",
    "addingOnTrial": "added!"
}
```

#### 最终评估数据
```javascript
{
    "trial_id": "end",
    "exp_id": "test_task", 
    "credit_var": true,
    "performance_var": 544,
    "added_Data?": "success!"
}
```

### 认知指标测量

#### 1. 基础反应能力
- **简单反应时间**: 对简单视觉刺激的反应速度
- **反应一致性**: 多次试验间反应时间的稳定性
- **注意维持**: 在短时间内保持注意力的能力

#### 2. 数据质量指标
- **参与度**: 漏报率反映任务参与程度
- **反应有效性**: 超快反应(<200ms)可能表示随意按键
- **任务理解**: 通过问卷评估任务理解程度

### 实验配置

#### 1. 刺激参数
- **刺激类型**: 十字形(+)
- **呈现时间**: 持续呈现直到反应或超时
- **反应窗口**: 2000毫秒
- **试验间隔**: 100毫秒

#### 2. 反应要求  
- **目标按键**: 空格键(键码32)
- **反应指标**: 按键反应时间
- **任务指导**: "看到十字形时按空格键"

## 注意事项

### 数据质量保证
1. **反应时间阈值**: 过快反应(<200ms)影响达标评估
2. **漏报率控制**: 超过40%漏报判定为表现不达标
3. **系统延迟**: 考虑浏览器和硬件延迟对反应时间的影响

### 适用场景
1. **系统测试**: 验证数据收集和保存功能
2. **基线测量**: 获取个体基础反应时间数据
3. **实验流程验证**: 测试实验程序的完整性
4. **设备校准**: 评估实验环境的时间精度

### 分析建议
1. 计算中位数反应时间避免极值影响
2. 分析反应时间分布识别异常模式
3. 结合主观报告解释客观表现数据
4. 考虑学习效应对连续试验的影响