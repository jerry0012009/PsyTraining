# 认知训练系统 - 游戏集成指南

这是一个专业的认知训练系统，采用解耦架构设计，支持快速集成各种HTML小游戏。本文档将指导您如何将新游戏集成到认知训练框架中。

## 📖 目录

1. [系统架构概览](#系统架构概览)
2. [游戏集成流程](#游戏集成流程)
3. [代码规范要求](#代码规范要求)
4. [文件结构规范](#文件结构规范)
5. [数据格式标准](#数据格式标准)
6. [认知功能分析框架](#认知功能分析框架)
7. [测试验证流程](#测试验证流程)
8. [常见问题解决](#常见问题解决)

## 🏗️ 系统架构概览

### 核心设计理念
- **完全解耦** - 训练系统与游戏系统独立运行
- **统一接口** - 所有游戏通过统一API与训练系统交互
- **数据驱动** - 基于游戏数据进行认知功能分析
- **用户友好** - 用户看到简洁的游戏界面，后台进行专业分析

### 系统组件

```
认知训练系统/
├── game-template/           # 🎮 通用训练系统（核心框架）
│   ├── template.html       # 训练界面模板
│   ├── template.css        # 训练界面样式
│   └── template.js         # 训练逻辑控制器
├── games/                  # 🎯 游戏目录
│   ├── snake/             # Snake游戏（参考实现）
│   │   ├── game.html      # 游戏HTML组件
│   │   ├── game.css       # 游戏样式
│   │   └── game.js        # 游戏逻辑系统
│   └── [新游戏]/           # 待集成的新游戏
├── [游戏名]-game.html      # 🖥️ 游戏页面
├── index.html              # 🏠 主页
└── README.md              # 📖 集成指南
```

## 🚀 游戏集成流程

### 第一步：准备工作

#### 1.1 获取游戏源码
- 确保游戏是基于HTML/CSS/JavaScript的小游戏
- 游戏应该有明确的开始/结束状态
- 游戏应该有可记录的交互事件（按键、点击、得分等）

#### 1.2 分析游戏特点
- **游戏类型**：反应类、策略类、记忆类、空间类等
- **核心交互**：按键操作、鼠标操作、触摸操作等
- **关键事件**：得分、失败、完成关卡、时间节点等
- **认知需求**：注意力、记忆、执行功能、空间认知等

### 第二步：创建游戏目录

```bash
games/
└── [游戏名]/
    ├── game.html          # 游戏界面组件
    ├── game.css           # 游戏样式文件
    └── game.js            # 游戏逻辑系统
```

### 第三步：实现游戏类结构

```javascript
/**
 * 游戏类模板 - 必须实现的核心结构
 */
class YourGame {
    constructor() {
        // 游戏状态管理
        this.gameState = {
            isRunning: false,
            isPaused: false,
            currentRound: 0,
            score: 0,
            // 游戏特定状态...
        };
        
        // 数据记录系统
        this.gameData = {
            rounds: [],
            currentRoundData: null,
            // 游戏特定数据...
        };
        
        this.initializeGame();
        this.bindEvents();
    }

    // 必须实现的核心方法
    initializeGame() {
        // 监听训练系统事件
        window.addEventListener('trainingSystemEvent', (event) => {
            this.handleTrainingEvent(event.detail);
        });
    }

    handleTrainingEvent(eventDetail) {
        const { event } = eventDetail;
        
        switch (event) {
            case 'training_start':
                this.startFirstRound();
                break;
            case 'training_pause':
                this.pauseGame();
                break;
            case 'training_resume':
                this.resumeGame();
                break;
            case 'training_end':
                this.endAllRounds();
                break;
        }
    }

    reportToTrainingSystem() {
        const report = {
            gameType: 'your_game_name',
            currentRound: this.gameState.currentRound,
            roundData: this.gameData.currentRoundData,
            totalStats: {
                // 基础统计数据
            },
            cognitiveMetrics: this.calculateCognitiveMetrics()
        };
        
        if (window.TrainingAPI) {
            TrainingAPI.reportGameData(report);
        }
    }

    calculateCognitiveMetrics() {
        // 实现认知功能分析
        // 详见"认知功能分析框架"部分
    }
}
```

### 第四步：创建游戏页面

创建 `[游戏名]-game.html` 文件：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[游戏名] - 心理测量训练</title>
    <link rel="stylesheet" href="game-template/template.css">
    <link rel="stylesheet" href="games/[游戏名]/game.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="game-platform">
        <!-- 顶部控制栏 -->
        <div class="control-bar">
            <div class="control-left">
                <button id="back-btn" class="btn btn-back">
                    <i class="fas fa-arrow-left"></i>
                    返回
                </button>
                <h1 id="game-title" class="game-title">[游戏名]</h1>
            </div>
            <div class="control-right">
                <div class="timer-display">
                    <i class="fas fa-clock"></i>
                    <span id="timer">00:00</span>
                </div>
                <button id="pause-btn" class="btn btn-pause">
                    <i class="fas fa-play"></i>
                    开始训练
                </button>
                <button id="end-btn" class="btn btn-end" disabled>
                    <i class="fas fa-stop"></i>
                    结束训练
                </button>
            </div>
        </div>

        <!-- 游戏容器 -->
        <div class="game-container">
            <div id="game-content" class="game-content">
                <!-- 在这里嵌入游戏HTML -->
                <!-- 从 games/[游戏名]/game.html 复制内容 -->
                
                <!-- 游戏说明 -->
                <div class="game-instruction">
                    <p><strong>🎮 游戏说明</strong></p>
                    <p>游戏操作说明...</p>
                    <p>🎯 训练目标...</p>
                    <p>📊 训练结束后控制台将输出详细的游戏数据</p>
                </div>
            </div>
        </div>

        <!-- 底部信息栏 -->
        <div class="info-bar">
            <div class="session-info">
                <span>训练状态: <span id="game-status">准备中</span></span>
            </div>
            <div class="score-info">
                <span>当前得分: <span id="current-score">0</span></span>
            </div>
        </div>
    </div>

    <script src="game-template/template.js"></script>
    <script src="games/[游戏名]/game.js"></script>
</body>
</html>
```

### 第五步：更新主页

在 `index.html` 中添加新游戏卡片：

```html
<div class="game-card">
    <div class="game-icon">
        <i class="fas fa-[图标名]"></i>
    </div>
    <h3>[游戏名]</h3>
    <p>[游戏描述...]</p>
    <a href="[游戏名]-game.html" class="game-btn">
        <i class="fas fa-play"></i>
        开始训练
    </a>
</div>
```

## 📋 代码规范要求

### 3.1 命名规范

```javascript
// 类名：Pascal命名法
class SnakeGame { }
class MemoryGame { }

// 方法名：camelCase命名法
handleKeyDown() { }
calculateCognitiveMetrics() { }

// 文件名：kebab-case命名法
memory-game.html
reaction-time.js
spatial-navigation.css
```

### 3.2 必须实现的方法

```javascript
class YourGame {
    // 🔴 必须实现
    handleTrainingEvent(eventDetail) { }    // 处理训练系统事件
    reportToTrainingSystem() { }            // 报告数据给训练系统
    calculateCognitiveMetrics() { }         // 计算认知功能指标
    
    // 🟡 建议实现
    startFirstRound() { }                   // 开始第一轮
    startNewRound() { }                     // 开始新一轮
    endCurrentRound() { }                   // 结束当前轮
    pauseGame() { }                         // 暂停游戏
    resumeGame() { }                        // 恢复游戏
    endAllRounds() { }                      // 结束所有轮次
    
    // 🟢 游戏特定方法
    // 根据游戏类型实现...
}
```

### 3.3 事件处理规范

```javascript
// 阻止默认行为（重要！）
handleKeyDown(event) {
    // 阻止页面滚动等默认行为
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.key)) {
        event.preventDefault();
    }
    
    // 游戏逻辑...
}

// 只记录关键事件
recordEvent(type, data = {}) {
    if (this.gameData.currentRoundData) {
        this.gameData.currentRoundData.events.push({
            timestamp: Date.now(),
            type: type,
            data: data
        });
    }
}
```

## 📁 文件结构规范

### 4.1 游戏目录结构

```
games/[游戏名]/
├── game.html              # 游戏UI组件（核心游戏界面）
├── game.css               # 游戏专用样式
├── game.js                # 游戏逻辑（主要文件）
├── assets/                # 游戏资源（可选）
│   ├── images/
│   ├── sounds/
│   └── fonts/
└── docs/                  # 游戏文档（可选）
    ├── game-rules.md
    └── cognitive-analysis.md
```

### 4.2 样式文件规范

```css
/* games/[游戏名]/game.css */

/* 游戏容器样式 */
.[游戏名]-game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 500px;
    padding: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
    /* 移动端适配 */
}

/* 游戏状态提示 */
.game-instruction {
    text-align: center;
    margin-top: 1rem;
    color: #6e7888;
    font-size: 0.9rem;
}
```

## 📊 数据格式标准

### 5.1 游戏报告数据结构

```javascript
const gameReport = {
    // 基础信息
    gameType: 'game_name',           // 游戏类型标识
    currentRound: 1,                 // 当前轮次
    
    // 轮次数据
    roundData: {
        roundNumber: 1,              // 轮次编号
        startTime: 1640995200000,    // 开始时间戳
        endTime: 1640995260000,      // 结束时间戳
        duration: 60000,             // 持续时间(ms)
        score: 150,                  // 得分
        events: [                    // 关键事件记录
            {
                timestamp: 1640995210000,
                type: 'key_press',
                data: { key: 'ArrowUp' }
            },
            {
                timestamp: 1640995220000,
                type: 'score_change',
                data: { oldScore: 10, newScore: 20 }
            }
        ],
        // 游戏特定数据...
        gameSpecificData: {
            // 根据游戏类型添加特定字段
        }
    },
    
    // 总体统计
    totalStats: {
        totalRounds: 5,              // 总轮数
        totalScore: 750,             // 总得分
        avgScore: 150,               // 平均得分
        maxScore: 200,               // 最高得分
        // 游戏特定统计...
    },
    
    // 认知功能分析
    cognitiveMetrics: {
        // 详见认知功能分析框架
    }
};
```

### 5.2 事件记录标准

```javascript
// 常见事件类型
const EVENT_TYPES = {
    // 通用事件
    'round_started': '轮次开始',
    'round_ended': '轮次结束', 
    'game_paused': '游戏暂停',
    'game_resumed': '游戏恢复',
    'score_changed': '得分变化',
    
    // 交互事件
    'key_press': '按键',
    'mouse_click': '鼠标点击',
    'touch_event': '触摸事件',
    
    // 游戏特定事件
    'collision': '碰撞',
    'target_hit': '目标命中',
    'level_completed': '关卡完成',
    'mistake_made': '操作错误',
    
    // 认知相关事件
    'attention_shift': '注意力转移',
    'decision_made': '决策制定',
    'pattern_recognized': '模式识别'
};
```

## 🧠 认知功能分析框架

### 6.1 五大认知领域

```javascript
const cognitiveMetrics = {
    // 1. 执行功能 (Executive Function)
    executiveFunction: {
        planningAbility: {
            // 计划能力指标
            avgPlanningTime: 0,      // 平均规划时间
            planningAccuracy: 0,     // 规划准确性
            strategicThinking: 0     // 策略思维
        },
        cognitiveFlexibility: {
            // 认知灵活性指标
            adaptabilityIndex: 0,    // 适应性指数
            ruleShiftingAbility: 0,  // 规则转换能力
            taskSwitchingSpeed: 0    // 任务切换速度
        },
        impulseControl: {
            // 冲动控制指标
            inhibitionAbility: 0,    // 抑制能力
            errorRate: 0,           // 错误率
            controlStability: 0      // 控制稳定性
        }
    },
    
    // 2. 注意力功能 (Attention)
    attention: {
        sustainedAttention: {
            // 持续注意力
            attentionSpan: 0,        // 注意力持续时间
            vigilanceDecrement: 0,   // 警觉性下降
            consistencyIndex: 0      // 一致性指数
        },
        selectiveAttention: {
            // 选择性注意力
            distractorResistance: 0, // 抗干扰能力
            focusAccuracy: 0,        // 聚焦准确性
            attentionShifting: 0     // 注意力转移
        },
        dividedAttention: {
            // 分散注意力
            multitaskingAbility: 0,  // 多任务能力
            resourceAllocation: 0,   // 资源分配
            performanceDecrement: 0  // 性能下降
        }
    },
    
    // 3. 学习与记忆 (Learning & Memory)
    learningMemory: {
        workingMemory: {
            // 工作记忆
            memorySpan: 0,           // 记忆广度
            memoryUpdating: 0,       // 记忆更新
            memoryCapacity: 0        // 记忆容量
        },
        learningAbility: {
            // 学习能力
            acquisitionRate: 0,      // 习得速度
            retentionRate: 0,        // 保持率
            transferAbility: 0       // 迁移能力
        },
        patternRecognition: {
            // 模式识别
            patternDetection: 0,     // 模式检测
            patternLearning: 0,      // 模式学习
            patternGeneralization: 0 // 模式泛化
        }
    },
    
    // 4. 处理速度 (Processing Speed)
    processingSpeed: {
        reactionTime: {
            // 反应时间
            simpleReactionTime: 0,   // 简单反应时
            choiceReactionTime: 0,   // 选择反应时
            reactionConsistency: 0   // 反应一致性
        },
        decisionMaking: {
            // 决策制定
            decisionSpeed: 0,        // 决策速度
            decisionAccuracy: 0,     // 决策准确性
            speedAccuracyTradeoff: 0 // 速度-准确性权衡
        },
        informationProcessing: {
            // 信息处理
            processingEfficiency: 0, // 处理效率
            cognitiveLoad: 0,        // 认知负荷
            throughputRate: 0        // 吞吐率
        }
    },
    
    // 5. 空间认知 (Spatial Cognition)
    spatialCognition: {
        spatialMemory: {
            // 空间记忆
            spatialSpan: 0,          // 空间广度
            spatialUpdating: 0,      // 空间更新
            spatialRetention: 0      // 空间保持
        },
        spatialOrientation: {
            // 空间定向
            orientationAccuracy: 0,  // 定向准确性
            navigationAbility: 0,    // 导航能力
            spatialMapping: 0        // 空间制图
        },
        visualSpatialSkills: {
            // 视空间技能
            mentalRotation: 0,       // 心理旋转
            spatialVisualization: 0, // 空间可视化
            spatialReasoning: 0      // 空间推理
        }
    }
};
```

### 6.2 认知指标计算方法

```javascript
calculateCognitiveMetrics() {
    // 基础数据提取
    const rounds = this.gameData.rounds;
    const scores = rounds.map(r => r.score);
    const durations = rounds.map(r => r.duration);
    const events = rounds.flatMap(r => r.events);
    
    // 计算辅助方法
    const calculateMean = (arr) => arr.reduce((sum, val) => sum + val, 0) / arr.length;
    const calculateStd = (arr) => {
        const mean = calculateMean(arr);
        const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
        return Math.sqrt(variance);
    };
    
    // 示例：注意力持续时间分析
    const sustainedAttention = {
        attentionSpan: calculateMean(durations) / 1000, // 平均注意力持续时间（秒）
        vigilanceDecrement: this.calculateVigilanceDecrement(scores),
        consistencyIndex: 1 - (calculateStd(scores) / calculateMean(scores))
    };
    
    // 示例：反应时间分析
    const reactionTimes = this.extractReactionTimes(events);
    const reactionTime = {
        simpleReactionTime: calculateMean(reactionTimes),
        choiceReactionTime: this.calculateChoiceReactionTime(events),
        reactionConsistency: 1 - (calculateStd(reactionTimes) / calculateMean(reactionTimes))
    };
    
    return {
        executiveFunction: { /* ... */ },
        attention: { sustainedAttention, /* ... */ },
        learningMemory: { /* ... */ },
        processingSpeed: { reactionTime, /* ... */ },
        spatialCognition: { /* ... */ },
        
        // 元数据
        analysisMetadata: {
            totalRounds: rounds.length,
            analysisTimestamp: new Date().toISOString(),
            dataQuality: this.assessDataQuality(rounds)
        }
    };
}
```

### 6.3 游戏类型与认知领域对应

| 游戏类型 | 主要认知领域 | 次要认知领域 | 关键指标 |
|---------|-------------|-------------|----------|
| **反应类游戏** | 处理速度 | 注意力 | 反应时间、准确性 |
| **策略类游戏** | 执行功能 | 学习记忆 | 规划能力、决策质量 |
| **记忆类游戏** | 学习记忆 | 注意力 | 记忆广度、保持率 |
| **空间类游戏** | 空间认知 | 执行功能 | 空间记忆、导航能力 |
| **注意力游戏** | 注意力 | 处理速度 | 持续注意、选择注意 |

## 🧪 测试验证流程

### 7.1 功能测试清单

```markdown
## 基础功能测试
- [ ] 游戏正常启动和初始化
- [ ] 训练系统事件响应正确
- [ ] 暂停/恢复功能正常
- [ ] 多轮游戏模式工作
- [ ] 数据记录完整
- [ ] 控制台输出JSON格式正确

## 界面测试
- [ ] 游戏界面适配训练模板
- [ ] 响应式设计正常
- [ ] 按钮状态变化正确
- [ ] 说明弹窗显示正常
- [ ] 结果页面显示完整

## 数据测试
- [ ] 事件记录准确
- [ ] 认知指标计算正确
- [ ] JSON输出格式规范
- [ ] 数据质量评估有效

## 性能测试
- [ ] 游戏运行流畅（>30fps）
- [ ] 内存使用合理
- [ ] 数据记录不影响性能
- [ ] 长时间训练稳定
```

### 7.2 认知指标验证

```javascript
// 数据质量检验
function validateCognitiveMetrics(metrics) {
    const checks = {
        // 数值范围检验
        valuesInRange: Object.values(metrics).every(domain => 
            Object.values(domain).every(category =>
                Object.values(category).every(value => 
                    typeof value === 'number' && value >= 0 && value <= 1
                )
            )
        ),
        
        // 逻辑一致性检验
        logicalConsistency: (
            metrics.processingSpeed.reactionTime.simpleReactionTime <= 
            metrics.processingSpeed.reactionTime.choiceReactionTime
        ),
        
        // 数据完整性检验
        dataCompleteness: Object.keys(metrics).length === 5
    };
    
    return checks;
}
```

### 7.3 集成测试脚本

```javascript
// 自动化测试脚本示例
class GameIntegrationTester {
    async testGameIntegration(gameName) {
        console.log(`开始测试游戏: ${gameName}`);
        
        // 1. 加载游戏页面
        await this.loadGamePage(gameName);
        
        // 2. 测试训练流程
        await this.testTrainingFlow();
        
        // 3. 验证数据输出
        await this.validateDataOutput();
        
        // 4. 检查认知指标
        await this.checkCognitiveMetrics();
        
        console.log(`游戏 ${gameName} 集成测试完成`);
    }
    
    async testTrainingFlow() {
        // 模拟用户操作序列
        await this.clickStartButton();
        await this.simulateGameplay(60000); // 1分钟游戏
        await this.clickEndButton();
        await this.checkResults();
    }
}
```

## ❓ 常见问题解决

### 8.1 技术问题

**Q: 游戏按键导致页面滚动怎么办？**
```javascript
// A: 在事件处理中阻止默认行为
handleKeyDown(event) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault(); // 阻止页面滚动
    }
    // 游戏逻辑...
}
```

**Q: 游戏运行卡顿怎么优化？**
```javascript
// A: 优化数据记录策略
recordEvent(type, data = {}) {
    // 只记录关键事件，避免高频记录
    if (this.isKeyEvent(type)) {
        // 限制记录频率
        if (Date.now() - this.lastRecordTime < 100) return;
        this.lastRecordTime = Date.now();
    }
    
    this.gameData.currentRoundData.events.push({
        timestamp: Date.now(),
        type: type,
        data: data
    });
}
```

**Q: 认知指标计算结果异常怎么调试？**
```javascript
// A: 添加调试和验证机制
calculateCognitiveMetrics() {
    const metrics = this.computeMetrics();
    
    // 调试输出
    console.log('原始数据:', this.gameData.rounds);
    console.log('计算结果:', metrics);
    
    // 数据验证
    const validation = this.validateMetrics(metrics);
    if (!validation.isValid) {
        console.warn('认知指标异常:', validation.errors);
    }
    
    return metrics;
}
```

### 8.2 设计问题

**Q: 如何平衡游戏趣味性和数据收集？**
- 保持游戏核心玩法不变
- 在不影响体验的情况下记录关键数据
- 通过多轮游戏获取充足的分析数据
- 设计合理的训练时长（建议3-10分钟）

**Q: 如何确定游戏的认知评估重点？**
```javascript
// 根据游戏特点确定主要认知领域
const gameCognitiveMapping = {
    'snake': ['executiveFunction', 'attention', 'spatialCognition'],
    'memory-cards': ['learningMemory', 'attention'],
    'reaction-time': ['processingSpeed', 'attention'],
    'puzzle': ['executiveFunction', 'spatialCognition'],
    'rhythm': ['processingSpeed', 'attention']
};
```

**Q: 如何处理不同难度级别的游戏？**
```javascript
// 在认知分析中考虑难度因素
calculateCognitiveMetrics() {
    const difficultyFactor = this.getCurrentDifficulty();
    const baseMetrics = this.computeBaseMetrics();
    
    // 根据难度调整指标
    return this.adjustMetricsForDifficulty(baseMetrics, difficultyFactor);
}
```

## 📚 参考资源

### 游戏示例
- **Snake游戏** - `games/snake/` - 完整的参考实现
- **更多示例** - 后续将添加其他类型游戏示例

### 认知心理学参考
- **执行功能评估** - Wisconsin Card Sorting Test, Tower of London
- **注意力评估** - Continuous Performance Test, Attention Network Test  
- **记忆评估** - N-Back Task, Span Tasks
- **处理速度评估** - Simple/Choice Reaction Time Tasks

### 技术文档
- **TrainingAPI接口** - `game-template/template.js`
- **数据格式规范** - 本文档第5节
- **认知分析框架** - 本文档第6节

---

## 🎯 快速开始新游戏集成

1. **复制Snake游戏目录结构**
2. **替换游戏核心逻辑**  
3. **实现必需的接口方法**
4. **设计认知功能分析**
5. **创建游戏页面文件**
6. **更新主页游戏列表**
7. **执行集成测试验证**

按照本指南，您可以快速、标准化地将任何HTML小游戏集成到认知训练系统中，确保数据质量和用户体验的一致性。

**下一步：** 选择您要集成的游戏，按照流程开始实施！🚀 # Force redeploy 2025年09月 4日  1:32:04
