# What's Missing Lightning 任务数据保存说明

## 任务概述
What's Missing Lightning任务是一个基于算术的快速认知训练游戏，用于评估和训练数学流畅性、处理速度和认知控制能力。被试需要在限定时间内快速解决加法运算问题（生产模式）或填入缺失的加数（代数模式），测量算术处理速度和准确性。

## 数据保存机制

### 技术架构
- **游戏引擎**: Phaser.js 2D游戏开发框架
- **物理引擎**: Box2D物理插件（用于粒子效果）
- **界面库**: jQuery 3.x用于DOM操作和AJAX
- **数据存储**: JavaScript对象和数组存储试验数据
- **网络传输**: jQuery AJAX POST请求或本地JSON下载

### 任务设计

#### 两种任务模式
1. **生产模式（Production Mode）**
   - 任务类型：完成加法运算（a + b = ?）
   - 示例问题："7 + 8 = ?"
   - 反应要求：计算并输入结果
   - 认知要求：算术事实提取和计算执行

2. **代数模式（Missing/Algebra Mode）**
   - 任务类型：填入缺失加数（a + ? = c）
   - 示例问题："7 + ? = 15"
   - 反应要求：计算并输入缺失的加数
   - 认知要求：逆向算术推理和工作记忆

#### 时间控制系统
- **计时模式**: 可设置固定时间限制（如闪电模式）
- **非计时模式**: 允许充分时间思考（如禅模式）
- **自适应时间**: 根据表现动态调整时间压力
- **进度指示**: 圆形进度条显示剩余时间

### 保存的数据字段

#### 基础试验数据
```javascript
{
    trial: 1-n,                    // 试验编号（全局计数器）
    answer: 12,                    // 被试输入的答案
    n1: 7,                         // 第一个操作数
    n2: 5,                         // 第二个操作数
    problem_id: "7+5",             // 问题标识符
    points: 85,                    // 当前累积金币数
    solution: 5,                   // 正确答案
    RT: 2.347,                     // 反应时间（秒）
    ACC: 1,                        // 准确性（1=正确，0=错误）
    finished: 0                    // 任务完成标志（1=完成，0=未完成）
}
```

#### 问题呈现格式
```javascript
// 生产模式问题格式
problem: "7 + 5 = ?"

// 代数模式问题格式  
problem: "7 + ? = 12"
```

#### 数据收集机制
```javascript
// 全局数据存储
this.data = {};                    // 当前试验数据对象
this.taskdata = [];                // 所有试验数据数组

// 数据输入函数
function inputData(field, value) {
    this.data[field] = value;      // 设置当前试验的字段值
}

// 数据提交函数
function sendData(trial) {
    inputData('trial', trial);     // 添加试验编号
    this.taskdata.push(this.data); // 推入数据数组
    this.data = {};                // 重置当前试验数据
}
```

### 算术问题生成

#### 问题集配置
```javascript
// 从配置文件加载问题参数
$.get('config.json').done(function(data) {
    this.problem_set = data;       // 问题集参数
    // 包含数字范围、难度级别等设置
});

// 动态问题生成
problems = problemGen(this.week, this.problem_set);
this.op1s = problems[1];           // 第一操作数数组
this.op2s = problems[2];           // 第二操作数数组  
this.problem_ids = problems[3];    // 问题ID数组
```

#### 重复机制
```javascript
// SPT (Spaced Practice Training) 重复问题生成
reProblems = problemGen(this.week, this.problem_set);
this.op1s = problems[1].concat(reProblems[1]);    // 连接原始和重复问题
this.op2s = problems[2].concat(reProblems[2]);
this.problem_ids = problems[3].concat(reProblems[3]);
```

### 反应评估系统

#### 正确性判断
```javascript
var grade = function(time_stamp) {
    if (this.algebra === false) {
        // 生产模式：检查计算结果
        this.user_answer = parseInt(this.problem.problem.children[5].text);
        correct_answer = parseInt(this.problem.problem.children[0].text) + 
                        parseInt(this.problem.problem.children[1].text);
    } else {
        // 代数模式：检查缺失加数
        this.user_answer = parseInt(this.problem.problem.children[1].text);
        correct_answer = parseInt(this.problem.problem.children[5].text) - 
                        parseInt(this.problem.problem.children[0].text);
    }
    
    this.correct = (this.user_answer == correct_answer);
}
```

#### 分数和奖励系统
```javascript
if (this.correct) {
    this.points += 1;              // 基础分数+1
    
    // 连续正确奖励机制
    if (this.streak == 2) {        // 连续3个正确
        this.points += 1;          // 额外奖励
        this.feedback.text = "连续3个正确！额外金币！";
    } else if (this.streak == 6) { // 连续7个正确  
        this.points += 1;
        this.feedback.text = "连续7个正确！额外金币！";
    } else if (this.streak == 14) { // 连续15个正确
        this.points += 1;
        this.feedback.text = "连续15个正确！额外金币！";
    } else if (this.streak == 25) { // 连续26个正确
        this.points += 1;
        this.feedback.text = "完美得分！额外金币！";
    }
} else {
    this.points = Math.max(0, this.points - 1);  // 错误时扣分，但不低于0
}
```

### 时间管理系统

#### 动态时间调整
```javascript
if (this.maxTime != 0) {           // 计时模式
    if (this.correct) {
        this.maxTime = this.ogMaxTime;      // 正确：恢复原始时间
    } else {
        this.maxTime += 1000;               // 错误：增加1秒时间
    }
    
    // 更新计时器
    this.clock = this.game.add.tween(this.pie).to(
        {progress: 1}, this.maxTime, Phaser.Easing.Linear.None, false, 0
    );
}
```

#### 超时处理
```javascript
this.clock.onComplete.add(this.endTrial, this);  // 时间用完自动结束试验
```

### 反馈和错误处理

#### 即时反馈系统
```javascript
var giveFeedback = function() {
    if (this.correct) {
        // 正确反馈
        var correct_feedback = ['太棒了！','真厉害！','你很棒！','正确！','太好了！','不错！'];
        var feedbackIndex = Math.floor(Math.random() * correct_feedback.length);
        this.feedback.text = correct_feedback[feedbackIndex];
        this.feedback.fill = '#FFFFFF';
        
        // 显示完整算式
        this.numFeedback.text = this.op1s[this.trial] + ' + ' + 
                               this.op2s[this.trial] + ' = ' + this.user_answer;
    } else {
        // 错误反馈
        this.feedback.text = '再试一次！';
        this.feedback.fill = '#FFFFFF';
        
        // 显示不等式
        this.numFeedback.text = this.op1s[this.trial] + ' + ' + 
                               this.op2s[this.trial] + ' ≠ ' + this.user_answer;
    }
}
```

#### 重复错误处理
```javascript
if (this.reps == 3) {              // 连续3次错误
    this.feedback.text = "抱歉，正确答案是";
    // 显示正确答案
    this.numFeedback.text = this.op1s[this.trial] + ' + ' + 
                           this.op2s[this.trial] + ' = ' + 
                           (this.op1s[this.trial] + this.op2s[this.trial]);
    
    // 将问题重新加入队列末尾
    this.op1s.push(this.op1s[this.trial]);
    this.op2s.push(this.op2s[this.trial]);  
    this.problem_ids.push(this.problem_ids[this.trial]);
}
```

### 数据传输机制

#### 网络传输
```javascript
function sendData(trial) {
    inputData('trial', trial);
    this.taskdata.push(this.data);
    
    if (data.finished == 1) {      // 任务完成时上传
        var promise = new Promise(function(resolve, reject) {
            var data = "text/json;charset=utf-8," + JSON.stringify(this.taskdata);
            resolve(data);
        });
        
        promise.then(function(data) {
            $.ajax({
                type: "POST",
                url: '/save',
                data: { "data": data },
                success: function(){ document.location = "/next"; },
                error: function(err) {
                    if (err.status == 200) {
                        document.location = "/next";
                    } else {
                        // 本地保存备份
                        var a = document.createElement('a');
                        a.href = "data:" + data;
                        a.download = 'data.json';
                        a.click();
                        document.location = "/next";
                    }
                }
            });
        });
    }
}
```

### 认知能力评估

#### 算术流畅性指标
1. **算术事实提取**: 简单加法问题的自动化反应
2. **计算策略**: 复杂问题的解决方法选择
3. **处理速度**: 算术操作的执行速度
4. **准确性**: 不同难度问题的正确率

#### 工作记忆评估
- **代数模式特异性**: 逆向推理对工作记忆的额外要求
- **多步骤处理**: 复杂计算中的中间结果维持
- **干扰抵抗**: 在时间压力下维持计算精度
- **认知负荷**: 不同难度水平的认知资源需求

### 学习和训练效应

#### 练习效应指标
1. **学习曲线**: 反应时间和准确性的改善轨迹
2. **自动化进展**: 从控制性处理到自动化处理的转变
3. **策略优化**: 解题策略的效率提升
4. **迁移效应**: 训练对未练习问题的促进作用

#### 间隔练习效应
- **重复间隔**: 问题重复呈现的时间间隔
- **遗忘曲线**: 已学问题的保持和遗忘
- **加强效应**: 重复练习对记忆巩固的作用
- **个体差异**: 不同学习者的间隔练习效果

### 数据分析指标

#### 基础表现指标
1. **总体准确率**: 所有试验的正确比例
2. **平均反应时间**: 总体处理速度
3. **完成率**: 在时间限制内完成的试验比例
4. **效率指标**: 准确率与速度的复合指标

#### 错误分析
1. **错误类型**: 计算错误vs输入错误vs策略错误
2. **错误模式**: 系统性偏误和随机错误
3. **难度效应**: 不同难度问题的错误率差异
4. **学习效应**: 错误率随练习的减少轨迹

### 数据导出格式
原生JavaScript以JSON数组格式存储，包含：
- 每个试验的完整问题信息和反应数据
- 时间戳和反应时间的精确记录
- 分数系统和奖励机制的详细跟踪
- 可用于学习曲线分析和认知建模的原始数据

## 临床应用价值
What's Missing Lightning任务广泛应用于：
- **算术能力评估**: 基础算术技能和数学流畅性测试
- **学习障碍诊断**: 算术学习困难和数学焦虑评估
- **认知训练**: 处理速度和工作记忆的训练干预
- **发展心理学**: 儿童算术能力发展轨迹研究
- **神经康复**: 脑损伤后算术功能的评估和训练

## 注意事项
- 确保被试理解两种任务模式的区别和要求
- 注意计时模式下的时间压力对表现的影响
- 监控连续错误和重复机制的合理性
- 考虑个体数学背景对任务表现的影响