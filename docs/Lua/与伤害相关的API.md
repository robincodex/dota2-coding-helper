# ApplyDamage

ApplyDamage是一个全局函数，也是最简单的造成伤害的API，只能对单个目标造成伤害

```lua
-- 假设这个函数通过KV中的RunScript调用
function OnCastTarget( keys )
    local damageInfo = {
        damage_type = DAMAGE_TYPE_PHYSICAL,  -- 伤害类型，参考常量DAMAGE_TYPES
        damage = 100,             -- 伤害值
        attacker = keys.caster,   -- 攻击者
        victim = keys.target,     -- 目标
        ability = keys.ability,   -- 技能
    }
    ApplyDamage(damageInfo)
end
```

# CTakeDamageInfo

这是一种新的造成伤害的API，功能比`ApplyDamage`丰富很多，方法是先调用`CreateDamageInfo`创建`CTakeDamageInfo`对象，然后通过对象来管理伤害信息，接着调用实体方法`CBaseEntity:TakeDamage`造成伤害，如果这个对象不使用了需要调用`DestroyDamageInfo`

这种方式虽然看起来挺好的，但是有些东西挺莫名其妙的，比如下面的damageForce，还有`CTakeDamageInfo`里面的ReportedPosition，待摸索

```lua
local damageForce = keys.target:GetAbsOrigin()
local damagePosition = keys.target:GetAbsOrigin()
local damageInfo = CreateDamageInfo( keys.ability, keys.caster, damageForce, damagePosition, 30, DAMAGE_TYPE_PHYSICAL )
damageInfo:SetCanBeBlocked(false)
keys.target:TakeDamage(damageInfo)
DestroyDamageInfo(damageInfo)
```

# DoCleaveAttack

DoCleaveAttack是一个全局函数，造成分裂攻击

`DoCleaveAttack(hCaster, hTarget, hAbility, flDamage, flDistance, flStartRadius ,flEndRadius, sParticleName )`

```lua
DoCleaveAttack( keys.caster, keys.target, keys.ability, 100, 200, 50, 100, "particles/..." )
```

# PerformAttack

PerformAttack是`CDOTA_BaseNPC`的方法，这个API就是模拟造成一次普通攻击，可以用来做多重攻击之类的

`PerformAttack( handle hTarget, bool bUseCastAttackOrb, bool bProcessProcs, bool bSkipCooldown, bool bIgnoreInvis, bool bUseProjectile, bool bFakeAttack, bool bNeverMiss )`

| 参数 | 描述 |
| ---- | ---- |
| bUseCastAttackOrb | 是否触发法球效果 |
| bProcessProcs | 目前测试结果是这个为false, bUseProjectile为true的话才会有投射物出现，其它方面的影响忘了~ |
| bSkipCooldown | 如果为true忽略攻击间隔 |
| bIgnoreInvis | 如果为true不可见单位依然可以受到伤害 |
| bUseProjectile | 是否使用投射物 |
| bFakeAttack | 如果为true就不会触发OnAttackLanded之类的事件，一般为true，如果设置为false并且放在OnAttackLanded之类的事件中容易发生死循环 |
| bNeverMiss | 如果为true就不会miss |

```lua
keys.caster:PerformAttack(keys.target, false, false, true, false, true, true, true)
```

# SetDamageFilter

这是一个很实用的API，因为DOTA2的伤害都会经过这个API，你可以通过这个API更改伤害值，或者直接免疫伤害。

关于DOTA2的伤害系统有一点比较蛋疼，我们基本拿到的都是税后伤害，并且没有附带技能实体，
所以你很难判断这次伤害事件来自哪个技能。

```lua
function DamageFilter( keys )
	local damage = keys.damage -- 这是税后伤害
	local damageType = keys.damagetype_const
	local attacker = EntIndexToHScript(keys.entindex_attacker_const or -1)
    local victim = EntIndexToHScript(keys.entindex_victim_const or -1)
    
    -- 这样就是强制将伤害修改成100
    -- 其它的诸如伤害类型等基本都不能更改
    keys.damage = 100
    
    -- 一般返回true
    return true

    -- 如果返回false就是免疫伤害了
	return false
end
GameRules:GetGameModeEntity():SetDamageFilter(DamageFilter)
```