# Save Data Documentation - Add It Up Lightning

## 数据输出格式

### 基本信息
- **框架**: Phaser.js游戏引擎
- **输出格式**: JSON数组
- **保存机制**: AJAX POST请求 + 本地JSON下载
- **游戏类型**: 快速数学加法训练

## 保存流程

1. **实时数据收集**: 每道题完成后立即保存到数组
2. **服务器上传**: 游戏结束时POST到 `/save` 端点
3. **本地备份**: 服务器失败时自动下载JSON文件

```javascript
// 保存流程
function sendData(trial) {
    inputData('trial', trial);
    this.taskdata.push(this.data);
    
    if (data.finished == 1) {
        // 游戏结束，上传所有数据
        $.ajax({
            type: "POST", 
            url: '/save',
            data: { "data": JSON.stringify(this.taskdata) },
            success: function(){ document.location = "/next" },
            error: function(err) {
                // 本地下载JSON文件
                downloadObjectAsJson(this.taskdata, "lightning-results");
            }
        });
    }
}
```

## 数据结构

### 每道题记录的字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `answer` | number | 用户输入的答案 |
| `problem` | string | 题目表达式 (如: "5 + 3 = ?") |
| `n1` | number | 第一个操作数 |
| `n2` | number | 第二个操作数 |
| `problem_id` | string | 题目ID标识符 |
| `points` | number | 当前累积分数 |
| `solution` | number | 正确答案 (n1 + n2) |
| `RT` | number | 反应时间 (秒) |
| `ACC` | number | 正确性 (1=正确, 0=错误) |
| `finished` | number | 是否完成游戏 (1=完成, 0=未完成) |
| `trial` | number | 试验编号 (从0开始) |

### 游戏模式区分
- **标准模式**: `problem = "n1 + n2 = ?"`
- **代数模式**: `problem = "n1 + ? = result"`

## 示例数据

### JSON格式示例

```json
[
  {
    "answer": 8,
    "problem": "5 + 3 = ?",
    "n1": 5,
    "n2": 3, 
    "problem_id": "add_5_3",
    "points": 50,
    "solution": 8,
    "RT": 1.245,
    "ACC": 1,
    "finished": 0,
    "trial": 0
  },
  {
    "answer": 12,
    "problem": "7 + ? = 12", 
    "n1": 7,
    "n2": 5,
    "problem_id": "add_7_5_algebra",
    "points": 100,
    "solution": 12,
    "RT": 2.156,
    "ACC": 1,
    "finished": 0,
    "trial": 1
  },
  {
    "answer": 15,
    "problem": "9 + 4 = ?",
    "n1": 9,
    "n2": 4,
    "problem_id": "add_9_4",
    "points": 150,
    "solution": 13,
    "RT": 1.895,
    "ACC": 0,
    "finished": 1,
    "trial": 2
  }
]
```

## 认知指标评估

### 处理速度指标
- **平均反应时间**: RT字段统计
- **速度-准确率权衡**: RT vs ACC关系
- **学习曲线**: 试验过程中RT变化趋势

### 注意力指标  
- **持续注意**: 连续正确试验数
- **警觉性下降**: RT逐渐增长模式
- **冲动性**: 过快反应（RT < 500ms）

### 工作记忆指标
- **心算能力**: 加法运算准确率
- **认知负荷**: 复杂题目的RT增长
- **干扰抑制**: 错误后的恢复表现

## 游戏机制

### 计分系统
- **基础得分**: 每题正确+50分
- **速度奖励**: 快速回答额外加分
- **连续奖励**: 连击streak加分

### 难度控制
- **题目范围**: 通过problems.js配置
- **自适应难度**: 基于表现调整题目复杂度
- **时间压力**: Lightning模式时间限制

### 反馈机制
- **即时反馈**: 正确/错误视觉提示
- **进度显示**: 实时分数和题目计数
- **最终成绩**: 游戏结束总分展示

## 数据分析应用

### 认知评估
- **数学流畅性**: 平均RT和ACC
- **认知控制**: 错误率和error后表现
- **注意维持**: 游戏过程中表现稳定性

### 训练效果
- **学习曲线**: RT下降趋势
- **正确率提升**: ACC改善模式
- **迁移效应**: 不同题型表现对比

## 注意事项

1. **数据完整性**: 确保每个trial都有完整的7个核心字段
2. **时间精度**: RT以秒为单位，保留3位小数
3. **最终试验**: finished=1的记录标志游戏结束
4. **错误处理**: 网络失败时确保本地数据不丢失
5. **游戏状态**: 通过points和trial追踪游戏进度