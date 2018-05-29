## datetimepicker 日期选择组件

### 使用指南
在 app.wxss 中引入组件库所有样式
```css
@import "path/to/wx-ui-space/dist/datetimepicker/index.wxss";
```

### 代码演示
在 index.json 中引入组件
```json
{
  "usingComponents": {
    "space-datetimepicker": "/path/to/wx-ui-space/dist/datetimepicker/index"
  }
}
```
在wxml中引入
```html
<space-datetimepicker bind:onSelect='handleSelect' range="3" status="7">            
              <view>{{useCarTime}}</view>                          
          </space-datetimepicker>
```
#### 属性
| 参数       | 说明      | 类型       | 默认值       | 必须      |备注 |
|-----------|-----------|-----------|-------------|-------------|-------------|
| range | 距离现在的天数 | Number | 7 | -|-|
| status | 业务类型 | String | 1 |-|2或者0时无法设置为当前时间|  
| rangeText | 对应日期的别称 | Array | ['今天','明天','后天'] |-|-| 

#### 事件
| 名称      | 说明      | 类型       | 参数       | 必须      |备注 |
|-----------|-----------|-----------|-------------|-------------|-------------|
| onSelect | 确认 | Function | event:{detail:{datetime:时间戳,disText:'格式化后的时间文本'}} | -|-|