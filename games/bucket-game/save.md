# Bucket Game - Data Saving Documentation

## 概述
水桶游戏（Bucket Game）是一个基于物理引擎的数学认知任务。参与者需要观察天平两侧的水量，判断等式是否成立。该任务基于Phaser游戏引擎开发，测量数学推理能力、等量概念理解和决策速度。

## 数据保存机制

### 保存端点
- **主要端点**: `POST /save`
- **备用机制**: 本地JSON文件下载

### 数据保存流程
```javascript
$.ajax({
    type: "POST",
    url: '/save',
    data: { "data": data },
    success: function(){ document.location = "/next" },
    dataType: "application/json",
    
    error: function(err) {
        if (err.status == 200){
            document.location = "/next";
        } else {
            // 本地保存备份
            setTimeout(function() { 
                var a = document.createElement('a');
                a.title = "下载";
                a.download = 'bucket-game_result.json';
                a.href = 'data:' + data;
                $("#download").click(function(){
                    $("body").append(a);
                    a.click();
                });
            }, 2000);
        }
    }
});
```

## 数据结构

### 游戏框架数据
使用自定义数据收集系统，每次试次后记录详细数据：

### 试次记录函数
```javascript
function sendData(trial) {
    inputData('trial', trial);
    this.taskdata.push(this.data);
    
    if (data.finished == 1) {
        // 序列化所有数据并保存
        var data = JSON.stringify(this.taskdata);
    }
    this.data = {}; // 重置当前试次数据
}
```

### 核心数据字段
```javascript
function save(curr_trial) {
    // 反应记录
    if (this.buttonPressed == 'equal') {
        this.logger.inputData('answer', 0);  // 0 = 相等
    } else {
        this.logger.inputData('answer', 1);  // 1 = 不相等
    }
    
    // 问题信息
    this.logger.inputData('problem', [this.problem[0],' + ',this.problem[1],' = ',this.ballsToDrop].join(""));
    this.logger.inputData('RT', this.RT/1000);         // 反应时间（秒）
    this.logger.inputData('n1', parseInt(this.problem[0]));      // 第一个操作数
    this.logger.inputData('n2', parseInt(this.problem[1]));      // 第二个操作数
    this.logger.inputData('solution', parseInt(this.problem[2])); // 正确答案
    this.logger.inputData('problem_id', parseInt(this.problem[3])); // 问题ID
    
    // 表现数据
    this.logger.inputData('points', this.points);      // 当前得分
    this.logger.inputData('ACC', this.answer == 'correct' ? 1 : 0); // 正确性
    this.logger.inputData('finished', this.trial >= this.op1s.length && this.answer == 'correct' ? 1 : 0);
}
```

## 认知测量维度

### 数学认知评估
- **数量概念**: 理解数字与物理量的对应关系
- **等量推理**: 判断数学等式的正确性
- **加法运算**: 基础算术运算能力
- **数量比较**: 比较不同数量的相对大小

### 视觉空间认知
- **空间推理**: 理解天平平衡的物理原理
- **视觉估算**: 通过水位高度估计数量
- **图形解读**: 解读刻度和数字显示
- **物理直觉**: 理解重量和平衡的关系

### 决策与反应控制
- **反应选择**: 在相等/不相等间做出选择
- **决策速度**: 快速准确的判断能力
- **冲动控制**: 避免匆忙做出错误判断
- **认知灵活性**: 适应不同难度的问题

## 实验设计特点

### 视觉呈现系统
- **天平装置**: 左右两个天平臂，中央支点
- **水量显示**: 三个量筒显示不同的水位
- **数值标记**: 实时显示各容器的数值
- **刻度系统**: 精确的测量刻度标记

### 物理引擎集成
```javascript
// Phaser物理系统配置
this.game.physics.startSystem(Phaser.Physics.P2JS);
this.game.physics.p2.restitution = 0.1;
this.game.physics.p2.gravity.y = 600;

// 天平动画效果
function adjustBalance() {
    weightDiff = ((this.balance[0].weight - this.balance[1].weight) / this.balanceFriction);
    angDiff = (-weightDiff) / 4;
    
    // 左右天平臂的位置调整
    balanceTweenComp = this.game.add.tween(this.balance[0]).to({y: weightDiff}, 1000);
    balanceTweenUser = this.game.add.tween(this.balance[1]).to({y: -weightDiff}, 1000);
}
```

### 问题生成算法
- **等量试次**: 左侧两个数的和等于右侧数量
- **不等试次**: 左侧两个数的和不等于右侧数量  
- **自适应难度**: 错误答案会重复出现直到正确
- **平衡设计**: 相等和不相等试次随机分布

### 反馈机制
- **即时反馈**: 答题后立即显示正确/错误
- **得分系统**: 正确+1分，错误-1分
- **连续奖励**: 连续正确3、7、12次获得额外奖励
- **视觉动画**: 天平倾斜动画增强理解

## 临床应用价值

### 数学学习障碍评估
- **计算能力**: 基础加法运算的自动化程度
- **数量概念**: 数字符号与实际数量的联系能力
- **等价理解**: 理解等号的真实含义
- **推理能力**: 从视觉信息推导数学关系

### 认知发展评估
- **守恒概念**: Piaget认知发展理论中的数量守恒
- **抽象思维**: 从具体物理量转向抽象数字概念
- **逻辑推理**: 基于规则进行逻辑判断
- **注意集中**: 持续关注任务相关信息

### 适用人群
- **儿童发展**: 5-12岁数学概念发展评估
- **学习困难**: 数学学习障碍的诊断和干预
- **认知康复**: 脑损伤后的数学认知康复
- **教育评价**: 数学教学效果的客观测量

## 数据分析策略

### 基础性能指标
- **总体正确率**: 反映整体数学推理能力
- **平均反应时**: 认知处理速度和决策效率
- **得分变化**: 学习过程和任务适应性
- **完成试次数**: 任务坚持性和动机水平

### 错误模式分析
- **误判类型**: 
  - 将不等判断为相等
  - 将相等判断为不等
- **难度效应**: 不同数值大小对表现的影响
- **位置效应**: 左右天平臂位置对判断的影响
- **序列效应**: 前后试次间的相互影响

### 认知策略识别
- **数值策略**: 直接计算数字和进行比较
- **估算策略**: 基于视觉水位进行粗略估计
- **物理策略**: 理解天平平衡原理进行判断
- **混合策略**: 结合多种策略的复合判断

### 学习曲线分析
- **练习效应**: 跨试次的表现改进模式
- **疲劳效应**: 长时间游戏对表现的影响
- **适应速度**: 对游戏规则和界面的适应能力
- **错误修正**: 从错误中学习和改进的能力

## 技术实现特点

### Phaser游戏引擎
- **Canvas渲染**: 高性能的2D图形渲染
- **物理模拟**: Box2D物理引擎模拟真实天平
- **动画系统**: 流畅的视觉过渡和反馈效果
- **交互管理**: 响应式的按钮和用户输入

### 数据收集架构
```javascript
// 全局数据对象
this.data = {}          // 当前试次数据
this.taskdata = []      // 所有试次数据集合

// 数据输入函数
function inputData(field, value) {
    this.data[field] = value
}

// 数据发送函数
function sendData(trial) {
    inputData('trial', trial)
    this.taskdata.push(this.data);
}
```

### 自适应机制
- **错误重复**: 错误回答的问题自动加入队列末尾
- **难度调节**: 根据表现动态调整问题难度
- **终止条件**: 所有问题正确回答后才能结束
- **进度跟踪**: 实时显示当前进度和得分

## 注意事项

### 施测环境要求
- **设备兼容**: 支持现代浏览器的设备
- **屏幕尺寸**: 推荐至少960×600像素分辨率
- **网络条件**: 稳定的网络连接用于数据保存
- **操作设备**: 鼠标或触摸屏进行点击操作

### 数据质量控制
- **反应时筛选**: 识别异常快速或缓慢的反应
- **正确率阈值**: 设定最低正确率要求
- **完成度检查**: 确保参与者完成规定试次
- **策略一致性**: 检查反应模式的合理性

### 结果解释注意
- **年龄差异**: 考虑不同年龄段的认知发展水平
- **经验影响**: 之前的数学学习经验对表现的影响
- **注意问题**: 区分数学能力缺陷和注意力问题
- **动机因素**: 游戏化元素对内在动机的促进作用

### 教学应用建议
- **概念教学**: 利用视觉化帮助理解抽象数学概念
- **练习巩固**: 通过重复练习增强基础运算技能
- **差异教学**: 根据个体表现调整教学难度和策略
- **进度监控**: 定期使用该任务评估学习进展