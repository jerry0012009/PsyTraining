# Save Data Documentation - Bridge Game

## 数据输出格式

### 基本信息
- **框架**: Phaser.js + Box2D Physics Engine
- **输出格式**: JSON数据 (双端点保存)
- **保存机制**: 主API + 备用/save端点
- **游戏类型**: 物理桥梁建造 + 数学问题解决游戏
- **集成系统**: 自定义学习平台

## 保存流程

1. **实时数据收集**: 每个试次的桥梁建造行为、数学问题和反应时间
2. **试次完成**: 每次桥梁建造完成后数据立即发送
3. **双重保存**: 首先发送到主API，同时备份到/save端点
4. **会话管理**: 通过Cookie管理用户会话和游戏进度

```javascript
// 数据保存流程
// 主API保存
this.sendData = function(trial) {
    this.data['trial'] = trial;
    this.data['username'] = this.sid;
    this.data['task'] = this.task;
    
    url = 'http://' + homebase + '/trial/';
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(this.data),
        contentType: 'application/json',
        dataType: 'json'
    });
}

// 备用/save端点保存
if (data.finished == 1) {
    var serializedData = JSON.stringify(this.taskdata);
    $.ajax({
        type: "POST",
        url: '/save',
        data: { "data": serializedData },
        dataType: "application/json"
    });
}
```

## 数据结构

### 核心游戏数据字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `trial` | number | 试次编号 |
| `username` | string | 用户ID |
| `task` | string | 任务类型 ("bridge-game") |
| `session` | number | 会话编号 |
| `play` | number | 游戏轮次 |
| `problem_set` | string | 问题集合 ("A" 或 "B") |
| `op1` | number | 数学操作数1 |
| `op2` | number | 数学操作数2 |
| `correct_answer` | number | 正确答案 (op1 + op2) |
| `bridge_length` | number | 用户建造的桥梁长度 |
| `blocks_used` | number | 使用的方块数量 |
| `correct` | boolean | 是否正确完成桥梁 |
| `RT` | number | 反应时间 (毫秒) |
| `fallen` | boolean | 角色是否掉落 |

### 桥梁物理数据

| 字段名 | 类型 | 描述 |
|--------|------|------| 
| `bridge_coordinates` | array | 桥梁方块坐标序列 |
| `block_placement_order` | array | 方块放置顺序 |
| `drag_operations` | array | 拖拽操作记录 |
| `bridge_stability` | number | 桥梁稳定性评分 |
| `physics_violations` | number | 物理违规次数 |

### 数学认知数据

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `math_calculation_time` | number | 数学计算时间 |
| `planning_time` | number | 规划建造时间 |
| `execution_time` | number | 实际建造时间 |
| `error_corrections` | number | 错误修正次数 |
| `strategy_type` | string | 建造策略类型 |

## 示例数据

### 单试次JSON格式示例

```json
{
  "trial": 3,
  "username": "user_12345",
  "task": "bridge-game",
  "session": 1,
  "play": 2,
  "problem_set": "A",
  "op1": 7,
  "op2": 5,
  "correct_answer": 12,
  "bridge_length": 12,
  "blocks_used": 12,
  "correct": true,
  "RT": 8420,
  "fallen": false,
  "start_time": "2024-01-01T12:05:30Z",
  "end_time": "2024-01-01T12:05:38Z",
  "bridge_building_data": {
    "planning_phase": {
      "planning_time": 3200,
      "calculation_time": 1800,
      "initial_strategy": "sequential_placement"
    },
    "construction_phase": {
      "execution_time": 4220,
      "blocks_placed": [
        {"block_id": 1, "x": 175, "y": 475, "timestamp": 3205},
        {"block_id": 2, "x": 195, "y": 475, "timestamp": 3587},
        {"block_id": 3, "x": 215, "y": 475, "timestamp": 3912}
      ],
      "drag_operations": 15,
      "repositioning_count": 2
    },
    "physics_assessment": {
      "bridge_stability": 0.89,
      "structural_integrity": true,
      "physics_violations": 0,
      "load_bearing_capacity": "sufficient"
    }
  },
  "cognitive_performance": {
    "math_accuracy": true,
    "spatial_reasoning_score": 0.92,
    "problem_solving_efficiency": 0.85,
    "motor_coordination": 0.78
  }
}
```

### 完整会话数据示例

```json
{
  "session_metadata": {
    "user_id": "user_12345",
    "session_id": 1,
    "game_version": "bridge-game-v2",
    "start_time": "2024-01-01T12:00:00Z",
    "end_time": "2024-01-01T12:20:00Z",
    "total_duration": 1200000,
    "problem_set": "A"
  },
  "overall_performance": {
    "total_trials": 12,
    "correct_bridges": 10,
    "accuracy_rate": 0.83,
    "average_rt": 7235.5,
    "total_blocks_used": 144,
    "efficiency_score": 0.78
  },
  "trial_sequence": [
    {
      "trial": 1,
      "problem": {"op1": 4, "op2": 2, "answer": 6},
      "performance": {"correct": true, "rt": 9850, "blocks": 6},
      "bridge_quality": 0.95
    },
    {
      "trial": 2, 
      "problem": {"op1": 5, "op2": 4, "answer": 9},
      "performance": {"correct": false, "rt": 6420, "blocks": 7},
      "bridge_quality": 0.62,
      "error_type": "insufficient_length"
    }
  ],
  "cognitive_assessment": {
    "mathematical_reasoning": {
      "arithmetic_accuracy": 0.92,
      "calculation_speed": 1.8,
      "number_sense": 0.88
    },
    "spatial_cognition": {
      "spatial_visualization": 0.85,
      "mental_rotation": 0.79,
      "spatial_construction": 0.91
    },
    "executive_function": {
      "planning_ability": 0.82,
      "problem_solving": 0.86,
      "cognitive_flexibility": 0.74
    },
    "motor_skills": {
      "fine_motor_control": 0.78,
      "hand_eye_coordination": 0.83,
      "precision_placement": 0.81
    }
  }
}
```

## 游戏机制

### 基本玩法
- **数学问题**: 屏幕显示两个数字，需要计算和 (op1 + op2)
- **桥梁建造**: 拖拽方块建造桥梁，长度必须等于计算结果
- **物理验证**: 角色尝试过桥，验证桥梁是否能承重
- **成功标准**: 桥梁长度正确且角色成功过桥

### 游戏流程
1. **问题呈现**: 显示数学问题 (如 7 + 5)
2. **心算阶段**: 玩家计算正确答案
3. **规划阶段**: 规划桥梁建造策略
4. **建造阶段**: 拖拽方块建造桥梁
5. **验证阶段**: 角色尝试过桥
6. **反馈阶段**: 显示成功或失败结果

### 难度递增
- **数字范围**: 从小数字到大数字
- **桥梁跨度**: 从短桥到长桥
- **物理约束**: 逐渐增加稳定性要求
- **时间压力**: 后期关卡可能加入时间限制

## 认知指标评估

### 数学认知 (mathematicalCognition)

**算术能力 (arithmeticAbility)**
- `calculation_accuracy`: 数学计算准确性
- `calculation_speed`: 计算速度
- `number_magnitude`: 数字大小理解

**数学推理 (mathematicalReasoning)**
- `problem_decomposition`: 问题分解能力
- `quantity_estimation`: 数量估算准确性
- `mathematical_fluency`: 数学流畅性

### 空间认知 (spatialCognition)

**空间可视化 (spatialVisualization)**
- `bridge_design`: 桥梁设计能力
- `spatial_planning`: 空间规划准确性
- `3d_reasoning`: 三维空间推理

**空间构造 (spatialConstruction)**
- `construction_accuracy`: 构造精确度
- `structural_understanding`: 结构理解能力
- `spatial_organization`: 空间组织能力

### 执行功能 (executiveFunction)

**规划能力 (planningAbility)**
- `strategic_planning`: 策略规划
- `goal_oriented_behavior`: 目标导向行为
- `resource_management`: 资源管理 (方块使用效率)

**问题解决 (problemSolving)**
- `solution_generation`: 解决方案生成
- `error_correction`: 错误纠正能力
- `adaptive_strategies`: 适应性策略调整

### 运动技能 (motorSkills)

**精细运动 (fineMotorControl)**
- `drag_precision`: 拖拽精确度
- `placement_accuracy`: 放置准确性
- `motor_coordination`: 运动协调性

**视觉运动整合 (visuomotorIntegration)**
- `hand_eye_coordination`: 手眼协调
- `spatial_motor_mapping`: 空间运动映射
- `movement_efficiency`: 动作效率

## 临床/研究应用

### 数学学习障碍评估
- **计算障碍**: 评估基础算术技能缺陷
- **数学焦虑**: 通过反应时间和错误模式识别数学焦虑
- **数字认知**: 评估数字处理和量感能力

### 空间认知评估
- **视觉空间障碍**: 评估空间构造和视觉化缺陷
- **建构失用症**: 评估空间建构能力
- **空间工作记忆**: 评估空间信息的临时存储和操作

### 发展心理学研究
- **认知发展**: 追踪数学和空间技能的发展轨迹
- **学习能力**: 评估学习新技能的能力和策略
- **认知整合**: 研究多领域认知技能的整合发展

### 教育评估应用
- **数学教育**: 评估数学教学效果
- **STEM技能**: 评估科学、技术、工程、数学综合能力
- **创造性问题解决**: 评估开放性问题解决能力

## 数据分析方法

### 基础性能分析

```r
# R代码示例 - 桥梁游戏分析
# 计算准确率
accuracy <- sum(data$correct) / nrow(data)

# 数学计算准确性
math_accuracy <- sum(data$bridge_length == data$correct_answer) / nrow(data)

# 效率指标
efficiency <- mean(data$correct_answer / data$blocks_used, na.rm = TRUE)

# 反应时间分析
planning_rt <- mean(data$math_calculation_time + data$planning_time)
execution_rt <- mean(data$execution_time)
total_rt <- mean(data$RT)

# 学习曲线分析
learning_curve <- analyze_trial_progression(data)
```

### 认知建模分析

**双过程模型**
```r
# 分离计算阶段和构造阶段的认知过程
math_component <- model_math_processing(data)
spatial_component <- model_spatial_construction(data)
integration_component <- model_math_spatial_integration(data)
```

**错误分析**
```r
# 分类错误类型
error_types <- classify_bridge_errors(data)
# - 计算错误: 数学计算错误
# - 构造错误: 桥梁建造错误  
# - 整合错误: 计算正确但构造错误
```

### 个体差异分析
- **能力剖析**: 数学vs空间技能的相对优势
- **策略偏好**: 个体建造策略的识别
- **认知风格**: 分析型vs整体型认知风格

## 质量控制标准

### 数据有效性
- **最小试次数**: 至少完成8个试次
- **参与度检查**: 避免随机点击行为
- **任务理解**: 确保理解游戏规则和目标
- **技术性能**: 确保物理引擎正常工作

### 认知有效性
- **数学合理性**: 数学计算在合理范围内
- **空间合理性**: 桥梁构造符合物理常识
- **时间合理性**: 反应时间在正常范围内
- **一致性检查**: 跨试次表现的一致性

## 注意事项

1. **任务复杂性**: 确保参与者理解多重任务要求
2. **界面熟悉**: 提供充分练习熟悉拖拽操作
3. **设备标准化**: 使用标准化的触摸屏或鼠标设备
4. **年龄适应性**: 根据年龄调整数字范围和难度
5. **文化因素**: 考虑不同文化背景的数学教育差异
6. **疲劳控制**: 合理控制游戏时长

## 数据预处理建议

### 异常值处理
- **极端反应时**: 处理过短(<2秒)或过长(>60秒)的试次
- **异常构造**: 识别明显不合理的桥梁构造
- **技术故障**: 处理由于设备问题导致的异常数据

### 能力估计
- **贝叶斯估计**: 使用贝叶斯方法估计潜在能力
- **项目反应理论**: 应用IRT模型分析题目难度和个体能力
- **多维分析**: 分离数学能力和空间能力的贡献

### 发展轨迹分析
- **纵向分析**: 追踪个体能力的发展变化
- **关键期识别**: 识别技能发展的关键时期
- **预测建模**: 基于早期表现预测后续发展

### 报告建议
- **能力剖析**: 数学和空间认知的详细分析
- **强项识别**: 识别个体的认知优势
- **改进建议**: 提供针对性的训练建议
- **发展追踪**: 支持长期认知发展的监测