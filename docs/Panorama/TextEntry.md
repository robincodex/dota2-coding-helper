# TextEntry

文本输入，创建一个文本输入框UI，可以处理输入文字相关操作。

## 属性

| 属性名        | 类型      | 描述  |
| ------------- |:--------:| ----- |
| maxchars      | Integer  | 输入文本的字符上限 |
| placeholder   | String   | 当文本框没有文字时显示的内容 |
| textmode      | String   | 文本模式，目前已知`normal`普通模式和`password`密码模式 |

## 事件

| 事件名        | 描述  |
| ------------------ | ---- |
| oninputsubmit      | 确定输入事件 |
| ontextentrychange  | 文本改变事件 |

## 范例

**创建一个TextEntry**
```xml
<TextEntry id="MyEntry" maxchars="100" placeholder="Type here..." oninputsubmit="OnSubmitted()" />
```

**只有正整数字符输入有效的文本输入框**

XML
```xml
<TextEntry id="NumberInput" maxchars="5" ontextentrychange="OnTextChanged()"/>
```

JS
```js
let inputText = $("#NumberInput").text;

function OnTextChanged()
{
	let text = $("#NumberInput").text;
	if (inputText !== text)
	{
		let str = text.replace(/\D/g,'');
		if (str !== "") {
            str = String(Math.max(Number(str),0));
        }
		if (str !== text)
		{
			inputText = str;
			$("#NumberInput").text = str;
		}
	}
}

```
