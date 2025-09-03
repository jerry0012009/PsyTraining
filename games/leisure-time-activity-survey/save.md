# Leisure Time Activity Survey 数据保存说明

## 问卷概述
休闲时间活动调查问卷，评估被试在过去一个月中的身体活动水平和类型。

## 数据保存机制

### 技术架构
- **前端框架**: jQuery + Material Design Lite
- **表单处理**: 向导式多步骤表单 (jquery.wizard.js)
- **数据验证**: jQuery Validate 插件
- **提交方式**: AJAX POST 请求到服务器 '/save' 端点

### 数据收集流程

#### 表单步骤
1. **欢迎页面**: 介绍调查目的
2. **说明页面**: 问卷填写说明
3. **问题页面**: 身体活动水平选择题
4. **完成页面**: 确认提交

#### 数据提交处理
```javascript
// 主要数据处理逻辑
var results = []
$elements.each(function(index, element) {
    var result = {}
    if ($.inArray($(element).attr("name"), ["forward", "backward", "process"]) == -1) {
        result.name = $(element).attr("name");          // 问题名称
        result.value = $(element).attr("value");        // 答案值
        result.options = $(element).attr("meta-options"); // 所有选项
        result.text = $(element).attr("meta-text");     // 问题文本
        results.push(result);
    }
})
```

### 保存的数据字段

#### 单个问题数据结构
```javascript
{
    name: "leisure-time-activity-survey_2_options",  // 问题标识符
    value: "1-6",                                   // 选择的选项值
    options: "选项1|选项2|选项3|...",                // 所有可选项(用|分隔)
    text: "问题的完整文本内容"                        // 问题描述
}
```

#### 身体活动水平选项详情
**选项值对应的活动水平**:
- `value: "1"`: 几乎无身体活动 (看电视、阅读、游戏等)
- `value: "2"`: 轻度活动 (每周1-2次散步或轻度家务)  
- `value: "3"`: 中等强度活动 (每周约3次快走、游泳或骑车15-20分钟)
- `value: "4"`: 经常性中等强度活动 (每天30分钟或更长时间)
- `value: "5"`: 剧烈运动 (每周约3次跑步或用力骑车30分钟以上)
- `value: "6"`: 频繁剧烈运动 (几乎每天30分钟以上剧烈运动)

### 数据提交策略

#### 主要提交路径
```javascript
$.ajax({
    type: 'POST',
    url: '/save',
    data: {'data': results},
    success: function() {
        console.log('success');
        document.location = '/next'  // 跳转到下一个任务
    },
    error: function(err) {
        // 错误处理逻辑
    }
});
```

#### 备用保存机制
当服务器端点不可用时，自动触发本地文件下载：
```javascript
// 本地保存逻辑
var data = "text/json;charset=utf-8," + JSON.stringify(results);
var a = document.createElement('a');
a.download = 'leisure-time-activity-survey_result.json';  // 文件名
a.href = 'data:' + data;
// 触发下载
```

### 数据验证机制

#### 必填字段验证
- 使用 `required` CSS类标记必填问题
- 通过 jQuery Validate 进行客户端验证
- 红色高亮显示未完成的必填问题

#### 完整性检查
```javascript
// 检查所有必填问题是否已回答
if (($.unique($(`.page3.required:not([type=number]):not(:text)`).map(function(){
    return $(this).attr(`meta-text`)
})).map(function() {
    return $(`[meta-text*="` + this + `"].required:checked`).length > 0
}).get().indexOf(false) != -1)) {
    is_required($(`.page3.required:not(checked)`));
    return false;
}
```

### 调查问卷设计特点

#### 问题类型
- **单选题**: 6个身体活动水平选项
- **量表类型**: 从低活动水平到高活动水平的渐进式选择

#### 用户体验优化
- 响应式设计 (Material Design Lite)
- 进度条显示填写进度
- 向导式导航 (上一步/下一步/完成)
- 实时表单验证和错误提示

### 数据分析价值

#### 身体活动评估
- **久坐行为**: 选项1反映久坐生活方式
- **轻度活动**: 选项2-3反映基础活动水平  
- **规律运动**: 选项4-6反映系统性运动习惯

#### 健康行为分析
- 可与认知任务表现进行相关性分析
- 评估身体活动对认知功能的影响
- 为个性化训练方案提供参考依据

### 技术特性
- **渐进式增强**: 支持无JavaScript环境的基本功能
- **数据完整性**: 双重验证确保数据质量
- **容错处理**: 网络异常时的本地备份机制
- **跨平台兼容**: 响应式设计支持多种设备