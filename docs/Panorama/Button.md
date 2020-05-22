# Button

按钮，相当于Panel，没有默认的按钮效果，目前为止发现的区别在于事件，按钮支持的事件会比Panel更多，比如CSS中`:active`就只有Button可以触发;

感觉上这个只是为了写的时候更好去描述组件，毕竟使用`<Button>`比`<Panel class="Button">`更直观是不

## 属性
- 默认事件属性
Panorama支持一系列能够在与玩家互动时自动发出事件（或者javascript）的属性。大多数这样的事件和HTML5的属性一致，除了一些panorama特有的附加属性，和一些HTML5不支持的属性。
这些属性同样支持 Panel。

|属性	|描述|
| ------------- |:--------:| ----- |
|onload	        |板已完成加载。|
|onactivate	    |板被鼠标/键盘/控制器等的操作激活。|
|onmouseactivate|	板被鼠标操作激活。|
|oncontextmenu  |	用户右键点击了该板，或按下了键盘上的内容菜单键。|
|onfocus        |	板获得了键盘聚焦（译者注:按一下tab，程序就会切换所选中的控件，就是键盘聚焦的形式之一。）|
|ondescendantfocus|	板的继承之一获得了键盘聚焦。|
|onblur	        |板失去键盘聚焦。|
|ondescendantblur|	板的继承之一失去了键盘聚焦。|
|oncancel	    |玩家按下了ESC键。|
|onmouseover    |	鼠标开始悬停在板上。|
|onmouseout     |	鼠标结束悬停在板上。|
|ondblclick     |	用户双击了板。|
|onmoveup	    |用户试图从板向上移动（上箭头键）。User tried to move up from this panel (arrow key up).|
|onmovedown	    |用户试图从板向下移动（下箭头键）。|
|onmoveleft	    |用户试图从板向左移动（下箭头键）。|
|onmoveright	|用户试图从板向右移动（右箭头键）。|
|ontabforward	|用户试图从该板正向跳格（tab）(译者注:单tab键为正向，shift+tab为逆向)。|
|ontabbackward  |	用户试图从该板逆向跳格（shift+tab）|
|onselect	    |板被选择|
|ondeselect 	|板失去选择|
|onscrolledtobottom	|板被完全滚动到底部。|
|onscrolledtorightedge	|板被完全滚动到右边缘|

## 范例

```xml
<Button onmouseover="DOTAShowTextTooltip('hello world')" onmouseout='DOTAHideTextTooltip()'/>
当鼠标悬浮在这个按钮上的时候，会显示 hello world 字样，鼠标离开时，会消失
```