# Reward Learning Task - 数据保存机制

## 概述
奖励学习任务是一个基于jsPsych框架的认知实验，用于评估参与者的奖励学习能力和决策制定过程。

## 数据保存方式

### 1. 实验数据收集
- **框架**: jsPsych实验框架
- **数据结构**: JSON格式，包含每个试次(trial)的详细信息
- **实验标识**: `exp_id: 'reward_learning'`

### 2. 数据保存流程

#### 试次数据保存
```javascript
// 每个试次结束时添加实验ID
jsPsych.data.addDataToLastTrial({exp_id: 'reward_learning'})
```

#### 实验结束时的数据处理
```javascript
on_finish: function(data){
    var data = jsPsych.data.dataAsJSON();
    
    // 1. 优先尝试服务器端保存
    $.ajax({
        type: "POST",
        url: '/save',
        data: { "data": data },
        success: function(){ document.location = "/next" }
    });
    
    // 2. 服务器不可用时，本地保存
    jsPsych.data.localSave('reward-learning-task_results.csv', 'csv');
}
```

### 3. 保存的数据内容

#### 基本信息
- `trial_id`: 试次类型标识
- `exp_stage`: 实验阶段（learning, feedback等）
- `condition`: 刺激条件（stim1-stim8）
- `optimal_response`: 最优反应
- `rt`: 反应时间
- `key_press`: 按键反应
- `stimulus`: 呈现的刺激

#### 实验特有数据
- `subject number`: 参与者编号（3位数）
- 奖励反馈信息（+/-金额）
- 试次间间隔(ITI)数据
- 学习阶段反应数据

### 4. 文件保存格式
- **本地保存**: `reward-learning-task_results.csv`
- **数据格式**: CSV格式，包含所有试次数据
- **备用格式**: JSON格式用于服务器传输

### 5. 数据字段说明
- **学习试次**: 40个试次，每种刺激重复5次
- **反应选择**: 上箭头(38)表示"是"，下箭头(40)表示"否"  
- **反馈类型**: 正反馈(绿色+金额)，负反馈(红色-金额)，超时反馈
- **刺激类型**: 8种不同的图片刺激，各有不同奖励概率

### 6. 使用说明
实验结束后，数据会自动保存为CSV文件到浏览器下载目录，文件名格式为`reward-learning-task_results.csv`。如果配置了服务器端点，数据也会同步保存到服务器。