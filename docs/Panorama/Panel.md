# Panel

最基础的元素，没有任何内容的元素

## XML基础格式

```xml
<root>
    <styles>
        <!-- 样式文件 -->
    </styles>
    <script>
        <!-- JS脚本 -->
    </script>
    <scripts>
        <!-- JS脚本文件 -->
    </scripts>
	<Panel>
        <!-- 内容 -->
	</Panel>
</root>
```

## 文件入口 custom\_ui\_manifest.xml

在content目录中`panorama/layout/custom_game/custom_ui_manifest.xml`是PUI的入口文件，
在这里可以定义每个游戏阶段所要使用的文件。

```xml
<root>
	<Panel>
        <!-- 进入游戏后的界面 -->
		<CustomUIElement type="Hud" layoutfile="file://{resources}/layout/custom_game/hud.xml" />

        <!-- 游戏设置阶段，所有玩家都载入完成后进行分队伍的那个界面 -->
        <CustomUIElement type="GameSetup" layoutfile="file://{resources}/layout/custom_game/team_select.xml" />

        <!-- 就是DOTA2查看当局所有英雄的那个信息面板 -->
		<CustomUIElement type="FlyoutScoreboard" layoutfile="file://{resources}/layout/custom_game/flyout_scoreboard.xml" />

        <!-- 游戏结束后的界面 -->
        <CustomUIElement type="EndScreen" layoutfile="file://{resources}/layout/custom_game/end_screen.xml" />
	</Panel>
</root>
```

### FlyoutScoreboard

- XML
```xml
<root>
	<styles>
		<include src="s2r://panorama/styles/dotastyles.vcss_c" />
		<include src="file://{resources}/styles/custom_game/scoreboard.css" />
	</styles>
	<scripts>
		<include src="file://{resources}/scripts/custom_game/scoreboard.js" />
	</scripts>
	<Panel hittest="false" class="scoreboard" >
		<Panel id="Content" >
		</Panel>
	</Panel>
</root>
```

- Javascript
```js
"use strict";

function SetFlyoutScoreboardVisible( bVisible ) {
	$("#Content").visible = bVisible;
}

(function(){
	SetFlyoutScoreboardVisible(false);
	$.RegisterEventHandler( "DOTACustomUI_SetFlyoutScoreboardVisible", $.GetContextPanel(), SetFlyoutScoreboardVisible );
})()
```

## 载入界面 custom\_loading\_screen.xml

在content目录中`panorama/layout/custom_game/custom_loading_screen.xml`是载入界面的入口文件，玩家第一次进入或者重连都会触发这个界面。

## 基础样式

默认情况下，PUI的元素是没有任何样式的，所以一般都需要引入Dota2的基础样式

```xml
<styles>
	<include src="s2r://panorama/styles/dotastyles.vcss_c" />
</styles>
```

## 音效

可以使用API播放音效`Game.EmitSound(string sound)`

也可以通过CSS中的`sound`属性，可以使用音效事件播放

```css
Button:active {
    sound: "ui.contract_assign"
}
```