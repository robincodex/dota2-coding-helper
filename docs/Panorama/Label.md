# Label

标签，用于显示文本，UI中的所有文本都是依靠Label显示，Label会自动实现本地化文本的转换。

## 属性

| 属性名        | 类型      | 描述  |
| ------------- |:--------:| ----- |
| html          | Boolean  | 可以使用html的标签，如`<br> <a> <img> <b> <i>`等 |
| text          | String   | 文本 |

## HTML

属性html为true时可以使用一些基本的html标签

```html
<b>粗体</b>
<i>斜体</i>
<em>斜体</em>
<strong>粗体</strong>
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<br> - 换行
<p> - 一段文本
<li>List Item</li>
<img src="file://{images}/custom_game/my_image.png">
<span class="MyCustomClass">Some Text<span> 可以使用css的class来渲染文本
<font color="#ff0000">Some Red Text<font> 渲染字体颜色

<a>Anchor</a>
支持属性
- href
- onmouseover
- onmouseout
- oncontextmenu

调用事件 "event:AddStyle( MyCustomClass )"
调用JS函数 "javascript:DoSomething()"
```

## 范例

```xml
<Label text="Hello">
```

```xml
DOTA_AttackMove 是Dota2的一个本地化文本字段，简体中文会自动转换成 攻击移动/强制攻击
实际上没有前面的#也会自动转换，加#是为了区分是正常文本还是本地化的字段

<Label text="#DOTA_AttackMove">

Dota2的本地化文本存放在steamapps\common\dota 2 beta\game\dota\resource

JS中使用 $.Localize("#DOTA_AttackMove") 就可以获得本地化的文本
```

```xml
渲染文本颜色
<Label html="true" text="<font color='#900'>Hello</font>">

点击打开网站，在Dota2内置浏览器中浏览，需要切回主界面
<Label html="true" text="<a href='http://avalonstudio.cn/'>Avalon Studio</a>">

点击调用事件
<Label html="true" text="<a href='event:AddStyle( MyCustomClass )'>Hello</a>">

点击调用函数
<Label html="true" text="<a href='javascript:DoSomething()'>Hello</a>">
```