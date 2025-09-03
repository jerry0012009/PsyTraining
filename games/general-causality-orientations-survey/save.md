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
    a.download = 'general-causality-orientations-survey_result.json';
    a.href = 'data:' + data;
    // 触发下载
}
```

## 数据内容

### 收集的数据结构
每个情景问题的回答包含以下字段:
```javascript
{
    "name": "general-causality-orientations-survey_2_options",  // 问题标识
    "value": "a",                                              // 选择的选项 (a/b/c)
    "options": "a. 选项A描述|b. 选项B描述|c. 选项C描述",          // 所有选项描述
    "text": "情景描述问题文本"                                    // 情景问题文本
}
```

### 测量的心理构念
**一般因果取向调查** - 测量个体在不同情境下的动机取向:

#### 三种动机取向类型:
1. **自主取向 (Autonomous Orientation)**
   - 内在动机驱动
   - 自我决定的行为
   - 例: 选择有趣的工作，寻求合作解决方案

2. **控制取向 (Controlled Orientation)**  
   - 外在压力或奖励驱动
   - 受环境控制的行为
   - 例: 关注薪资和晋升，使用权威方式

3. **非个人取向 (Impersonal Orientation)**
   - 感到无能为力或被动
   - 缺乏有效控制感
   - 例: 感到无助，依赖他人决定

### 具体测量情景
1. **职位晋升情景**: 新工作机会的第一反应
2. **子女教育情景**: 处理孩子学习问题的方式
3. **求职失败情景**: 对工作被拒的归因方式
4. **管理决策情景**: 安排工作时间的管理风格
5. **人际冲突情景**: 处理朋友情绪问题的方法
6. **考试失败情景**: 对考试失败的反应和归因
7. **社交情景**: 参加聚会的期望和行为
8. **团队合作情景**: 组织活动的领导风格
9. **职业发展情景**: 选择新职业的考虑因素
10. **员工管理情景**: 处理下属工作问题的方式
11. **环境变化情景**: 对工作调动的情感反应

## 评分方式
- **选项类型**: 每题3个选项，分别代表不同的动机取向
- **计分方法**: 统计各类取向选项的频次
- **结果解释**: 
  - 自主取向分数高: 内在动机强，自我决定能力强
  - 控制取向分数高: 外在动机依赖，易受外部影响
  - 非个人取向分数高: 缺乏控制感，易感到无助

## 文件保存位置
- **成功保存**: 发送到服务器 '/save' 端点
- **备用保存**: 下载为 'general-causality-orientations-survey_result.json' 文件

## 认知测量指标
- **动机类型**: 评估内在动机 vs 外在动机的倾向
- **自我决定**: 测量个体的自主性和控制感
- **行为调节**: 反映行为背后的心理驱动机制
- **适应性**: 不同取向与心理健康和幸福感的关联