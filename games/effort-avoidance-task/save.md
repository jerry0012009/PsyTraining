# 努力回避任务 - 数据保存机制

## 概述
努力回避任务（Effort-Avoidance Task）是一个行为经济学实验，用于测量个体在面对不同努力水平任务时的选择行为。该实验通过设置简单任务和困难任务两种选择，并提供不同的奖励机制，研究参与者的努力回避倾向、认知懒惰程度以及努力-奖励权衡的决策模式，为理解人类动机和决策行为提供实验数据。

## 数据保存机制

### 保存位置和方式
- **主要方式**: AJAX POST请求到服务器端点 `/save`
- **备用方式**: 无本地下载备份机制
- **文件格式**: JSON格式
- **生产环境控制**: 通过`isProduction`常量控制是否实际保存数据

### 数据保存流程
1. 参与者在每个试次中选择简单或困难任务
2. 完成相应的数字排序任务并记录正确性
3. 根据选择动态调整后续试次的奖励结构
4. 实验结束时将所有试次数据打包保存
5. 仅通过AJAX POST发送到服务器，无本地备份

### 保存的数据结构
```javascript
{
  "totalRewards": 250,                    // 总共获得的奖励券数
  "0": {                                  // 试次编号
    "difficulty": "easy",                 // 选择的任务难度(easy/hard)
    "reward": 100,                        // 该试次获得的奖励
    "correctness": true                   // 任务完成的正确性
  },
  "1": {
    "difficulty": "hard", 
    "reward": 200,
    "correctness": false
  },
  // ... 其他试次数据(最多7个试次)
}
```

### 实验设计与流程

#### 基本参数设置 (`constants.js:1-6`):
- **试次数量**: 7个试次
- **初始奖励**: 简单任务100券，困难任务200券
- **调整幅度**: [50, 25, 13, 6, 3, 2, 1] 逐步递减
- **生产模式**: `isProduction = true` 控制数据保存

#### 任务类型与难度:

1. **简单任务** (Easy Tasks):
   - **任务内容**: 将4个1-2位数字按从小到大排序
   - **示例**: [6, 5, 7, 1] → 正确答案: [1, 5, 6, 7]
   - **题目数量**: 20套预设题目
   - **认知负荷**: 低，需要基础数字比较能力

2. **困难任务** (Hard Tasks):
   - **任务内容**: 将4个4位数字按从小到大排序  
   - **示例**: [4521, 4621, 4638, 4698] → 正确答案: [4521, 4621, 4638, 4698]
   - **题目数量**: 18套预设题目
   - **认知负荷**: 高，需要复杂数字比较和工作记忆

#### 动态奖励调整机制:
**调整规则** (`experiment.js:22-29`):
- 如果选择困难任务：简单任务奖励 += 当前试次调整幅度
- 如果选择简单任务：简单任务奖励 -= 当前试次调整幅度
- 困难任务奖励始终保持200券不变
- 调整幅度按预设数组递减，确保后期微调

**示例调整过程**:
```
初始: 简单100券 vs 困难200券
试次1: 选择困难 → 简单变为150券 (100+50)
试次2: 选择简单 → 简单变为125券 (150-25)
试次3: 选择困难 → 简单变为138券 (125+13)
...
```

### 核心测量指标

1. **努力回避程度**:
   - 简单任务选择比例
   - 不同奖励差异下的选择模式
   - 奖励敏感性阈值

2. **任务表现**:
   - 简单任务正确率
   - 困难任务正确率
   - 正确性与选择模式的关系

3. **学习与适应**:
   - 对动态奖励系统的适应速度
   - 后期试次的策略调整
   - 累计奖励最大化程度

### 数据保存实现代码

**试次数据收集** (`experiment.js:9-45`):
```javascript
function saveResultAndNext(incrementQuestion, dataType) {
    // 收集用户选择
    let checkedOption;
    for (let i = 0; i < radioOptions.length; i++) {
        if (radioOptions[i].checked == true) {
            checkedOption = radioOptions[i].value;
        }
    }
    
    // 保存数据到RESULTS对象
    if (dataType == "difficulty") {
        RESULTS[QUESTION_NUMBER].difficulty = checkedOption;
        RESULTS[QUESTION_NUMBER].reward = REWARDS[checkedOption];
        // 动态调整奖励机制
        if (checkedOption == "hard") {
            REWARDS["easy"] += UPDATE_AMOUNT[QUESTION_NUMBER];
        } else {
            REWARDS["easy"] -= UPDATE_AMOUNT[QUESTION_NUMBER];
        }
    } else if (dataType == "correctness") {
        RESULTS[QUESTION_NUMBER].correctness = isCorrect(checkedOption);
        if (isCorrect(checkedOption)) {
            RESULTS["totalRewards"] += RESULTS[QUESTION_NUMBER].reward;
        }
    }
}
```

**最终数据发送** (`experiment.js:129-154`):
```javascript
async function sendResults(data) {
    if (isProduction) {
        $.ajax({
            type: "POST",
            url: '/save',
            data: { "data": data },
            success: function () { document.location = "/next" },
            dataType: "application/json",
            error: function (err) {
                if (err.status == 200) {
                    document.location = "/next";
                } else {
                    console.log("Something went wrong on our end...")
                }
            }
        });
    } else {
        console.log("===done===>", data);
    }
}
```

### 正确性判定算法

**排序验证逻辑** (`experiment.js:70-82`):
```javascript
function isCorrect(check) {
    check = check.split(",");
    let curr;
    let prev = check[0];
    for (let i = 1; i < check.length; i++) {
        curr = check[i];
        if (parseInt(curr) < parseInt(prev)) {
            return false;
        }
        prev = curr;
    }
    return true;
}
```

### 心理学测量维度

1. **认知懒惰 (Cognitive Laziness)**:
   - 倾向于选择认知负荷较低的任务
   - 即使奖励差异较小也避免困难任务
   - 反映自动化vs控制加工的偏好

2. **努力成本敏感性**:
   - 不同个体对认知努力成本的估值差异
   - 努力-奖励权衡的个体差异模式
   - 动机强度对任务选择的调节作用

3. **适应性学习**:
   - 对动态奖励系统的敏感性和适应能力
   - 策略调整的灵活性
   - 短期vs长期利益权衡

### 实验控制设计特点

1. **题目随机化** (`experiment.js:95-110`):
   - 每次呈现时随机打乱选项顺序
   - 避免位置偏好影响选择
   - 确保任务难度的客观性

2. **动态平衡机制**:
   - 自适应调整避免极端选择偏向
   - 维持选择决策的挑战性
   - 个体化的均衡点探索

3. **强制选择设计**:
   - 必须完成任务才能获得奖励
   - 避免单纯的选择偏好测试
   - 确保真实的努力投入

### 行为经济学应用

1. **劳动经济学**:
   - 工作努力水平与薪酬激励的关系
   - 任务复杂度对工作选择的影响
   - 动态激励机制的设计

2. **教育心理学**:
   - 学习任务选择与学术成就的关系
   - 认知挑战回避与学习动机
   - 个体化激励系统设计

3. **组织行为学**:
   - 员工任务偏好与绩效管理
   - 认知资源分配与工作效率
   - 团队任务分配优化

### 数据分析方向

1. **选择行为分析**:
   - 计算每个个体的努力回避指数
   - 分析奖励敏感性曲线
   - 识别决策策略类型

2. **表现差异分析**:
   - 不同难度任务的正确率对比
   - 选择与表现一致性检验
   - 过度自信或低估能力的识别

3. **学习效应分析**:
   - 跨试次的选择模式变化
   - 适应速度的个体差异
   - 策略稳定性评估

### 技术实现特点

1. **前端架构**:
   - 模块化JavaScript设计 (constants.js, questions.js, experiment.js)
   - Bootstrap 5.0响应式界面
   - 无外部框架依赖，轻量化实现

2. **数据完整性**:
   - 实时数据验证和保存
   - 强制选择确保数据完整
   - 生产/测试模式分离

3. **用户体验**:
   - 清晰的任务说明和视觉反馈
   - 渐进式任务呈现
   - 直观的奖励显示

### 实验伦理考虑

1. **公平性原则**:
   - 所有参与者面临相同的初始条件
   - 动态调整基于个人选择，无歧视性
   - 奖励机制透明公正

2. **知情同意**:
   - 明确说明实验时长(约7分钟)
   - 解释任务性质和要求
   - 保障参与的自愿性

3. **数据保护**:
   - 匿名化处理个人数据
   - 仅收集必要的行为数据
   - 严格控制数据访问权限

### 扩展研究可能性

1. **神经科学整合**:
   - 结合fMRI研究努力回避的神经基础
   - EEG测量认知负荷的电生理指标
   - 眼动追踪分析决策过程

2. **个体差异研究**:
   - 与人格量表的关联分析
   - 认知能力对努力回避的调节作用
   - 年龄、性别等人口学变量影响

3. **跨文化比较**:
   - 不同文化背景下的努力回避模式
   - 集体主义vs个人主义文化的差异
   - 教育制度对认知懒惰的影响

### 限制与改进建议

1. **当前限制**:
   - 仅7个试次，数据点相对较少
   - 无本地数据备份机制存在数据丢失风险
   - 任务类型相对单一(仅数字排序)

2. **改进方向**:
   - 增加更多试次以获得更稳定的测量
   - 添加本地数据保存备份机制
   - 引入多种类型的认知任务
   - 增加实时反馈和学习组件
   - 发展适应性算法优化个体化测试