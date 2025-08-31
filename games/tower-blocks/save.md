# Save Data Documentation - Tower Blocks Game

## 数据输出格式

### 基本信息
- **框架**: HTML5 Canvas + TypeScript/JavaScript
- **输出格式**: JSON对象
- **保存机制**: 可能集成TrainingAPI或独立保存
- **游戏类型**: 堆叠方块技能训练游戏
- **集成系统**: 可能集成到PsyTraining认知训练平台

## 保存流程

1. **实时数据记录**: 游戏过程中记录方块投放、堆叠精度等数据
2. **关卡结束**: 每个关卡结束时汇总表现数据
3. **游戏完成**: 全部关卡完成后生成综合评估
4. **数据输出**: 输出JSON格式的认知评估数据

```javascript
// 数据保存流程示例
function saveGameData() {
    const gameData = {
        gameType: 'tower_blocks',
        sessionId: generateSessionId(),
        totalLevels: this.completedLevels,
        gameData: this.levelData,
        cognitiveMetrics: this.calculateCognitiveMetrics(),
        completionTime: Date.now() - this.startTime
    };
    
    // 输出到控制台或发送到服务器
    console.log('Tower Blocks Results:', JSON.stringify(gameData, null, 2));
    
    if (window.TrainingAPI) {
        TrainingAPI.reportGameData(gameData);
    }
}
```

## 数据结构

### 游戏状态字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `gameType` | string | 游戏类型标识 ("tower_blocks") |
| `sessionId` | string | 游戏会话ID |
| `currentLevel` | number | 当前关卡编号 |
| `totalLevels` | number | 完成的关卡总数 |
| `gameSpeed` | number | 方块下落速度 |
| `difficulty` | string | 难度等级 ("easy"/"medium"/"hard") |
| `totalScore` | number | 累积总分 |

### 关卡数据字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `levelNumber` | number | 关卡编号 |
| `startTime` | number | 关卡开始时间戳 |
| `endTime` | number | 关卡结束时间戳 |
| `duration` | number | 关卡持续时间 (毫秒) |
| `blocksPlaced` | number | 放置的方块数量 |
| `perfectStacks` | number | 完美堆叠次数 |
| `towerHeight` | number | 最终塔高 |
| `accuracy` | number | 堆叠精度 (0-1) |
| `stability` | number | 塔的稳定性 (0-1) |
| `reactionTimes` | array | 每次投放的反应时间 |
| `placements` | array | 详细的方块放置记录 |

### 方块放置记录

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `timestamp` | number | 放置时间戳 |
| `blockIndex` | number | 方块编号 |
| `targetPosition` | object | 目标位置坐标 |
| `actualPosition` | object | 实际投放位置 |
| `accuracy` | number | 投放精度 (0-1) |
| `reactionTime` | number | 反应时间 (毫秒) |
| `isStable` | boolean | 是否稳定放置 |

## 示例数据

### JSON格式输出示例

```json
{
  "gameType": "tower_blocks",
  "sessionId": "tb_20240101_120000",
  "totalLevels": 5,
  "completionTime": 420000,
  "gameData": [
    {
      "levelNumber": 1,
      "startTime": 1640995200000,
      "endTime": 1640995260000,
      "duration": 60000,
      "blocksPlaced": 10,
      "perfectStacks": 3,
      "towerHeight": 8,
      "accuracy": 0.75,
      "stability": 0.82,
      "reactionTimes": [1200, 950, 1100, 980, 1150, 870, 1050, 920, 1080, 940],
      "placements": [
        {
          "timestamp": 1640995205000,
          "blockIndex": 1,
          "targetPosition": {"x": 150, "y": 400},
          "actualPosition": {"x": 148, "y": 402},
          "accuracy": 0.95,
          "reactionTime": 1200,
          "isStable": true
        },
        {
          "timestamp": 1640995210000,
          "blockIndex": 2,
          "targetPosition": {"x": 150, "y": 350},
          "actualPosition": {"x": 155, "y": 348},
          "accuracy": 0.88,
          "reactionTime": 950,
          "isStable": true
        }
      ]
    }
  ],
  "cognitiveMetrics": {
    "visuospatialSkills": {
      "spatialAccuracy": {
        "overallAccuracy": 0.78,
        "consistencyIndex": 0.85,
        "precisionImprovement": 0.15
      },
      "spatialPlanning": {
        "planningEfficiency": 0.72,
        "strategicPlacement": 0.68,
        "adaptability": 0.75
      }
    },
    "executiveFunction": {
      "planningAbility": {
        "towerPlanning": 0.70,
        "sequentialPlanning": 0.73,
        "goalDirectedPlanning": 0.75
      },
      "impulseControl": {
        "timingControl": 0.68,
        "placementControl": 0.72
      },
      "workingMemory": {
        "spatialWorkingMemory": 0.75,
        "sequenceMemory": 0.70
      }
    },
    "processingSpeed": {
      "reactionTime": {
        "averageRT": 1025,
        "rtVariability": 125,
        "rtImprovement": -85
      },
      "decisionSpeed": {
        "placementDecisions": 0.82,
        "rapidDecisions": 0.78
      }
    },
    "motorSkills": {
      "finePrecision": {
        "placementPrecision": 0.78,
        "steadiness": 0.82,
        "coordination": 0.75
      },
      "timing": {
        "timingAccuracy": 0.73,
        "timingConsistency": 0.70
      }
    },
    "learningAdaptation": {
      "skillAcquisition": {
        "learningRate": 0.68,
        "performanceImprovement": 0.22,
        "plateauReached": false
      },
      "errorCorrection": {
        "errorRecovery": 0.75,
        "adaptiveAdjustment": 0.72
      }
    },
    "analysisMetadata": {
      "totalLevels": 5,
      "analysisTimestamp": "2024-01-01T12:07:00.000Z",
      "dataQuality": {
        "score": 0.88,
        "level": "良好",
        "recommendation": "数据质量良好，可进行可靠的认知功能分析"
      }
    }
  }
}
```

## 认知指标评估

### 视觉空间技能 (visuospatialSkills)

**空间精度 (spatialAccuracy)**
- `overallAccuracy`: 整体投放精度 (目标位置与实际位置的偏差)
- `consistencyIndex`: 一致性指数 (精度的稳定性)
- `precisionImprovement`: 精度改善程度 (学习效应)

**空间规划 (spatialPlanning)**
- `planningEfficiency`: 规划效率 (塔高与稳定性的平衡)
- `strategicPlacement`: 策略性放置 (长远规划能力)
- `adaptability`: 适应性 (应对困难情况的调整)

### 执行功能 (executiveFunction)

**规划能力 (planningAbility)**
- `towerPlanning`: 塔结构规划能力
- `sequentialPlanning`: 序列化规划能力
- `goalDirectedPlanning`: 目标导向规划

**冲动控制 (impulseControl)**
- `timingControl`: 投放时机控制
- `placementControl`: 位置控制精度

**工作记忆 (workingMemory)**
- `spatialWorkingMemory`: 空间工作记忆
- `sequenceMemory`: 序列记忆能力

### 处理速度 (processingSpeed)

**反应时间 (reactionTime)**
- `averageRT`: 平均反应时间 (毫秒)
- `rtVariability`: 反应时间变异性
- `rtImprovement`: 反应时间改善程度

**决策速度 (decisionSpeed)**
- `placementDecisions`: 投放决策速度
- `rapidDecisions`: 快速决策能力

### 运动技能 (motorSkills)

**精细精度 (finePrecision)**
- `placementPrecision`: 投放精度
- `steadiness`: 操作稳定性
- `coordination`: 手眼协调能力

**时机掌握 (timing)**
- `timingAccuracy`: 时机准确性
- `timingConsistency`: 时机一致性

### 学习适应 (learningAdaptation)

**技能获得 (skillAcquisition)**
- `learningRate`: 学习速率
- `performanceImprovement`: 表现改善程度
- `plateauReached`: 是否达到平台期

**错误修正 (errorCorrection)**
- `errorRecovery`: 错误恢复能力
- `adaptiveAdjustment`: 适应性调整能力

## 游戏机制

### 基本玩法
- **方块下落**: 方块自动下落，玩家控制投放时机
- **精确堆叠**: 需要精确控制方块落点建造稳定的塔
- **高度挑战**: 目标是建造尽可能高且稳定的塔
- **时机控制**: 投放时机直接影响堆叠精度

### 难度递增
- **速度加快**: 随关卡进行方块下落速度逐渐加快
- **形状复杂**: 方块形状和大小变化增加难度
- **稳定要求**: 后期关卡对塔稳定性要求更高

### 认知挑战
- **空间判断**: 需要精确判断方块投放位置
- **时机掌握**: 掌握最佳投放时机
- **规划能力**: 前瞻性地规划塔的结构
- **错误修正**: 从不完美的放置中恢复

## 临床/研究应用

### 空间认知评估
- **视觉空间处理**: 评估视觉空间信息处理能力
- **空间规划**: 测量三维空间规划和构建能力
- **空间精度**: 评估精细空间操作的准确性

### 运动技能评估
- **精细运动控制**: 评估手指和手腕的精细控制
- **手眼协调**: 测量视觉引导的运动协调能力
- **时机控制**: 评估动作时机的掌握能力

### 执行功能训练
- **规划训练**: 提高前瞻性规划和策略制定
- **工作记忆**: 训练空间信息的临时存储和操作
- **认知灵活性**: 增强策略调整和适应能力

### 康复医学应用
- **中风康复**: 恢复空间认知和精细运动功能
- **脑外伤康复**: 重建执行功能和空间技能
- **帕金森病**: 改善运动控制和时机掌握
- **儿童发育**: 促进空间认知和运动技能发展

## 数据分析方法

### 精度分析

```javascript
// 空间精度计算示例
calculateSpatialAccuracy(placements) {
    const accuracies = placements.map(p => p.accuracy);
    const mean = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
    return mean;
}

calculateConsistency(placements) {
    const accuracies = placements.map(p => p.accuracy);
    const mean = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
    const variance = accuracies.reduce((sum, acc) => sum + (acc - mean) ** 2, 0) / accuracies.length;
    const std = Math.sqrt(variance);
    return 1 - (std / mean); // 一致性指数
}

calculateLearningRate(levelData) {
    const accuracies = levelData.map(level => level.accuracy);
    // 计算线性回归斜率作为学习率
    return calculateLinearSlope(accuracies);
}
```

### 运动控制分析
- **反应时间分布**: 分析RT的正态性和异常值
- **精度-速度权衡**: 分析精度和反应时间的关系
- **学习曲线**: 跨关卡的表现改善趋势

### 策略分析
- **投放模式**: 识别个体特有的投放策略
- **错误类型**: 分析常见的错误模式和原因
- **适应策略**: 面对困难时的策略调整

## 质量控制标准

### 数据有效性
- **最小关卡数**: 至少完成3个关卡
- **合理表现**: 精度和反应时间在正常范围
- **参与度**: 每个关卡至少放置5个方块
- **注意集中**: 避免明显的注意分散模式

### 技术质量
- **刷新率稳定**: 确保游戏流畅运行
- **输入延迟**: 最小化输入延迟影响
- **碰撞检测**: 准确的物理碰撞检测

## 注意事项

1. **任务理解**: 确保参与者理解游戏目标和控制方式
2. **练习充分**: 提供足够练习以熟悉操作
3. **难度适应**: 根据个体能力调整起始难度
4. **疲劳控制**: 合理控制游戏时长
5. **动机维持**: 保持适当的挑战性和成就感
6. **环境标准化**: 统一的显示设备和输入设备

## 数据预处理建议

### 异常值处理
- **异常RT**: 过短(<100ms)或过长(>5s)的反应时间
- **异常精度**: 明显异常的高精度或低精度
- **系统错误**: 因技术问题造成的异常数据

### 学习效应控制
- **热身效应**: 前几次尝试可能存在适应过程
- **疲劳效应**: 长时间游戏后的表现下降
- **策略稳定**: 识别策略稳定后的表现

### 个体差异考虑
- **年龄效应**: 不同年龄组的表现规律
- **经验效应**: 游戏经验对表现的影响
- **性别差异**: 空间任务的性别差异模式
- **文化因素**: 文化背景对空间认知的影响

### 报告建议
- **能力剖析**: 各认知域的详细分析
- **学习潜力**: 基于学习曲线评估训练潜力
- **训练建议**: 针对弱项的个性化训练建议
- **进展监测**: 提供后续评估的基线数据