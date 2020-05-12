# RadioButton

单选按钮

## 属性

| 属性名        | 类型      | 描述  |
| ------------- |:--------:| ----- |
| selected      | Boolean  | 默认是否被选择，对应JS中的`checked`属性 |
| group         | String   | 组，相同组的RadioButton只能选择其中一个，此属性无法通过JS动态调整 |

## JS API

```js
GetSelectedButton() // 获取相同组内被选择的按钮
```