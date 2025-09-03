# RSVP Task - 数据保存机制

## 概述
快速序列视觉呈现（RSVP）任务是一个基于jsPsych框架的认知实验，用于测量注意瞬脱(Attentional Blink)现象和双目标检测能力。

## 数据保存方式

### 1. 实验数据收集
- **框架**: jsPsych 6.0.1实验框架
- **数据结构**: JSON格式，包含每个试次的详细信息
- **任务标识**: `rsvp-task`

### 2. 数据保存流程

#### 试次数据保存
```javascript
// 每个试次结束时添加任务ID
on_trial_finish: function(data) {
    addID('rsvp-task')
}
```

#### 实验结束时的数据处理
```javascript
on_finish: function(data) {
    var data = jsPsych.data.get().json();
    
    // 1. 优先尝试服务器端保存
    $.ajax({
        type: "POST",
        url: '/save',
        data: { "data": data },
        success: function(){ document.location = "/next" }
    });
    
    // 2. 服务器不可用时，本地保存
    jsPsych.data.get().localSave('json','rsvp-task_results.json');
}
```

### 3. 保存的数据内容

#### 基本信息
- `phase`: 实验阶段（practice0, practice1, test, instructions）
- `test_part`: 试次类型（iti, fixation, blank, rsvp, response）
- `trial_number`: 试次编号
- `rt`: 反应时间
- `key_press`: 按键反应

#### RSVP特有数据
- `stim`: 呈现的刺激内容（字母或数字）
- `correct_responses`: 正确答案数组
- `correct_response`: 单个正确答案
- `correct`: 总体正确性
- `t1_correct`: T1目标正确性
- `t2_correct`: T2目标正确性
- `lag`: T1和T2之间的间隔

#### 实验设计参数
- **目标位置**: T1位置（7, 8, 9）
- **时间间隔**: Lag（1, 3, 5, 8）
- **刺激持续**: 70ms（正式任务），210ms（演示）
- **练习重复**: 2次×12种组合=24个试次
- **测试重复**: 12次×12种组合=144个试次

### 4. 实验流程
1. **指导语阶段**: 缓慢演示版本
2. **练习阶段**: 需要达到50%正确率才能进入测试
3. **正式测试**: 144个试次的RSVP任务

### 5. 文件保存格式
- **本地保存**: `rsvp-task_results.json`
- **数据格式**: JSON格式，包含所有试次的详细数据
- **备用格式**: JSON用于服务器传输

### 6. 数据字段说明
- **刺激序列**: 18个字母+2个数字目标
- **反应记录**: 数字键按压（2-9）
- **正确性计算**: 双目标检测精度，不考虑顺序
- **练习机制**: 低于50%正确率时重复练习

### 7. 使用说明
实验结束后，数据会自动保存为JSON文件到浏览器下载目录，文件名格式为`rsvp-task_results.json`。如果配置了服务器端点，数据也会同步保存到服务器。该任务主要测量注意瞬脱现象，即在快速序列中检测两个目标时第二个目标的检测困难。