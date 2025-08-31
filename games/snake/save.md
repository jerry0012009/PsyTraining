# Save Data Documentation - Snake Game

## 数据输出格式

### 基本信息
- **框架**: Canvas + HTML5游戏引擎
- **输出格式**: JSON对象
- **保存机制**: TrainingAPI集成，输出到浏览器控制台
- **游戏类型**: 经典贪吃蛇认知训练游戏
- **集成系统**: PsyTraining认知训练平台

## 保存流程

1. **实时数据收集**: 游戏过程中记录移动、食物获取等事件
2. **轮次结束**: 游戏结束时汇总统计数据和认知指标
3. **系统集成**: 通过TrainingAPI报告给训练系统
4. **控制台输出**: 最终认知评估数据输出到浏览器控制台

```javascript
// 数据报告流程示例
reportToTrainingSystem() {
    const report = {
        gameType: 'snake',
        currentRound: this.gameState.currentRound,
        roundData: this.gameData.currentRoundData,
        totalStats: this.calculateTotalStats(),
        cognitiveMetrics: this.calculateCognitiveMetrics()
    };
    
    if (window.TrainingAPI) {
        TrainingAPI.reportGameData(report);
    }
}
```

## 数据结构

### 游戏状态字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `gameType` | string | 游戏类型标识 ("snake") |
| `currentRound` | number | 当前轮次编号 |
| `isRunning` | boolean | 游戏是否正在运行 |
| `isPaused` | boolean | 游戏是否暂停 |
| `score` | number | 当前得分 |
| `snakeLength` | number | 蛇的当前长度 |
| `gameSpeed` | number | 游戏速度(毫秒/帧) |

### 轮次数据字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `roundNumber` | number | 轮次编号 |
| `startTime` | number | 开始时间戳 |
| `endTime` | number | 结束时间戳 |
| `duration` | number | 持续时间 (毫秒) |
| `finalScore` | number | 最终得分 |
| `foodEaten` | number | 吃到的食物数量 |
| `maxLength` | number | 蛇的最大长度 |
| `directionChanges` | number | 方向改变次数 |
| `collisionType` | string | 碰撞类型 ("wall"/"self"/"none") |
| `events` | array | 详细事件记录 |

### 事件记录字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `timestamp` | number | 事件时间戳 |
| `type` | string | 事件类型 |
| `data` | object | 事件相关数据 |

### 事件类型
- `round_started`: 轮次开始
- `round_ended`: 轮次结束
- `direction_change`: 方向改变
- `food_eaten`: 吃到食物
- `collision`: 发生碰撞
- `speed_increase`: 速度提升

## 示例数据

### JSON格式输出示例

```json
{
  "gameType": "snake",
  "currentRound": 1,
  "roundData": {
    "roundNumber": 1,
    "startTime": 1640995200000,
    "endTime": 1640995380000,
    "duration": 180000,
    "finalScore": 150,
    "foodEaten": 15,
    "maxLength": 18,
    "directionChanges": 45,
    "collisionType": "wall",
    "events": [
      {
        "timestamp": 1640995200100,
        "type": "round_started",
        "data": {}
      },
      {
        "timestamp": 1640995205234,
        "type": "direction_change",
        "data": { "from": "right", "to": "down" }
      },
      {
        "timestamp": 1640995210456,
        "type": "food_eaten",
        "data": { "score": 10, "length": 4, "position": {"x": 5, "y": 3} }
      },
      {
        "timestamp": 1640995380000,
        "type": "collision",
        "data": { "type": "wall", "position": {"x": 0, "y": 5} }
      }
    ]
  },
  "totalStats": {
    "totalRounds": 1,
    "totalScore": 150,
    "totalFoodEaten": 15,
    "avgScore": 150,
    "avgSurvivalTime": 180.0,
    "bestRound": 1
  },
  "cognitiveMetrics": {
    "spatialCognition": {
      "spatialMemory": {
        "pathTracking": 0.75,
        "spatialOrientation": 0.82,
        "locationMemory": 0.68
      },
      "visualSpatial": {
        "spatialPlanning": 0.70,
        "mentalRotation": 0.65,
        "spatialWorking": 0.73
      }
    },
    "executiveFunction": {
      "planningAbility": {
        "strategicPlanning": 0.72,
        "pathOptimization": 0.68,
        "goalDirected": 0.75
      },
      "impulseControl": {
        "inhibitionControl": 0.65,
        "responseControl": 0.70
      },
      "cognitiveFlexibility": {
        "taskSwitching": 0.68,
        "adaptability": 0.72
      }
    },
    "attention": {
      "sustainedAttention": {
        "focusMaintenance": 0.78,
        "vigilance": 0.75
      },
      "selectiveAttention": {
        "targetDetection": 0.85,
        "distractorIgnoring": 0.70
      }
    },
    "processingSpeed": {
      "reactionTime": {
        "avgResponseTime": 0.45,
        "responseVariability": 0.25
      },
      "decisionSpeed": {
        "directionDecisions": 0.38,
        "planningSpeed": 0.52
      }
    },
    "learningMemory": {
      "proceduralLearning": {
        "skillAcquisition": 0.68,
        "performanceImprovement": 0.72
      },
      "workingMemory": {
        "spatialWorkingMemory": 0.73,
        "sequentialMemory": 0.67
      }
    },
    "analysisMetadata": {
      "totalRounds": 1,
      "analysisTimestamp": "2024-01-01T12:03:00.000Z",
      "dataQuality": {
        "score": 0.33,
        "level": "较差",
        "recommendation": "建议至少进行3轮游戏以获得更可靠的认知评估"
      }
    }
  }
}
```

## 认知指标评估

### 空间认知 (spatialCognition)

**空间记忆 (spatialMemory)**
- `pathTracking`: 路径追踪能力 (基于移动效率)
- `spatialOrientation`: 空间定向能力 (方向改变的合理性)
- `locationMemory`: 位置记忆 (避免重复路径的能力)

**视觉空间 (visualSpatial)**
- `spatialPlanning`: 空间规划能力 (路径规划效率)
- `mentalRotation`: 心理旋转 (方向转换的灵活性)
- `spatialWorking`: 空间工作记忆 (复杂路径的处理)

### 执行功能 (executiveFunction)

**规划能力 (planningAbility)**
- `strategicPlanning`: 策略规划 (长期路径规划)
- `pathOptimization`: 路径优化 (效率最大化)
- `goalDirected`: 目标导向 (食物获取策略)

**冲动控制 (impulseControl)**
- `inhibitionControl`: 抑制控制 (避免冲动移动)
- `responseControl`: 反应控制 (按键控制精度)

**认知灵活性 (cognitiveFlexibility)**
- `taskSwitching`: 任务转换 (策略调整能力)
- `adaptability`: 适应性 (应对复杂情况)

### 注意力 (attention)

**持续注意 (sustainedAttention)**
- `focusMaintenance`: 注意维持 (游戏持续时间)
- `vigilance`: 警觉性 (危险检测能力)

**选择性注意 (selectiveAttention)**
- `targetDetection`: 目标检测 (食物识别速度)
- `distractorIgnoring`: 干扰忽略 (抗干扰能力)

### 处理速度 (processingSpeed)

**反应时间 (reactionTime)**
- `avgResponseTime`: 平均反应时间
- `responseVariability`: 反应时间变异性

**决策速度 (decisionSpeed)**
- `directionDecisions`: 方向决策速度
- `planningSpeed`: 规划速度

### 学习记忆 (learningMemory)

**程序性学习 (proceduralLearning)**
- `skillAcquisition`: 技能获得 (跨轮次改善)
- `performanceImprovement`: 表现提升率

**工作记忆 (workingMemory)**
- `spatialWorkingMemory`: 空间工作记忆
- `sequentialMemory`: 序列记忆

## 游戏机制

### 控制系统
- **方向控制**: 方向键控制蛇的移动方向
- **防反向**: 防止蛇反向移动造成自撞
- **连续移动**: 蛇持续向当前方向移动

### 游戏规则
- **食物系统**: 随机生成食物，吃到后蛇身增长，得分增加
- **碰撞检测**: 撞墙或撞到自己身体游戏结束
- **速度递增**: 随着蛇身增长，移动速度逐渐加快

### 认知挑战
- **空间规划**: 需要提前规划移动路径
- **记忆负荷**: 记住蛇身位置避免自撞
- **注意分配**: 同时关注食物位置和障碍物
- **认知灵活**: 根据情况调整策略

## 临床/研究应用

### 空间认知评估
- **空间导航**: 评估空间导航和路径规划能力
- **空间记忆**: 测量空间位置和路径的记忆能力
- **空间推理**: 评估空间关系的理解和推理

### 执行功能训练
- **规划训练**: 提高前瞻性规划和策略制定能力
- **冲动控制**: 训练抑制不当反应的能力
- **认知灵活性**: 增强认知切换和适应能力

### 注意力训练
- **持续注意**: 训练长时间保持注意集中
- **分配注意**: 训练同时处理多个信息源
- **选择性注意**: 提高重要信息的识别和筛选

### 神经心理应用
- **前额叶功能**: 执行控制和工作记忆评估
- **顶叶功能**: 空间注意和空间认知评估
- **认知康复**: 脑损伤后认知功能恢复训练

## 数据分析方法

### 空间认知指标

```javascript
// 空间认知计算示例
calculatePathEfficiency() {
    // 路径效率 = 食物数量 / 移动步数
    return this.gameData.currentRoundData.foodEaten / 
           this.gameData.currentRoundData.directionChanges;
}

calculateSpatialPlanning() {
    // 空间规划能力基于路径优化程度
    const directPaths = this.calculateDirectPathRatio();
    const pathEfficiency = this.calculatePathEfficiency();
    return (directPaths + pathEfficiency) / 2;
}

calculateMemoryLoad() {
    // 记忆负荷基于蛇身长度和生存时间
    const avgLength = this.gameData.currentRoundData.maxLength / 2;
    const memoryChallenge = Math.min(avgLength / 10, 1.0);
    return memoryChallenge;
}
```

### 执行功能分析
- **规划效率**: 食物获取路径的优化程度
- **冲动控制**: 避免危险移动的成功率
- **策略调整**: 面对困难时的策略改变能力

### 学习曲线分析
- **技能获得**: 跨轮次的得分提升
- **策略优化**: 移动效率的改善
- **适应速度**: 达到稳定表现的轮次数

## 质量控制标准

### 数据有效性
- **最小游戏时间**: 每轮至少30秒
- **最小移动数**: 至少10次方向改变
- **合理表现**: 得分在预期范围内
- **非随机**: 移动模式显示策略性

### 技术质量
- **帧率稳定**: 保证游戏流畅运行
- **输入响应**: 确保按键响应及时
- **碰撞准确**: 碰撞检测算法准确

## 注意事项

1. **游戏理解**: 确保参与者理解基本规则和控制方式
2. **练习机会**: 提供充分练习以熟悉操作
3. **难度适应**: 根据参与者能力调整游戏速度
4. **疲劳管理**: 控制游戏时长避免疲劳效应
5. **动机维持**: 保持游戏的挑战性和趣味性
6. **个体差异**: 考虑年龄、游戏经验等因素

## 数据预处理建议

### 异常值处理
- **异常短游戏**: <10秒的游戏可能为意外结束
- **异常高分**: 排除可能的作弊或bug
- **零移动**: 完全无操作的记录
- **重复模式**: 明显的重复移动模式

### 学习效应控制
- **练习效应**: 前几轮可能存在明显的学习提升
- **疲劳效应**: 长时间游戏后的表现下降
- **策略稳定**: 识别策略稳定后的轮次

### 个体化评估
- **基线建立**: 使用初期轮次建立个体基线
- **相对改善**: 计算相对于基线的改善程度
- **特征识别**: 识别个体特有的游戏策略和模式
- **能力估计**: 综合多轮表现估计认知能力水平

### 报告建议
- **综合指标**: 提供各认知域的综合评估
- **强项弱项**: 识别个体的认知优势和劣势
- **训练建议**: 基于评估结果提供针对性训练建议
- **进步追踪**: 跨时间点的认知能力变化追踪