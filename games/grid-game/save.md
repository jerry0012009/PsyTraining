# Grid Game 数据保存机制

## 保存方式
- **本地保存**: 游戏完成后自动下载JSON文件
- **文件名**: `grid-game_result.json`
- **格式**: JSON数组，每个元素代表一次试验的数据

## 数据结构
每个试验记录包含以下字段：

| 字段名 | 类型 | 描述 |
|--------|------|------|
| trial | number | 试验编号 |
| answer | number | 玩家选择 (0=相等, 1=不相等) |
| problem | string | 问题描述，格式: "n1 + n2 = presentedNum" |
| RT | number | 反应时间（秒） |
| n1 | number | 第一个操作数 |
| n2 | number | 第二个操作数 |
| points | number | 当前累计得分 |
| problem_id | string | 问题唯一标识符 |
| solution | number | 正确答案 (n1 + n2) |
| ACC | number | 回答准确性 (1=正确, 0=错误) |
| finished | number | 游戏完成状态 (1=完成, 0=未完成) |

## 保存触发机制
1. 每次玩家点击"相等"或"不相等"按钮后触发数据记录
2. 调用 `grade()` 函数进行正确性判断
3. 调用 `save()` 函数记录试验数据
4. 使用 `inputData()` 方法存储各字段值
5. 通过 `sendData()` 方法发送数据

## 游戏完成判断
当满足以下条件时，游戏标记为完成：
- 完成所有预定试验数量 (`this.trial >= this.op1s.length`)
- 最后一次回答正确 (`this.answer == 'correct'`)
- 此时 `finished` 字段设为 1

## 本地下载实现
- 尝试POST数据到 `/save` 端点
- 如果服务器不可用，则触发本地下载
- 生成下载链接，文件名为 `grid-game_result.json`
- 用户可点击下载按钮获取数据文件

## 数据用途
该游戏是视觉空间推理任务，主要测量：
- 数学运算验证能力
- 反应时间
- 准确率
- 视觉空间处理能力