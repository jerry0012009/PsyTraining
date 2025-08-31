# Save Data Documentation - Color Blast Game

## 数据输出格式

### 基本信息
- **框架**: Canvas + HTML5游戏引擎
- **输出格式**: JSON对象
- **保存机制**: TrainingAPI集成，输出到浏览器控制台
- **游戏类型**: 射击类反应速度训练游戏
- **集成系统**: PsyTraining认知训练平台

## 保存流程

1. **实时数据收集**: 游戏过程中持续记录事件和表现数据
2. **回合结束**: 每轮结束时汇总数据并计算认知指标
3. **系统报告**: 通过TrainingAPI报告给训练系统
4. **控制台输出**: 最终数据输出到浏览器控制台供分析

```javascript
// 数据报告流程
reportToTrainingSystem() {
    const report = {
        gameType: 'color_blast',
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
| `gameType` | string | 游戏类型标识 ("color_blast") |
| `currentRound` | number | 当前轮次编号 |
| `isRunning` | boolean | 游戏是否正在运行 |
| `isPaused` | boolean | 游戏是否暂停 |
| `score` | number | 当前得分 |
| `lives` | number | 剩余生命值 |

### 轮次数据字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `roundNumber` | number | 轮次编号 |
| `startTime` | number | 轮次开始时间戳 |
| `endTime` | number | 轮次结束时间戳 |
| `duration` | number | 轮次持续时间 (毫秒) |
| `score` | number | 轮次得分 |
| `enemiesDestroyed` | number | 击毁敌人数量 |
| `shotsFired` | number | 发射子弹数量 |
| `livesLost` | number | 失去生命数量 |
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
- `move_left`: 向左移动
- `move_right`: 向右移动
- `player_shot`: 玩家射击
- `enemy_destroyed`: 击毁敌人
- `player_hit`: 玩家被击中

## 示例数据

### JSON格式输出示例

```json
{
  "gameType": "color_blast",
  "currentRound": 1,
  "roundData": {
    "roundNumber": 1,
    "startTime": 1640995200000,
    "endTime": 1640995260000,
    "duration": 60000,
    "score": 450,
    "enemiesDestroyed": 12,
    "shotsFired": 25,
    "livesLost": 1,
    "events": [
      {
        "timestamp": 1640995200100,
        "type": "round_started",
        "data": {}
      },
      {
        "timestamp": 1640995201234,
        "type": "player_shot",
        "data": {}
      },
      {
        "timestamp": 1640995202456,
        "type": "enemy_destroyed",
        "data": { "score": 450 }
      },
      {
        "timestamp": 1640995245123,
        "type": "player_hit",
        "data": { "lives": 2 }
      }
    ]
  },
  "totalStats": {
    "totalRounds": 1,
    "totalScore": 450,
    "totalEnemiesDestroyed": 12,
    "totalShotsFired": 25,
    "avgScore": 450,
    "accuracy": 0.48
  },
  "cognitiveMetrics": {
    "reactionDecision": {
      "responseSpeed": {
        "avgReactionTime": 0.85,
        "decisionAccuracy": 0.48,
        "responseConsistency": 0.72
      },
      "cognitiveLoad": {
        "multitaskingAbility": 0.65,
        "performanceUnderPressure": 0.80
      }
    },
    "attention": {
      "sustainedAttention": {
        "attentionSpan": 60.0,
        "consistencyIndex": 0.72
      },
      "selectiveAttention": {
        "focusAccuracy": 0.48,
        "errorRate": 0.33
      }
    },
    "executiveFunction": {
      "planningAbility": {
        "strategicEfficiency": 7.5
      },
      "impulseControl": {
        "controlStability": 0.68
      }
    },
    "analysisMetadata": {
      "totalRounds": 1,
      "analysisTimestamp": "2024-01-01T12:01:00.000Z",
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

### 反应速度和决策 (reactionDecision)

**响应速度 (responseSpeed)**
- `avgReactionTime`: 平均反应时间 (基于持续时间和射击次数)
- `decisionAccuracy`: 决策准确性 (命中率)
- `responseConsistency`: 响应一致性 (得分稳定性)

**认知负荷 (cognitiveLoad)**
- `multitaskingAbility`: 多任务处理能力 (综合表现指标)
- `performanceUnderPressure`: 压力下表现 (生命损失时vs正常时的表现比)

### 注意力功能 (attention)

**持续注意 (sustainedAttention)**
- `attentionSpan`: 注意广度 (轮次持续时间)
- `consistencyIndex`: 一致性指数 (表现稳定程度)

**选择性注意 (selectiveAttention)**
- `focusAccuracy`: 聚焦准确性 (命中率)
- `errorRate`: 错误率 (生命损失率)

### 执行功能 (executiveFunction)

**规划能力 (planningAbility)**
- `strategicEfficiency`: 策略效率 (得分/时间比率)

**冲动控制 (impulseControl)**
- `controlStability`: 控制稳定性 (射击效率的稳定性)

## 游戏机制

### 玩家控制
- **移动**: 左右方向键或A/D键
- **射击**: 空格键发射子弹
- **碰撞检测**: 玩家子弹击中敌人，敌人子弹击中玩家

### 敌人系统
- **随机生成**: 敌人随机出现在顶部
- **移动模式**: 水平往返移动 + 垂直下降
- **射击**: 敌人定时发射彩色子弹
- **颜色随机**: 敌人和子弹使用随机HSL颜色

### 评分系统
- **击毁敌人**: +15分/每个敌人
- **速度奖励**: 快速击毁额外加分
- **连续奖励**: 连续击中的连击加分

## 临床/研究应用

### 认知训练评估
- **反应速度训练**: 提高视觉-运动反应速度
- **注意力训练**: 增强持续注意和选择性注意
- **执行控制训练**: 改善认知灵活性和冲动控制

### 认知功能评估
- **处理速度**: 视觉信息处理和运动反应速度
- **注意网络**: 警觉、定向和执行注意功能
- **工作记忆**: 多任务环境下的认知负荷管理

### 神经心理应用
- **ADHD评估**: 注意缺陷和冲动控制问题
- **执行功能障碍**: 前额叶相关的认知控制缺陷
- **认知康复**: 脑外伤后的认知功能恢复训练

## 数据分析方法

### 表现指标计算

```javascript
// 关键指标计算示例
calculateAccuracy() {
    return this.gameData.totalShotsFired > 0 ? 
        (this.gameData.totalEnemiesDestroyed / this.gameData.totalShotsFired) : 0;
}

calculateAvgReactionTime(durations, shotsFired) {
    const avgDuration = durations.reduce((sum, val) => sum + val, 0) / durations.length;
    const avgShots = shotsFired.reduce((sum, val) => sum + val, 0) / shotsFired.length;
    return avgShots > 0 ? avgDuration / avgShots : 0;
}

calculateResponseConsistency(scores) {
    const mean = scores.reduce((sum, val) => sum + val, 0) / scores.length;
    const variance = scores.reduce((sum, val) => sum + (val - mean) ** 2, 0) / scores.length;
    const std = Math.sqrt(variance);
    return 1 - (std / Math.max(mean, 1));
}
```

### 认知指标解读

**高水平表现特征**:
- 高命中率 (>60%)
- 快速反应时间 (<1秒)
- 高表现一致性 (>0.7)
- 长注意维持时间

**需要改善的表现**:
- 低命中率 (<30%)
- 慢反应时间 (>2秒)  
- 表现不稳定 (<0.5)
- 频繁生命损失

## 质量控制标准

### 数据有效性
- **最小轮次**: 至少完成3轮游戏
- **参与度**: 每轮至少10次射击
- **时间合理**: 每轮持续30-300秒
- **非随机**: 命中率高于随机水平(>15%)

### 环境控制
- **设备性能**: 确保流畅的帧率和响应
- **输入设备**: 标准化的键盘输入
- **显示设置**: 一致的屏幕分辨率和刷新率

## 注意事项

1. **游戏理解**: 确保参与者理解游戏控制和目标
2. **练习时间**: 允许足够的练习以熟悉操作
3. **疲劳控制**: 合理安排休息避免手眼疲劳
4. **动机维持**: 保持游戏的趣味性和挑战性
5. **数据完整性**: 确保所有关键事件都被正确记录
6. **个体差异**: 考虑年龄、游戏经验等个体特征

## 数据预处理建议

### 异常检测
- **异常短轮次**: <10秒的轮次可能为意外结束
- **异常长轮次**: >600秒的轮次可能为暂停忘记
- **零射击**: 完全无射击行为的轮次
- **完美表现**: 100%命中率可能需要验证

### 学习效应分析
- **轮次进步**: 跨轮次的表现改善趋势
- **策略调整**: 射击模式和移动模式的变化
- **适应速度**: 达到稳定表现所需轮次数

### 个体化分析
- **基线能力**: 第一轮表现作为基线
- **改善程度**: 最佳表现与基线的差异
- **稳定性**: 后期轮次表现的变异程度
- **特征模式**: 个体特有的游戏策略和表现模式