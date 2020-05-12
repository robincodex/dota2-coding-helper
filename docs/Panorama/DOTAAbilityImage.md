# DOTAAbilityImage

技能图标，用于显示技能图标，继承至Image，可以用技能的`EntityIndex`或`AbilityName`来显示技能的图标，而不必去读取技能的图标路径。可用于物品。

## 属性

- XML属性


| 属性名        | 类型      | 描述  |
| ------------- |:--------:| ----- |
| abilityname   | String  | 通过`AbilityName`显示技能的图标 |


- Javascript属性


| 属性名               | 类型      | 描述  |
| -------------------- |:--------:| ----- |
| abilityname          | String   | 通过`AbilityName`显示技能的图标 |
| contextEntityIndex   | Integer  | 通过`EntityIndex`显示技能的图标 |

## 范例

```xml
<DOTAAbilityImage abilityname="juggernaut_omni_slash" />
将会显示剑圣无敌斩技能图标
```
Javascript:

```xml
<DOTAAbilityImage id="abilityImage" />
```

```js
var hero = Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer());
$("#abilityImage").contextEntityIndex = Entities.GetAbility(hero, 3);
```

当玩家选择英雄剑圣，将会显示剑圣的无敌斩技能图标

![](./imgs/juggernaut_omni_slash.jpg)