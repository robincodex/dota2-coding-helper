# DOTAHeroMovie

英雄视频，这个在Dota2主界面的英雄那一块，当你鼠标滑动到一个英雄头像会弹出一个动画效果的英雄头像，这就是这个组件的效果

这个组件所使用的视频格式是`webm`，目前尚不知如何自定义这个`webm`格式

<video src="./imgs/npc_dota_hero_sven.webm" poster="./imgs/npc_dota_hero_sven.png" style="object-fit:fill;" width="128" height="169" autoplay="true" loop="true">
</video>

## 属性

| 属性名        | 类型      | 描述                       |
| ------------- |:--------:| -------------------------- |
| heroname      | String   | 英雄名称                   |
| heroid        | Integer  | 英雄ID                     |
| src           | String   | 视频源                     |
| controls      | String   | 播放控制器，"none"则去除     |
| repeat        | Boolean  | 是否重复播放                |
| autoplay      | String   | "onload"则载入完毕后自动播放 |
| scaling       | String   | "none"则不对视频进行伸缩 |
