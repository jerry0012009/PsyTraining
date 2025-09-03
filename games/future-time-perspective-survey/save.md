# 数据保存机制

## 保存方式
- **框架**: jQuery Wizard + AJAX
- **数据格式**: JSON
- **保存策略**: 双重保存（服务器 + 本地下载）

## 数据保存流程

### 1. 主要保存方式 (AJAX POST)
```javascript
$.ajax({
    type: 'POST',
    url: '/save',
    data: {'data': results},
    success: function() {
        console.log('success');
        document.location = '/next'
    }
})
```

### 2. 备用保存方式 (本地下载)
当AJAX请求失败时，自动下载JSON文件到本地:
```javascript
error: function(err) {
    var data = "text/json;charset=utf-8," + JSON.stringify(results);
    var a = document.createElement('a');
    a.download = 'future-time-perspective-survey_result.json';
    a.href = 'data:' + data;
    // 触发下载
}
```

## 数据内容

### 收集的数据结构
每个问题的回答包含以下字段:
```javascript
{
    "name": "future-time-perspective-survey_2_options",  // 问题标识
    "value": "3",                                       // 选择的选项值
    "options": "完全不符合: 1|2|3|4|5|6|完全符合: 7",      // 所有可选项
    "text": "未来有很多机会等待着我。"                        // 问题文本
}
```

### 测量的心理构念
**未来时间观调查** - 测量个体对未来时间的感知和态度:

1. **机会感知**: "未来有很多机会等待着我"
2. **目标设定**: "我期待将来能设定许多新目标"
3. **可能性感知**: "我的未来充满可能性"
4. **时间充裕感**: "我人生的大部分时光还在前方"
5. **无限感**: "我的未来对我来说似乎是无限的"
6. **自主感**: "在未来我能做任何我想做的事情"
7. **计划时间**: "我的人生还有很多时间可以制定新计划"
8. **时间流逝感**: "我觉得时间正在流逝" (反向题)
9. **有限性感知**: "我的未来只有有限的可能性" (反向题)
10. **年龄相关时间感**: "随着年龄增长，我开始觉得时间是有限的" (反向题)

## 评分方式
- **量表范围**: 1-7分 (完全不符合 到 完全符合)
- **反向题目**: 第8、9、10题需要反向计分
- **总分计算**: 所有题目分数相加，反向题先转换

## 文件保存位置
- **成功保存**: 发送到服务器 '/save' 端点
- **备用保存**: 下载为 'future-time-perspective-survey_result.json' 文件

## 认知测量指标
- **时间认知**: 测量对未来时间长度和可能性的感知
- **动机倾向**: 评估未来导向的动机和目标设定倾向
- **心理适应**: 反映个体的时间管理和生活规划能力