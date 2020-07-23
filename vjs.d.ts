
type Vector = number[];
type QAngle = number[];

declare interface ITeamDetails {
    team_id: number;
    team_name: string;
    team_max_players: number;
    team_score: number;
    team_num_players: number;
}

declare interface IPlayerInfo {
    player_id: number;
    player_name: string;
    player_connection_state: number;
    player_steamid: string;
    player_kills: number;
    player_deaths: number;
    player_assists: number;
    player_selected_hero_id: number;
    player_selected_hero: string;
    player_selected_hero_entity_index: number;
    possible_hero_selection: string;
    player_level: number;
    player_respawn_seconds: number;
    player_gold: number;
    player_team_id: number;
    player_is_local: boolean;
    player_has_host_privileges: boolean;
}

declare interface IMapInfo {
    map_name: string;
    map_display_name: string;
}

declare type MouseCallbackEventType = 'pressed' | 'wheeled' | 'doublepressed';

type PanelEvent =
    | 'onactivate'
    | 'oncancel'
    | 'oncontextmenu'
    | 'ondblclick'
    | 'ondeselect'
    | 'oneconsetloaded'
    | 'onfilled'
    | 'onfindmatchend'
    | 'onfindmatchstart'
    | 'onfocus'
    | 'oninputsubmit'
    | 'onload'
    | 'onmouseactivate'
    | 'onmouseout'
    | 'onmouseover'
    | 'onmovedown'
    | 'onmoveleft'
    | 'onmoveright'
    | 'onmoveup'
    | 'onnotfilled'
    | 'onpagesetupsuccess'
    | 'onpopupsdismissed'
    | 'onselect'
    | 'ontabforward'
    | 'ontextentrychange'
    | 'ontextentrysubmit'
    | 'ontooltiploaded'
    | 'onvaluechanged';

declare interface IAsyncWebRequestResponse {
    statusText: string;
    responseText: string | null;
    status: number;
}

declare interface IAsyncWebRequestData {
    type?: string;
    timeout?: number;
    headers?: object;
    data?: object;
    success?(response: any, result: 'success', statusText: string): void;
    error?(data: IAsyncWebRequestResponse, result: 'error', statusText: string): void;
    complete?(data: IAsyncWebRequestResponse, result: 'success' | 'error'): void;
}

declare interface PrepareUnitOrdersArgument {
    OrderType: dotaunitorder_t;
    TargetIndex?: number;
    Position?: [number, number, number];
    AbilityIndex?: number;
    OrderIssuer?: PlayerOrderIssuer_t;
    UnitIndex?: number;
    QueueBehavior?: OrderQueueBehavior_t;
    ShowEffects?: boolean;
}

declare interface GameEvents {
    /**
     * Subscribe to a game event
     */
    Subscribe<T = any>( pEventName: string, callback: (data: T) => void ): number;
    /**
     * Unsubscribe from a game event
     */
    Unsubscribe( nCallbackHandle: number ): void;
    /**
     * Send a custom game event to the server
     */
    SendCustomGameEventToServer<T = any>( pEventName: string, data: T ): number;
    /**
     * Send a custom game event to the server, which will send it to all clients
     */
    SendCustomGameEventToAllClients<T = any>( pEventName: string, data: T ): number;
    /**
     * Send a custom game event to the server, which will then send it to one client
     */
    SendCustomGameEventToClient<T = any>( pEventName: string, playerIndex: number, data: T ): number;
    /**
     * Send a client-side event using gameeventmanager (only useful for a few specific events)
     */
    SendEventClientSide<T = any>( pEventName: string, data: T ): number;
}

declare interface CustomNetTables {
    /**
     * Get a key from a custom net table
     */
    GetTableValue( pTableName: string, pKeyName: string ): any;
    /**
     * Get all values from a custom net table
     */
    GetAllTableValues( pTableName: string ): any;
    /**
     * Register a callback when a particular custom net table changes
     */
    SubscribeNetTableListener( pTableName: string, callback: (pTableName: string, key: string, table: any) => void ): number;
    /**
     * Unsubscribe from a game event
     */
    UnsubscribeNetTableListener( nCallbackHandle: number ): void;
}

declare interface SteamUGC {
    /**
     * Subscribe to a piece of UGC
     */
    SubscribeItem( pPublishedFileID: string, callback: Function ): void;
    /**
     * Unsubscribe from a piece of UGC
     */
    UnsubscribeItem( pPublishedFileID: string, callback: Function ): void;
    /**
     * Get a key from a custom net table
     */
    GetSubscriptionInfo( pPublishedFileID: string ): any;
    /**
     * Vote on a piece of UGC
     */
    SetUserItemVote( pPublishedFileID: string, bVoteUp: boolean, callback: Function ): void;
    /**
     * Get the user&apos;s vote on a piece of UGC
     */
    GetUserItemVote( pPublishedFileID: string, callback: Function ): any;
    /**
     * Add an item to the user&apos;s favorites list
     */
    AddToFavorites( pPublishedFileID: string, callback: Function ): void;
    /**
     * Remove an item from the user&apos;s favorites list
     */
    RemoveFromFavorites( pPublishedFileID: string, callback: Function ): void;
    /**
     * Create a request to query Steam for all UGC
     */
    CreateQueryAllUGCRequest( eQueryType: number, eMatchingeMatchingUGCTypeFileType: number, unPage: number ): any;
    /**
     * Create a request to query Steam for specific UGC
     */
    CreateQueryUGCDetailsRequest( jsArray: any[] ): any;
    /**
     * Adds a required tag to the query
     */
    AddRequiredTagToQuery( handle: number, pchTag: string ): any;
    /**
     * Adds an excluded tag to the query
     */
    AddExcludedTagToQuery( handle: number, pchTag: string ): any;
    /**
     * Adds a required tag to the query
     */
    ConfigureQuery( handle: number, jsObject: object ): any;
    /**
     * Sends the prepared query
     */
    SendUGCQuery( handle: number, callback: Function ): any;
    /**
     * Register a callback to be called when the item is downloaded
     */
    RegisterDownloadItemResultCallback( pPublishedFileID: string, callback: Function ): any;
}

declare interface SteamFriends {
    /**
     * Requests the user&apos;s persona name
     */
    RequestPersonaName( pchSteamID: string, callback: Function ): void;
    /**
     * Sets the avatar image on the image panel
     */
    SetLargeAvatarImage( ...args: any[] ): void;
}

declare interface SteamUtils {
    /**
     * Returns the connected universe
     */
    GetConnectedUniverse(): any;
    /**
     * Returns the appid of the current app
     */
    GetAppID(): number;
}

declare interface VRUtils {
    /**
     * Get application properties for a VR app with the specified appID
     */
    GetVRAppPropertyData( nAppID: number ): any;
    /**
     * Launches a Steam application using OpenVR.
     */
    LaunchSteamApp( nAppID: number, pszLaunchSource: string ): any;
}

declare interface Buffs {
    GetName( nEntity: number, nBuff: number ): string;
    GetClass( nEntity: number, nBuff: number ): string;
    GetTexture( nEntity: number, nBuff: number ): string;
    GetDuration( nEntity: number, nBuff: number ): number;
    GetDieTime( nEntity: number, nBuff: number ): number;
    GetRemainingTime( nEntity: number, nBuff: number ): number;
    GetElapsedTime( nEntity: number, nBuff: number ): number;
    GetCreationTime( nEntity: number, nBuff: number ): number;
    GetStackCount( nEntity: number, nBuff: number ): number;
    IsDebuff( nEntity: number, nBuff: number ): boolean;
    IsHidden( nEntity: number, nBuff: number ): boolean;
    /**
     * Get the owner of the ability responsible for the modifier.
     */
    GetCaster( nEntity: number, nBuff: number ): number;
    /**
     * Get the unit the modifier is parented to.
     */
    GetParent( nEntity: number, nBuff: number ): number;
    /**
     * Get the ability that generated the modifier.
     */
    GetAbility( nEntity: number, nBuff: number ): number;
}

declare interface Players {
    /**
     * Get the maximum number of players in the game.
     */
    GetMaxPlayers(): number;
    /**
     * Get the maximum number of players on teams.
     */
    GetMaxTeamPlayers(): number;
    /**
     * Get the local player ID.
     */
    GetLocalPlayer(): number;
    /**
     * Is the nth player a valid player?
     */
    IsValidPlayerID( iPlayerID: number ): boolean;
    /**
     * Return the name of a player.
     */
    GetPlayerName( iPlayerID: number ): string;
    /**
     * Get the entity index of the hero controlled by this player.
     */
    GetPlayerHeroEntityIndex( iPlayerID: number ): number;
    /**
     * Get the entities this player has selected.
     */
    GetSelectedEntities( iPlayerID: number ): number[];
    /**
     * Get the entities this player is querying.
     */
    GetQueryUnit( iPlayerID: number ): number;
    /**
     * Get local player current portrait unit. (ie. Player&apos;s hero or primary selected unit.)
     */
    GetLocalPlayerPortraitUnit(): number;
    /**
     * Can the player buy back?
     */
    CanPlayerBuyback( iPlayerID: number ): boolean;
    /**
     * Does this player have a custom game ticket?
     */
    HasCustomGameTicketForPlayerID( iPlayerID: number ): boolean;
    /**
     * The number of assists credited to a player.
     */
    GetAssists( iPlayerID: number ): number;
    GetClaimedDenies( iPlayerID: number ): number;
    GetClaimedMisses( iPlayerID: number ): number;
    /**
     * The number of deaths a player has suffered.
     */
    GetDeaths( iPlayerID: number ): any;
    /**
     * The number of denies credited to a player.
     */
    GetDenies( iPlayerID: number ): number;
    /**
     * The amount of gold a player has.
     */
    GetGold( iPlayerID: number ): number;
    /**
     * The number of kills credited to a player.
     */
    GetKills( iPlayerID: number ): number;
    GetLastBuybackTime( iPlayerID: number ): number;
    GetLastHitMultikill( iPlayerID: number ): number;
    /**
     * The number of last hits credited to a player.
     */
    GetLastHits( iPlayerID: number ): number;
    GetLastHitStreak( iPlayerID: number ): number;
    /**
     * The current level of a player.
     */
    GetLevel( iPlayerID: number ): number;
    GetMisses( iPlayerID: number ): number;
    GetNearbyCreepDeaths( iPlayerID: number ): number;
    /**
     * Total reliable gold for this player.
     */
    GetReliableGold( iPlayerID: number ): number;
    GetRespawnSeconds( iPlayerID: number ): number;
    GetStreak( iPlayerID: number ): number;
    /**
     * Total gold earned in this game by this player.
     */
    GetTotalEarnedGold( iPlayerID: number ): number;
    /**
     * Total xp earned in this game by this player.
     */
    GetTotalEarnedXP( iPlayerID: number ): number;
    /**
     * Total unreliable gold for this player.
     */
    GetUnreliableGold( iPlayerID: number ): number;
    /**
     * Get the team this player is on.
     */
    GetTeam( iPlayerID: number ): DOTATeam_t;
    /**
     * Average gold earned per minute for this player.
     */
    GetGoldPerMin( iPlayerID: number ): number;
    /**
     * Average xp earned per minute for this player.
     */
    GetXPPerMin( iPlayerID: number ): number;
    /**
     * Return the name of the hero a player is controlling.
     */
    GetPlayerSelectedHero( iPlayerID: number ): number;
    /**
     * Get the player color.
     */
    GetPlayerColor( iPlayerID: number ): number;
    /**
     * Is this player a spectator.
     */
    IsSpectator( iPlayerID: number ): boolean;
    /**
     * .
     */
    PlayerPortraitClicked( nClickedPlayerID: number, bHoldingCtrl: boolean, bHoldingAlt: boolean ): void;
    /**
     * .
     */
    BuffClicked( nEntity: number, nBuffSerial: number, bAlert: boolean ): void;
    /**
     * Is the local player live spectating?
     */
    IsLocalPlayerLiveSpectating(): boolean;
    /**
     * If local player is in perspective camera, returns true. Else, false
     */
    IsLocalPlayerInPerspectiveCamera(): boolean;
    /**
     * If player is in perspective mode, returns the followed players entity index.  Else, -1.
     */
    GetPerspectivePlayerEntityIndex(): number;
    /**
     * If player is in perspective mode, returns the followed players id.  Else, -1.
     */
    GetPerspectivePlayerId(): number;
}

declare interface Entities {
    /**
     * Get the world origin of the entity.
     */
    GetAbsOrigin( nEntityIndex: number ): Vector;
    /**
     * Get the world angles of the entity.
     */
    GetAbsAngles( nEntityIndex: number ): QAngle;
    /**
     * Get the forward vector of the entity.
     */
    GetForward( nEntityIndex: number ): Vector;
    /**
     * Get the right vector of the entity.
     */
    GetRight( nEntityIndex: number ): Vector;
    /**
     * Get the up vector of the entity.
     */
    GetUp( nEntityIndex: number ): Vector;
    /**
     * Get all the building entities.
     */
    GetAllBuildingEntities(): number[];
    /**
     * Get all the hero entities.
     */
    GetAllHeroEntities(): number[];
    /**
     * Get all the entities with a given name.
     */
    GetAllEntitiesByName( pszName: string ): number[];
    /**
     * Get all the entities with a given classname.
     */
    GetAllEntitiesByClassname( pszName: string ): number[];
    /**
     * Get all the creature entities.
     */
    GetAllCreatureEntities(): number[];
    /**
     * Get all the entities.
     */
    GetAllEntities(): number[];
    CanBeDominated( nEntityIndex: number ): boolean;
    HasAttackCapability( nEntityIndex: number ): boolean;
    HasCastableAbilities( nEntityIndex: number ): boolean;
    HasFlyingVision( nEntityIndex: number ): boolean;
    HasFlyMovementCapability( nEntityIndex: number ): boolean;
    HasGroundMovementCapability( nEntityIndex: number ): boolean;
    HasMovementCapability( nEntityIndex: number ): boolean;
    HasScepter( nEntityIndex: number ): boolean;
    HasUpgradeableAbilities( nEntityIndex: number ): boolean;
    HasUpgradeableAbilitiesThatArentMaxed( nEntityIndex: number ): boolean;
    IsAlive( nEntityIndex: number ): boolean;
    IsAncient( nEntityIndex: number ): boolean;
    IsAttackImmune( nEntityIndex: number ): boolean;
    IsBarracks( nEntityIndex: number ): boolean;
    IsBlind( nEntityIndex: number ): boolean;
    IsBoss( nEntityIndex: number ): boolean;
    IsRoshan( nEntityIndex: number ): boolean;
    IsBuilding( nEntityIndex: number ): boolean;
    IsCommandRestricted( nEntityIndex: number ): boolean;
    IsConsideredHero( nEntityIndex: number ): boolean;
    IsControllableByAnyPlayer( nEntityIndex: number ): boolean;
    IsCourier( nEntityIndex: number ): boolean;
    IsCreature( nEntityIndex: number ): boolean;
    IsCreep( nEntityIndex: number ): boolean;
    IsCreepHero( nEntityIndex: number ): boolean;
    IsDeniable( nEntityIndex: number ): boolean;
    IsDominated( nEntityIndex: number ): boolean;
    IsEnemy( nEntityIndex: number ): boolean;
    IsEvadeDisabled( nEntityIndex: number ): boolean;
    IsFort( nEntityIndex: number ): boolean;
    IsFrozen( nEntityIndex: number ): boolean;
    IsGeneratedByEconItem( nEntityIndex: number ): boolean;
    IsHallofFame( nEntityIndex: number ): boolean;
    IsDisarmed( nEntityIndex: number ): boolean;
    IsHero( nEntityIndex: number ): boolean;
    IsHexed( nEntityIndex: number ): boolean;
    IsIllusion( nEntityIndex: number ): boolean;
    IsInRangeOfFountain( nEntityIndex: number ): boolean;
    IsInventoryEnabled( nEntityIndex: number ): boolean;
    IsInvisible( nEntityIndex: number ): boolean;
    IsInvulnerable( nEntityIndex: number ): boolean;
    IsLaneCreep( nEntityIndex: number ): boolean;
    IsLowAttackPriority( nEntityIndex: number ): boolean;
    IsMagicImmune( nEntityIndex: number ): boolean;
    IsMuted( nEntityIndex: number ): boolean;
    IsNeutralUnitType( nEntityIndex: number ): boolean;
    IsNightmared( nEntityIndex: number ): boolean;
    IsOther( nEntityIndex: number ): boolean;
    IsOutOfGame( nEntityIndex: number ): boolean;
    IsOwnedByAnyPlayer( nEntityIndex: number ): boolean;
    IsPhantom( nEntityIndex: number ): boolean;
    IsRangedAttacker( nEntityIndex: number ): boolean;
    IsRealHero( nEntityIndex: number ): boolean;
    IsRooted( nEntityIndex: number ): boolean;
    IsSelectable( nEntityIndex: number ): boolean;
    IsShop( nEntityIndex: number ): boolean;
    IsSilenced( nEntityIndex: number ): boolean;
    IsSpeciallyDeniable( nEntityIndex: number ): boolean;
    IsStunned( nEntityIndex: number ): boolean;
    IsSummoned( nEntityIndex: number ): boolean;
    IsTower( nEntityIndex: number ): boolean;
    IsUnselectable( nEntityIndex: number ): boolean;
    IsWard( nEntityIndex: number ): boolean;
    IsZombie( nEntityIndex: number ): boolean;
    NoHealthBar( nEntityIndex: number ): boolean;
    NoTeamMoveTo( nEntityIndex: number ): boolean;
    NoTeamSelect( nEntityIndex: number ): boolean;
    NotOnMinimap( nEntityIndex: number ): boolean;
    NotOnMinimapForEnemies( nEntityIndex: number ): boolean;
    NoUnitCollision( nEntityIndex: number ): boolean;
    PassivesDisabled( nEntityIndex: number ): boolean;
    ProvidesVision( nEntityIndex: number ): boolean;
    UsesHeroAbilityNumbers( nEntityIndex: number ): number[];
    IsMoving( nEntityIndex: number ): boolean;
    GetAbilityCount( nEntityIndex: number ): number;
    GetCombatClassAttack( nEntityIndex: number ): number;
    GetCombatClassDefend( nEntityIndex: number ): number;
    GetCurrentVisionRange( nEntityIndex: number ): number;
    GetDamageBonus( nEntityIndex: number ): number;
    GetDamageMax( nEntityIndex: number ): number;
    GetDamageMin( nEntityIndex: number ): number;
    GetDayTimeVisionRange( nEntityIndex: number ): number;
    GetHealth( nEntityIndex: number ): number;
    GetHealthPercent( nEntityIndex: number ): number;
    GetHealthThinkRegen( nEntityIndex: number ): number;
    GetLevel( nEntityIndex: number ): number;
    GetMaxHealth( nEntityIndex: number ): number;
    GetNightTimeVisionRange( nEntityIndex: number ): number;
    GetPlayerOwnerID( nEntityIndex: number ): number;
    GetStates( nEntityIndex: number ): number;
    GetTotalPurchasedUpgradeGoldCost( nEntityIndex: number ): number;
    GetTeamNumber( nEntityIndex: number ): DOTATeam_t;
    GetHealthBarOffset( nEntityIndex: number ): number;
    GetAttackRange( nEntityIndex: number ): number;
    GetAttackSpeed( nEntityIndex: number ): number;
    GetAttacksPerSecond( nEntityIndex: number ): number;
    GetBaseAttackTime( nEntityIndex: number ): number;
    GetBaseMagicalResistanceValue( nEntityIndex: number ): number;
    GetBaseMoveSpeed( nEntityIndex: number ): number;
    GetBonusPhysicalArmor( nEntityIndex: number ): number;
    GetCollisionPadding( nEntityIndex: number ): number;
    GetEffectiveInvisibilityLevel( nEntityIndex: number ): number;
    GetHasteFactor( nEntityIndex: number ): number;
    GetHullRadius( nEntityIndex: number ): number;
    GetIdealSpeed( nEntityIndex: number ): number;
    GetIncreasedAttackSpeed( nEntityIndex: number ): number;
    GetMana( nEntityIndex: number ): number;
    GetManaThinkRegen( nEntityIndex: number ): number;
    GetMaxMana( nEntityIndex: number ): number;
    GetMagicalArmorValue( nEntityIndex: number ): number;
    GetPaddedCollisionRadius( nEntityIndex: number ): number;
    GetPercentInvisible( nEntityIndex: number ): number;
    GetPhysicalArmorValue( nEntityIndex: number ): number;
    GetProjectileCollisionSize( nEntityIndex: number ): number;
    GetRingRadius( nEntityIndex: number ): number;
    GetSecondsPerAttack( nEntityIndex: number ): number;
    ManaFraction( nEntityIndex: number ): number;
    GetClassname( nEntityIndex: number ): string;
    GetDisplayedUnitName( nEntityIndex: number ): string;
    GetSelectionGroup( nEntityIndex: number ): number;
    GetSoundSet( nEntityIndex: number ): string;
    GetUnitLabel( nEntityIndex: number ): string;
    GetUnitName( nEntityIndex: number ): string;
    GetTotalDamageTaken( nEntityIndex: number ): number;
    IsControllableByPlayer( nEntityIndex: number, nPlayerIndex: number ): boolean;
    GetChosenTarget( nEntityIndex: number ): number;
    HasItemInInventory( nEntityIndex: number, pItemName: string ): boolean;
    GetRangeToUnit( nEntityIndex: number, nTarget: number ): number;
    IsEntityInRange( nEntityIndex: number, nTarget: number, flRange: number ): boolean;
    GetMoveSpeedModifier( nEntityIndex: number, flBaseSpeed: number ): number;
    CanAcceptTargetToAttack( nEntityIndex: number, nTarget: number ): boolean;
    InState( nEntityIndex: number, nState: modifierstate ): boolean;
    GetArmorForDamageType( nEntityIndex: number, iDamageType: DAMAGE_TYPES ): number;
    GetArmorReductionForDamageType( nEntityIndex: number, iDamageType: DAMAGE_TYPES ): number;
    IsInRangeOfShop( nEntityIndex: number, iShopType: DOTA_SHOP_TYPE, bSpecific: boolean ): boolean;
    GetNumItemsInStash( nEntityIndex: number ): number;
    GetNumItemsInInventory( nEntityIndex: number ): number;
    GetItemInSlot( nEntityIndex: number, nSlotIndex: number ): number;
    GetAbility( nEntityIndex: number, nSlotIndex: number ): number;
    GetAbilityByName( nEntityIndex: number, pszAbilityName: string ): string;
    GetNumBuffs( nEntityIndex: number ): number;
    GetBuff( nEntityIndex: number, nBufIndex: number ): number;
    GetAbilityPoints( nEntityIndex: number ): number;
    GetCurrentXP( nEntityIndex: number ): number;
    GetNeededXPToLevel( nEntityIndex: number ): number;
    /**
     * Get the currently selected entities
     */
    GetSelectionEntities( nEntityIndex: number ): number[];
    /**
     * Is this a valid entity index?
     */
    IsValidEntity( nEntityIndex: number ): boolean;
    /**
     * Is this entity an item container in the world?
     */
    IsItemPhysical( nEntityIndex: number ): boolean;
    /**
     * Get the item contained in this physical item container.
     */
    GetContainedItem( nEntityIndex: number ): number;
}

declare interface Abilities {
    GetAbilityName( nEntityIndex: number ): string;
    GetAbilityTextureName( nEntityIndex: number ): string;
    GetAssociatedPrimaryAbilities( nEntityIndex: number ): string;
    GetAssociatedSecondaryAbilities( nEntityIndex: number ): string;
    GetHotkeyOverride( nEntityIndex: number ): string;
    GetIntrinsicModifierName( nEntityIndex: number ): string;
    GetSharedCooldownName( nEntityIndex: number ): string;
    AbilityReady( nEntityIndex: number ): boolean;
    /**
     * Returns an AbilityLearnResult_t
     */
    CanAbilityBeUpgraded( nEntityIndex: number ): boolean;
    CanBeExecuted( nEntityIndex: number ): number;
    GetAbilityDamage( nEntityIndex: number ): number;
    GetAbilityDamageType( nEntityIndex: number ): DAMAGE_TYPES;
    GetAbilityTargetFlags( nEntityIndex: number ): DOTA_UNIT_TARGET_FLAGS;
    GetAbilityTargetTeam( nEntityIndex: number ): DOTA_UNIT_TARGET_TEAM;
    GetAbilityTargetType( nEntityIndex: number ): DOTA_UNIT_TARGET_TYPE;
    GetAbilityType( nEntityIndex: number ): ABILITY_TYPES;
    GetBehavior( nEntityIndex: number ): DOTA_ABILITY_BEHAVIOR;
    GetCastRange( nEntityIndex: number ): number;
    GetChannelledManaCostPerSecond( nEntityIndex: number ): number;
    GetCurrentCharges( nEntityIndex: number ): number;
    GetEffectiveLevel( nEntityIndex: number ): number;
    GetHeroLevelRequiredToUpgrade( nEntityIndex: number ): number;
    GetLevel( nEntityIndex: number ): number;
    GetManaCost( nEntityIndex: number ): number;
    GetMaxLevel( nEntityIndex: number ): number;
    AttemptToUpgrade( nEntityIndex: number ): boolean;
    CanLearn( nEntityIndex: number ): boolean;
    GetAutoCastState( nEntityIndex: number ): boolean;
    GetToggleState( nEntityIndex: number ): boolean;
    HasScepterUpgradeTooltip( nEntityIndex: number ): boolean;
    IsActivated( nEntityIndex: number ): boolean;
    IsActivatedChanging( nEntityIndex: number ): boolean;
    IsAttributeBonus( nEntityIndex: number ): boolean;
    IsAutocast( nEntityIndex: number ): boolean;
    IsCooldownReady( nEntityIndex: number ): boolean;
    IsDisplayedAbility( nEntityIndex: number ): boolean;
    IsHidden( nEntityIndex: number ): boolean;
    IsHiddenWhenStolen( nEntityIndex: number ): boolean;
    IsInAbilityPhase( nEntityIndex: number ): boolean;
    IsItem( nEntityIndex: number ): boolean;
    IsMarkedAsDirty( nEntityIndex: number ): boolean;
    IsMuted( nEntityIndex: number ): boolean;
    IsOnCastbar( nEntityIndex: number ): boolean;
    IsOnLearnbar( nEntityIndex: number ): boolean;
    IsOwnersGoldEnough( nEntityIndex: number ): boolean;
    IsOwnersGoldEnoughForUpgrade( nEntityIndex: number ): boolean;
    IsOwnersManaEnough( nEntityIndex: number ): boolean;
    IsPassive( nEntityIndex: number ): boolean;
    IsRecipe( nEntityIndex: number ): boolean;
    IsSharedWithTeammates( nEntityIndex: number ): boolean;
    IsStealable( nEntityIndex: number ): boolean;
    IsStolen( nEntityIndex: number ): boolean;
    IsToggle( nEntityIndex: number ): boolean;
    GetAOERadius( nEntityIndex: number ): number;
    GetBackswingTime( nEntityIndex: number ): number;
    GetCastPoint( nEntityIndex: number ): number;
    GetChannelStartTime( nEntityIndex: number ): number;
    GetChannelTime( nEntityIndex: number ): number;
    GetCooldown( nEntityIndex: number ): number;
    GetCooldownLength( nEntityIndex: number ): number;
    GetCooldownTime( nEntityIndex: number ): number;
    GetCooldownTimeRemaining( nEntityIndex: number ): number;
    GetDuration( nEntityIndex: number ): number;
    GetUpgradeBlend( nEntityIndex: number ): number;
    /**
     * Get the local player&apos;s current active ability. (Pre-cast targetting state.)
     */
    GetLocalPlayerActiveAbility(): number;
    GetCaster( nAbilityIndex: string ): number;
    GetCustomValueFor( nAbilityIndex: string, pszAbilityVarName: string ): number;
    GetLevelSpecialValueFor( nAbilityIndex: string, szName: string, nLevel: number ): number;
    GetSpecialValueFor( nAbilityIndex: string, szName: string ): number;
    IsCosmetic( nAbilityIndex: string, nTargetEntityIndex: number ): boolean;
    /**
     * Attempt to execute the specified ability (Equivalent to clicking the ability in the HUD action bar)
     */
    ExecuteAbility( nAbilityEntIndex: number, nCasterEntIndex: number, bIsQuickCast: boolean ): void;
    /**
     * Attempt to double-tap (self-cast) the specified ability (Equivalent to double-clicking the ability in the HUD action bar)
     */
    CreateDoubleTapCastOrder( nAbilityEntIndex: number, nCasterEntIndex: number ): void;
    /**
     * Ping the specified ability (Equivalent to alt-clicking the ability in the HUD action bar)
     */
    PingAbility( nAbilityIndex: string ): void;
    /**
     * Returns the keybind (as a string) for the specified ability.
     */
    GetKeybind( nAbilityEntIndex: number ): number;
}

declare interface Items {
    ShouldDisplayCharges( nEntityIndex: number ): number;
    AlwaysDisplayCharges( nEntityIndex: number ): number;
    ShowSecondaryCharges( nEntityIndex: number ): number;
    CanBeSoldByLocalPlayer( nEntityIndex: number ): boolean;
    CanDoubleTapCast( nEntityIndex: number ): boolean;
    ForceHideCharges( nEntityIndex: number ): boolean;
    IsAlertableItem( nEntityIndex: number ): boolean;
    IsCastOnPickup( nEntityIndex: number ): boolean;
    IsDisassemblable( nEntityIndex: number ): boolean;
    IsDroppable( nEntityIndex: number ): boolean;
    IsInnatelyDisassemblable( nEntityIndex: number ): boolean;
    IsKillable( nEntityIndex: number ): boolean;
    IsMuted( nEntityIndex: number ): boolean;
    IsPermanent( nEntityIndex: number ): boolean;
    IsPurchasable( nEntityIndex: number ): boolean;
    IsRecipe( nEntityIndex: number ): boolean;
    IsRecipeGenerated( nEntityIndex: number ): boolean;
    IsSellable( nEntityIndex: number ): boolean;
    IsStackable( nEntityIndex: number ): boolean;
    ProRatesChargesWhenSelling( nEntityIndex: number ): number;
    RequiresCharges( nEntityIndex: number ): number;
    CanBeExecuted( nEntityIndex: number ): number;
    GetCost( nEntityIndex: number ): number;
    GetCurrentCharges( nEntityIndex: number ): number;
    GetSecondaryCharges( nEntityIndex: number ): number;
    GetDisplayedCharges( nEntityIndex: number ): number;
    GetInitialCharges( nEntityIndex: number ): number;
    GetItemColor( nEntityIndex: number ): number;
    GetShareability( nEntityIndex: number ): number;
    GetAbilityTextureSF( nEntityIndex: number ): number;
    GetAssembledTime( nEntityIndex: number ): number;
    GetPurchaseTime( nEntityIndex: number ): number;
    GetPurchaser( nItemID: number ): number;
    /**
     * Attempt to have the local player disassemble the specified item. Returns false if the order wasn&apos;t issued.
     */
    LocalPlayerDisassembleItem( nItem: number ): void;
    /**
     * Attempt to have the local player drop the specified item from its stash. Returns false if the order wasn&apos;t issued.
     */
    LocalPlayerDropItemFromStash( nItem: number ): void;
    /**
     * Attempt to have the local player alert allies about the specified item. Returns false if the order wasn&apos;t issued.
     */
    LocalPlayerItemAlertAllies( nItem: number ): void;
    /**
     * Attempt to have the local player move the specified item to its stash. Returns false if the order wasn&apos;t issued.
     */
    LocalPlayerMoveItemToStash( nItem: number ): void;
    /**
     * Attempt to have the local player sell the specified item. Returns false if the order wasn&apos;t issued.
     */
    LocalPlayerSellItem( nItem: number ): void;
}

declare interface Game {
    Time(): number;
    GetGameTime(): number;
    GetGameFrameTime(): number;
    GetDOTATime( bIncludePreGame: boolean, bIncludeNegativeTime: boolean ): number;
    IsGamePaused(): boolean;
    IsInToolsMode(): boolean;
    IsInBanPhase(): boolean;
    /**
     * Return the team id of the winning team.
     */
    GetGameWinner(): number;
    GetStateTransitionTime(): number;
    /**
     * Get the difficulty setting of the game.
     */
    GetCustomGameDifficulty(): number;
    /**
     * Returns true if the user has enabled flipped HUD
     */
    IsHUDFlipped(): boolean;
    /**
     * Returns the width of the display.
     */
    GetScreenWidth(): number;
    /**
     * Returns the height of the display.
     */
    GetScreenHeight(): number;
    /**
     * Converts the specified x,y,z world co-ordinate into an x screen coordinate. Returns -1 if behind the camera
     */
    WorldToScreenX( x: number, y: number, z: number ): number;
    /**
     * Converts the specified x,y,z world co-ordinate into a y screen coordinate. Returns -1 if behind the camera
     */
    WorldToScreenY( x: number, y: number, z: number ): number;
    /**
     * Converts the specified x, y screen coordinates into a x, y, z world coordinates.
     */
    ScreenXYToWorld( nX: number, nY: number ): number[];
    /**
     * Returns the keybind (as a string) for the requested ability slot.
     */
    GetKeybindForAbility( iSlot: number ): string;
    /**
     * Returns the keybind (as a string) for the requested inventory slot.
     */
    GetKeybindForInventorySlot( iSlot: number ): string;
    /**
     * Returns the keybind (as a string).
     */
    GetKeybindForCommand( nCommand: DOTAKeybindCommand_t ): string;
    /**
     * Create a new keybind.
     */
    CreateCustomKeyBind( pszKey: string, pszCommand: string ): void;
    GetNianFightTimeLeft(): void;
    GetState(): DOTA_GameState;
    GameStateIs( nState: DOTA_GameState ): boolean;
    GameStateIsBefore( nState: DOTA_GameState ): boolean;
    GameStateIsAfter( nState: DOTA_GameState ): boolean;
    AddCommand( pszCommandName: string, callback: Function, pszDescription: string, nFlags: number ): void;
    GetLocalPlayerID(): number;
    /**
     * Assign the local player to the specified team
     */
    PlayerJoinTeam( nTeamID: DOTATeam_t ): void;
    /**
     * Assign the currently unassigned players to teams
     */
    AutoAssignPlayersToTeams(): void;
    /**
     * Shuffle the team assignments of all of the players currently assigned to a team.
     */
    ShufflePlayerTeamAssignments(): void;
    /**
     * Set the remaining seconds in team setup before the game starts. -1 to stop the countdown timer
     */
    SetRemainingSetupTime( flSeconds: number ): void;
    /**
     * Set the amount of time in seconds that will be set as the remaining time when all players are assigned to a team.
     */
    SetAutoLaunchDelay( flSeconds: number ): void;
    /**
     * Enable or disable automatically starting the game once all players are assigned to a team
     */
    SetAutoLaunchEnabled( bEnable: boolean ): void;
    /**
     * Return true of false indicating if automatically starting the game is enabled.
     */
    GetAutoLaunchEnabled(): boolean;
    /**
     * Lock the team selection preventing players from swiching teams.
     */
    SetTeamSelectionLocked( bLockTeams: boolean ): void;
    /**
     * Returns true or false to indicate if team selection is locked
     */
    GetTeamSelectionLocked(): boolean;
    /**
     * Get all team IDs
     */
    GetAllTeamIDs(): DOTATeam_t[];
    /**
     * Get all player IDs
     */
    GetAllPlayerIDs(): number[];
    /**
     * Get unassigned player IDs
     */
    GetUnassignedPlayerIDs(): number[];
    /**
     * Get info about the player hero ultimate ability
     */
    GetPlayerUltimateStateOrTime( nPlayerID: number ): number;
    /**
     * Whether the local player has muted text and voice chat for the specified player id
     */
    IsPlayerMuted( nPlayerID: number ): boolean;
    /**
     * Set whether the local player has muted text and voice chat for the specified player id
     */
    SetPlayerMuted( nPlayerID: number, bMuted: boolean ): void;
    /**
     * Get detailed information for the given team
     */
    GetTeamDetails( nTeam: DOTATeam_t ): ITeamDetails;
    /**
     * Get details for the local player
     */
    GetLocalPlayerInfo(): IPlayerInfo;
    /**
     * Get info about the player items.
     */
    GetPlayerItems( nPlayerID: number ): number[];
    /**
     * Get info about the given player
     */
    GetPlayerInfo( nPlayerID: number ): IPlayerInfo;
    /**
     * Get player IDs for the given team
     */
    GetPlayerIDsOnTeam( nTeam: DOTATeam_t ): number[];
    ServerCmd( pMsg: string ): void;
    SetDotaRefractHeroes( bEnabled: boolean ): void;
    FinishGame(): void;
    Disconnect(): void;
    FindEventMatch(): any;
    /**
     * Emit a sound for the local player. Returns an integer handle that can be passed to StopSound. (Returns 0 on failure.)
     */
    EmitSound( pSoundEventName: string ): number;
    /**
     * Stop a current playing sound on the local player. Takes handle from a call to EmitSound.
     */
    StopSound( nHandle: number ): void;
    /**
     * Ask whether the in game shop is open.
     */
    IsShopOpen(): boolean;
    /**
     * Set custom shop context.
     */
    SetCustomShopEntityString( pszCustomShopEntityString: string ): string;
    /**
     * Return information about the current map.
     */
    GetMapInfo(): IMapInfo;
    /**
     * Orders from the local player - takes a single arguments object that supports: dotaunitorder_t OrderType, ent_index TargetIndex, vector Position, ent_index AbilityIndex, OrderIssuer_t OrderIssuer, ent_index UnitIndex, OrderQueueBehavior_t QueueBehavior, bool ShowEffects.
     */
    PrepareUnitOrders( args: PrepareUnitOrdersArgument ): void;
    /**
     * Order a unit to drop the specified item at the current cursor location.
     */
    DropItemAtCursor( nControlledUnitEnt: number, nItemEnt: number ): void;
    /**
     * Calculate 2D length.
     */
    Length2D( vec1: Vector, vec2: Vector ): number;
    /**
     * Returns normalized vector.
     */
    Normalized( vec: Vector ): number[];
    EnterAbilityLearnMode(): void;
    EndAbilityLearnMode(): void;
    IsInAbilityLearnMode(): boolean;
}

declare interface GameUI {
    /**
     * Control whether the default UI is enabled
     */
    SetDefaultUIEnabled( nElementType: number, bVisible: boolean ): void;
    /**
     * Get the current UI configuration
     */
    CustomUIConfig(): any;
    /**
     * Create a minimap ping at the given location
     */
    PingMinimapAtLocation( vec: Vector ): void;
    /**
     * Install a mouse input filter
     */
    SetMouseCallback( callback: (eventName: MouseCallbackEventType, mouseButton: number) => boolean ): void;
    EnableAliMode( bEnable: boolean, nPort: number, offsetVal: number, flScale: number ): void;
    /**
     * Get the current mouse position.
     */
    GetCursorPosition(): number[];
    /**
     * Return the entity index of the entity under the given screen position.
     */
    FindScreenEntities(): {entityIndex: number;accurateCollision: boolean;}[];
    /**
     * Get the world position of the screen position, or null if the cursor is out of the world.
     */
    GetScreenWorldPosition(): number[];
    /**
     * Install a mouse input filter
     */
    WasMousePressed( nButtonNum: number ): boolean;
    /**
     * Install a mouse input filter
     */
    WasMouseDoublePressed( nButtonNum: number ): boolean;
    /**
     * Install a mouse input filter
     */
    IsMouseDown( nButtonNum: number ): boolean;
    /**
     * Is the shift button pressed?
     */
    IsShiftDown(): boolean;
    /**
     * Is the alt button pressed?
     */
    IsAltDown(): boolean;
    /**
     * Is the control button pressed?
     */
    IsControlDown(): boolean;
    /**
     * Get the current UI click interaction mode.
     */
    GetClickBehaviors(): CLICK_BEHAVIORS;
    /**
     * Select a unit, adding it to the group or replacing the current selection.
     */
    SelectUnit( nEntityIndex: number, bAddToGroup: boolean ): void;
    /**
     * Get the current look at position.
     */
    GetCameraLookAtPosition(): number[];
    /**
     * Get the current camera position.
     */
    GetCameraPosition(): number[];
    /**
     * Get the current look at position height offset.
     */
    GetCameraLookAtPositionHeightOffset(): number;
    /**
     * Set the minimum camera pitch angle.
     */
    SetCameraPitchMin( flPitchMin: number ): void;
    /**
     * Set the maximum camera pitch angle.
     */
    SetCameraPitchMax( flPitchMax: number ): void;
    /**
     * Set the camera&apos;s yaw.
     */
    SetCameraYaw( flCameraYaw: number ): void;
    /**
     * Get the camera&apos;s yaw.
     */
    GetCameraYaw(): number;
    /**
     * Offset the camera&apos;s look at point.
     */
    SetCameraLookAtPositionHeightOffset( flCameraLookAtHeightOffset: number ): void;
    /**
     * Set the camera from a lateral position.
     */
    SetCameraPositionFromLateralLookAtPosition( x: number, y: number ): void;
    /**
     * Set whether the camera should automatically adjust to average terrain height.
     */
    SetCameraTerrainAdjustmentEnabled( bEnabled: boolean ): void;
    /**
     * Set the camera distance from the look at point.
     */
    SetCameraDistance( flDistance: number ): void;
    /**
     * Set the gap between the bottom of the screen and the game rendering viewport. (Value expressed as pixels in a normalized 1024x768 viewport.)
     */
    SetRenderBottomInsetOverride( nInset: number ): void;
    /**
     * Set the gap between the top of the screen and the game rendering viewport. (Value expressed as pixels in a normalized 1024x768 viewport.)
     */
    SetRenderTopInsetOverride( nInset: number ): void;
    /**
     * Set the camera target for the local player, or -1 to clear.
     */
    SetCameraTarget( nTargetEntIndex: number ): void;
    /**
     * Set the camera target as position for the local player over specified lerp.
     */
    SetCameraTargetPosition( vec: Vector, flLerp: number ): void;
    /**
     * Moves the camera to an entity, but doesn&apos;t lock the camera on that entity.
     */
    MoveCameraToEntity( nTargetEntIndex: number ): void;
    /**
     * Converts the specified x,y,z world co-ordinate into an x,y screen coordinate. Will clamp position to always be in front of camera.  Position returned as 0-&gt;1.0
     */
    WorldToScreenXYClamped( vec: Vector ): number[];
    /**
     * Get the current players scoreboard score for the specified zone.
     */
    GetPlayerScoreboardScore( pszScoreboardName: string ): any;
    /**
     * Send a custom client side error message with passed string and soundevent.
     */
    SendCustomHUDError( pszErrorText: string, pszErrorSound: string ): void;
    /**
     * Given a passed ability, replace the special value variables in the passed localized text.
     */
    ReplaceDOTAAbilitySpecialValues( ability: number ): void;
}

declare interface Particles {
    /**
     * Create a particle system
     */
    CreateParticle( pParticleName: string, nAttachType: number, nEntityToAttach: number): number;
    /**
     * Release a particle system
     */
    ReleaseParticleIndex( iIndex: number ): void;
    /**
     * Destroy a particle system
     */
    DestroyParticleEffect( iIndex: number, bDestroyImmediately: boolean ): void;
    /**
     * Set a control point on a particle system
     */
    SetParticleControl( iIndex: number, iPoint: number, vPosVal: Vector ): void;
    /**
     * Set the orientation on a control point on a particle system
     */
    SetParticleControlForward( iIndex: number, iPoint: number, vForwardVal: Vector ): void;
    SetParticleAlwaysSimulate( iIndex: number ): void;
    /**
     * Set a control point to track an entity on a particle system
     */
    SetParticleControlEnt( iIndex: number, iPoint: number, iEntIndex: number, iAttachType: number, pszAttachName: string, vecFallbackPositionVal: Vector, bIncludeWearables: boolean ): void;
}

declare interface EventData {
    /**
     * Get the score of an EventAction
     */
    GetEventActionScore( unEventID: number, unActionID: number ): any;
    /**
     * Get a periodic resource value used
     */
    GetPeriodicResourceUsed( unPeriodicResourceID: number ): any;
    /**
     * Get a periodic resource value max
     */
    GetPeriodicResourceMax( unPeriodicResourceID: number ): any;
}

declare interface LocalInventory {
    /**
     * Does the player have an inventory item of a given item definition index?
     */
    HasItemByDefinition( nDefIndex: number ): boolean;
}

declare interface $ {
    /**
     * $<Label>("#label-id")
     */
    <T = Panel>(id: string) : T;
    /**
     * Log a message
     */
    Msg( ...args: any[] ): void;
    /**
     * Trigger an assert
     */
    AssertHelper( ...args: any[] ): void;
    /**
     * Log a warning message to specified channel
     */
    Warning( ...args: any[] ): void;
    /**
     * Dispatch an event
     */
    DispatchEvent( event: string, panel: Panel, ...args: any[] ): void;
    /**
     * Dispatch an event
     */
    DispatchEvent( event: string, panelID?: string, ...args: any[] ): void;
    /**
     * Dispatch an event to occur later
     */
    DispatchEventAsync( delay: number, event: string, panelID?: string, ...args: any[] ): void;
    /**
     * Dispatch an event to occur later
     */
    DispatchEventAsync( delay: number, event: string, panel: Panel, ...args: any[] ): void;
    /**
     * Register an event handler
     */
    RegisterEventHandler( event: string, parent: Panel, handler: (...args: any[]) => void ): void;
    /**
     * Register a handler for an event that is not otherwise handled
     */
    RegisterForUnhandledEvent( event: string, handler: (...args: any[]) => void ): number;
    /**
     * Remove an unhandled event handler
     */
    UnregisterForUnhandledEvent( event: string, handle: number ): void;
    /**
     * Find an element
     */
    FindChildInContext( selector: string ): Panel | undefined;
    /**
     * Make a web request
     */
    AsyncWebRequest( url: string, args: IAsyncWebRequestData ): void;
    /**
     * Create a new panel
     */
    CreatePanel( tagName: string, parent: Panel, id: string ): Panel | undefined;
    CreatePanel( tagName: 'Button', parent: Panel, id: string ): Button | undefined;
    CreatePanel( tagName: 'Carousel', parent: Panel, id: string ): Carousel | undefined;
    CreatePanel( tagName: 'DOTAAbilityImage', parent: Panel, id: string ): DOTAAbilityImage | undefined;
    CreatePanel( tagName: 'DOTAAbilityPanel', parent: Panel, id: string ): DOTAAbilityPanel | undefined;
    CreatePanel( tagName: 'DOTAAvatarImage', parent: Panel, id: string ): DOTAAvatarImage | undefined;
    CreatePanel( tagName: 'DOTAHTMLPanel', parent: Panel, id: string ): DOTAHTMLPanel | undefined;
    CreatePanel( tagName: 'DOTAHeroImage', parent: Panel, id: string ): DOTAHeroImage | undefined;
    CreatePanel( tagName: 'DOTAItemImage', parent: Panel, id: string ): DOTAItemImage | undefined;
    CreatePanel( tagName: 'DOTAScenePanel', parent: Panel, id: string ): DOTAScenePanel | undefined;
    CreatePanel( tagName: 'DOTAUserName', parent: Panel, id: string ): DOTAUserName | undefined;
    CreatePanel( tagName: 'DropDown', parent: Panel, id: string ): DropDown | undefined;
    CreatePanel( tagName: 'Image', parent: Panel, id: string ): Image | undefined;
    CreatePanel( tagName: 'Label', parent: Panel, id: string ): Label | undefined;
    CreatePanel( tagName: 'Movie', parent: Panel, id: string ): Movie | undefined;
    CreatePanel( tagName: 'NumberEntry', parent: Panel, id: string ): NumberEntry | undefined;
    CreatePanel( tagName: 'ProgressBar', parent: Panel, id: string ): ProgressBar | undefined;
    CreatePanel( tagName: 'RadioButton', parent: Panel, id: string ): RadioButton | undefined;
    CreatePanel( tagName: 'TabButton', parent: Panel, id: string ): TabButton | undefined;
    CreatePanel( tagName: 'TextButton', parent: Panel, id: string ): TextButton | undefined;
    CreatePanel( tagName: 'TextEntry', parent: Panel, id: string ): TextEntry | undefined;
    CreatePanel( tagName: 'ToggleButton', parent: Panel, id: string ): ToggleButton | undefined;
    /**
     * Create a new panel supplying a JS object as a fourth parameter containing properties to be applied to the panel
     */
    CreatePanelWithProperties( tagName: string, parent: Panel, id: string, properties: {[key: string]: string} ): Panel | undefined;
    CreatePanelWithProperties( tagName: 'Button', parent: Panel, id: string, properties: {[key: string]: string} ): Button | undefined;
    CreatePanelWithProperties( tagName: 'Carousel', parent: Panel, id: string, properties: {[key: string]: string} ): Carousel | undefined;
    CreatePanelWithProperties( tagName: 'DOTAAbilityImage', parent: Panel, id: string, properties: {[key: string]: string} ): DOTAAbilityImage | undefined;
    CreatePanelWithProperties( tagName: 'DOTAAbilityPanel', parent: Panel, id: string, properties: {[key: string]: string} ): DOTAAbilityPanel | undefined;
    CreatePanelWithProperties( tagName: 'DOTAAvatarImage', parent: Panel, id: string, properties: {[key: string]: string} ): DOTAAvatarImage | undefined;
    CreatePanelWithProperties( tagName: 'DOTAHTMLPanel', parent: Panel, id: string, properties: {[key: string]: string} ): DOTAHTMLPanel | undefined;
    CreatePanelWithProperties( tagName: 'DOTAHeroImage', parent: Panel, id: string, properties: {[key: string]: string} ): DOTAHeroImage | undefined;
    CreatePanelWithProperties( tagName: 'DOTAItemImage', parent: Panel, id: string, properties: {[key: string]: string} ): DOTAItemImage | undefined;
    CreatePanelWithProperties( tagName: 'DOTAScenePanel', parent: Panel, id: string, properties: {[key: string]: string} ): DOTAScenePanel | undefined;
    CreatePanelWithProperties( tagName: 'DOTAUserName', parent: Panel, id: string, properties: {[key: string]: string} ): DOTAUserName | undefined;
    CreatePanelWithProperties( tagName: 'DropDown', parent: Panel, id: string, properties: {[key: string]: string} ): DropDown | undefined;
    CreatePanelWithProperties( tagName: 'Image', parent: Panel, id: string, properties: {[key: string]: string} ): Image | undefined;
    CreatePanelWithProperties( tagName: 'Label', parent: Panel, id: string, properties: {[key: string]: string} ): Label | undefined;
    CreatePanelWithProperties( tagName: 'Movie', parent: Panel, id: string, properties: {[key: string]: string} ): Movie | undefined;
    CreatePanelWithProperties( tagName: 'NumberEntry', parent: Panel, id: string, properties: {[key: string]: string} ): NumberEntry | undefined;
    CreatePanelWithProperties( tagName: 'ProgressBar', parent: Panel, id: string, properties: {[key: string]: string} ): ProgressBar | undefined;
    CreatePanelWithProperties( tagName: 'RadioButton', parent: Panel, id: string, properties: {[key: string]: string} ): RadioButton | undefined;
    CreatePanelWithProperties( tagName: 'TabButton', parent: Panel, id: string, properties: {[key: string]: string} ): TabButton | undefined;
    CreatePanelWithProperties( tagName: 'TextButton', parent: Panel, id: string, properties: {[key: string]: string} ): TextButton | undefined;
    CreatePanelWithProperties( tagName: 'TextEntry', parent: Panel, id: string, properties: {[key: string]: string} ): TextEntry | undefined;
    CreatePanelWithProperties( tagName: 'ToggleButton', parent: Panel, id: string, properties: {[key: string]: string} ): ToggleButton | undefined;
    /**
     * Localize a string
     */
    Localize( key: string, panel?: Panel ): string;
    /**
     * Get the current language
     */
    Language(): string;
    /**
     * Schedule a function to be called later
     */
    Schedule(delay: number, callback: () => void): number;
    /**
     * Cancelse a scheduled function
     */
    CancelScheduled( scheduledId: number ): void;
    /**
     * Get the current panel context
     */
    GetContextPanel(): Panel;
    /**
     * Register a key binding
     */
    RegisterKeyBind( context: Panel, keyName: string, callback: Function ): void;
    /**
     * Call a function on each given item
     */
    Each( ...args: any[] ): void;
    /**
     * Call during JS startup code to check if script is being reloaded
     */
    DbgIsReloadingScript(): boolean;
    /**
     * Convert a string to HTML-safe
     */
    HTMLEscape( text: string ): string;
    /**
     * Create a logging channel
     */
    LogChannel( ...args: any[] ): any;
}

declare interface Panel {
    visible: boolean;
    enabled: boolean;
    checked: boolean;
    defaultfocus: string;
    inputnamespace: string;
    hittest: boolean;
    hittestchildren: boolean;
    tabindex: number;
    selectionpos_x: number;
    selectionpos_y: number;
    id: string;
    layoutfile: string;
    contentwidth: number;
    contentheight: number;
    desiredlayoutwidth: number;
    desiredlayoutheight: number;
    actuallayoutwidth: number;
    actuallayoutheight: number;
    actualxoffset: number;
    actualyoffset: number;
    scrolloffset_y: number;
    scrolloffset_x: number;
    actualuiscale_y: number;
    actualuiscale_x: number;
    style(): any;
    AddClass( name: string ): void;
    RemoveClass( name: string ): void;
    BHasClass( name: string ): boolean;
    BAscendantHasClass( name: string ): boolean;
    SetHasClass( name: string, enable: boolean ): void;
    ToggleClass( name: string ): void;
    SwitchClass( name1: string, name2: string ): void;
    TriggerClass( name: string ): void;
    ClearPanelEvent( name: string ): void;
    SetDraggable( b?: boolean ): void;
    IsDraggable(): boolean;
    GetChildCount(): number;
    GetChild( index: number ): Panel;
    GetChildIndex(): number;
    Children(): Panel[];
    FindChildrenWithClassTraverse( className: string ): Panel | undefined;
    GetParent(): Panel;
    SetParent( panel: Panel ): void;
    FindChild( id: string ): Panel;
    FindChildTraverse( id: string ): Panel;
    FindChildInLayoutFile( f: string ): Panel;
    FindPanelInLayoutFile( f: string ): Panel;
    RemoveAndDeleteChildren(): void;
    MoveChildBefore( source: Panel, target: Panel ): void;
    MoveChildAfter( source: Panel, target: Panel ): void;
    GetPositionWithinWindow(): number[];
    ApplyStyles( b: boolean ): void;
    ClearPropertyFromCode( ...args: any[] ): void;
    DeleteAsync( delay: number ): void;
    BIsTransparent(): boolean;
    BAcceptsInput(): boolean;
    BAcceptsFocus(): boolean;
    SetFocus(): void;
    UpdateFocusInContext(): void;
    BHasHoverStyle(): boolean;
    SetAcceptsFocus( b: boolean ): void;
    SetDisableFocusOnMouseDown( b: boolean ): void;
    BHasKeyFocus(): boolean;
    SetScrollParentToFitWhenFocused( b: boolean ): void;
    BScrollParentToFitWhenFocused(): boolean;
    IsSelected(): boolean;
    BHasDescendantKeyFocus(): boolean;
    BLoadLayout( filePath: string, reload: boolean, usingParentContext: boolean ): boolean;
    BLoadLayoutFromString( content: string, reload: boolean, usingParentContext: boolean ): boolean;
    LoadLayoutFromStringAsync( content: string, reload: boolean, usingParentContext: boolean ): void;
    LoadLayoutAsync( filePath: string, reload: boolean, usingParentContext: boolean ): void;
    BLoadLayoutSnippet( name: string ): void;
    BHasLayoutSnippet( name: string ): boolean;
    BCreateChildren( content: string ): boolean;
    SetTopOfInputContext( b: boolean ): void;
    SetDialogVariable( key: string, value: string ): void;
    SetDialogVariableInt( key: string, value: number ): void;
    SetDialogVariableTime( key: string, value: number ): void;
    ScrollToTop(): void;
    ScrollToBottom(): void;
    ScrollToLeftEdge(): void;
    ScrollToRightEdge(): void;
    ScrollParentToMakePanelFit( unknownParam: any, b: boolean ): void;
    BCanSeeInParentScroll(): boolean;
    GetAttributeInt( key: string, defaultValue: number ): number;
    GetAttributeString( key: string, defaultValue: string ): string;
    GetAttributeUInt32( key: string, defaultValue: number ): number;
    SetAttributeInt( key: string, value: number ): void;
    SetAttributeString( key: string, value: string ): void;
    SetAttributeUInt32( key: string, value: number ): void;
    SetInputNamespace( name: string ): void;
    RegisterForReadyEvents( b: boolean ): void;
    BReadyForDisplay(): boolean;
    SetReadyForDisplay( b: boolean ): void;
    SetPositionInPixels( x: number, y: number, z: number ): void;
    Data(): any;
    SetPanelEvent( eventName: PanelEvent, callback: Function): void;
    RunScriptInPanelContext( ...args: any[] ): void;
    rememberchildfocus: boolean;
    paneltype: string;
}

declare interface TabButton extends Panel {
    visible: boolean;
    enabled: boolean;
    checked: boolean;
    defaultfocus: string;
    inputnamespace: string;
    hittest: boolean;
    hittestchildren: boolean;
    tabindex: number;
    selectionpos_x: number;
    selectionpos_y: number;
    id: string;
    layoutfile: string;
    contentwidth: number;
    contentheight: number;
    desiredlayoutwidth: number;
    desiredlayoutheight: number;
    actuallayoutwidth: number;
    actuallayoutheight: number;
    actualxoffset: number;
    actualyoffset: number;
    scrolloffset_y: number;
    scrolloffset_x: number;
    actualuiscale_y: number;
    actualuiscale_x: number;
    style(): any;
    AddClass( name: string ): void;
    RemoveClass( name: string ): void;
    BHasClass( name: string ): boolean;
    BAscendantHasClass( name: string ): boolean;
    SetHasClass( name: string, enable: boolean ): void;
    ToggleClass( name: string ): void;
    SwitchClass( name1: string, name2: string ): void;
    TriggerClass( name: string ): void;
    ClearPanelEvent( name: string ): void;
    SetDraggable( b?: boolean ): void;
    IsDraggable(): boolean;
    GetChildCount(): number;
    GetChild( index: number ): Panel;
    GetChildIndex(): number;
    Children(): Panel[];
    FindChildrenWithClassTraverse( className: string ): Panel | undefined;
    GetParent(): Panel;
    SetParent( panel: Panel ): void;
    FindChild( id: string ): Panel;
    FindChildTraverse( id: string ): Panel;
    FindChildInLayoutFile( f: string ): Panel;
    FindPanelInLayoutFile( f: string ): Panel;
    RemoveAndDeleteChildren(): void;
    MoveChildBefore( source: Panel, target: Panel ): void;
    MoveChildAfter( source: Panel, target: Panel ): void;
    GetPositionWithinWindow(): number[];
    ApplyStyles( b: boolean ): void;
    ClearPropertyFromCode( ...args: any[] ): void;
    DeleteAsync( delay: number ): void;
    BIsTransparent(): boolean;
    BAcceptsInput(): boolean;
    BAcceptsFocus(): boolean;
    SetFocus(): void;
    UpdateFocusInContext(): void;
    BHasHoverStyle(): boolean;
    SetAcceptsFocus( b: boolean ): void;
    SetDisableFocusOnMouseDown( b: boolean ): void;
    BHasKeyFocus(): boolean;
    SetScrollParentToFitWhenFocused( b: boolean ): void;
    BScrollParentToFitWhenFocused(): boolean;
    IsSelected(): boolean;
    BHasDescendantKeyFocus(): boolean;
    BLoadLayout( filePath: string, reload: boolean, usingParentContext: boolean ): boolean;
    BLoadLayoutFromString( content: string, reload: boolean, usingParentContext: boolean ): boolean;
    LoadLayoutFromStringAsync( content: string, reload: boolean, usingParentContext: boolean ): void;
    LoadLayoutAsync( filePath: string, reload: boolean, usingParentContext: boolean ): void;
    BLoadLayoutSnippet( name: string ): void;
    BHasLayoutSnippet( name: string ): boolean;
    BCreateChildren( content: string ): boolean;
    SetTopOfInputContext( b: boolean ): void;
    SetDialogVariable( key: string, value: string ): void;
    SetDialogVariableInt( key: string, value: number ): void;
    SetDialogVariableTime( key: string, value: number ): void;
    ScrollToTop(): void;
    ScrollToBottom(): void;
    ScrollToLeftEdge(): void;
    ScrollToRightEdge(): void;
    ScrollParentToMakePanelFit( unknownParam: any, b: boolean ): void;
    BCanSeeInParentScroll(): boolean;
    GetAttributeInt( key: string, defaultValue: number ): number;
    GetAttributeString( key: string, defaultValue: string ): string;
    GetAttributeUInt32( key: string, defaultValue: number ): number;
    SetAttributeInt( key: string, value: number ): void;
    SetAttributeString( key: string, value: string ): void;
    SetAttributeUInt32( key: string, value: number ): void;
    SetInputNamespace( name: string ): void;
    RegisterForReadyEvents( b: boolean ): void;
    BReadyForDisplay(): boolean;
    SetReadyForDisplay( b: boolean ): void;
    SetPositionInPixels( x: number, y: number, z: number ): void;
    Data(): any;
    SetPanelEvent( eventName: string, callback: Function): void;
    RunScriptInPanelContext( ...args: any[] ): void;
    rememberchildfocus: boolean;
    paneltype: string;
}

declare interface Button extends Panel {
}

declare interface Label extends Panel {
    text: string;
    html: boolean;
}

declare interface TextButton extends Panel {
    text: string;
}

declare interface RadioButton extends Panel {
    GetSelectedButton(): RadioButton;
}

declare interface ToggleButton extends Panel {
    SetSelected( b: boolean ): void;
    text: string;
}

declare interface DropDown extends Panel {
    AddOption( id: string, text: string ): void;
    HasOption( id: string ): boolean;
    RemoveOption( id: string ): void;
    RemoveAllOptions(): void;
    GetSelected(): string;
    SetSelected( id: string ): void;
    FindDropDownMenuChild( id: string ): Panel;
    AccessDropDownMenu(): void;
}

declare interface ProgressBar extends Panel {
    value: number;
    min: number;
    max: number;
}

declare interface TextEntry extends Panel {
    text: string;
    SetMaxChars( count: number ): void;
    GetMaxCharCount(): number;
    GetCursorOffset(): number;
    SetCursorOffset( offset: number ): void;
    ClearSelection(): void;
    SelectAll(): void;
    RaiseChangeEvents( b: boolean ): void;
}

declare interface SlottedSlider {
    paneltype: string;
    rememberchildfocus: boolean;
    value: number;
    min: number;
    max: number;
    increment: number;
    default: number;
    mousedown: boolean;
    SetDirection( str: 'horizontal' | 'vertical' ): void;
    SetShowDefaultValue( b: boolean ): void;
    SetRequiresSelection( b: boolean ): void;
    SetValueNoEvents( v: number ): void;
    SetPanelEvent( event: string, callback: Function ): void;
    RunScriptInPanelContext(): void;
}

declare interface Slider {
    paneltype: string;
    rememberchildfocus: boolean;
    value: number;
    min: number;
    max: number;
    increment: number;
    default: number;
    mousedown: boolean;
    SetDirection( str: 'horizontal' | 'vertical' ): void;
    SetShowDefaultValue( b: boolean ): void;
    SetRequiresSelection( b: boolean ): void;
    SetValueNoEvents( v: number ): void;
    SetPanelEvent( event: string, callback: Function ): void;
    RunScriptInPanelContext(): void;
}

declare interface NumberEntry extends Panel {
    value: number;
    min: number;
    max: number;
    increment: number;
}

declare interface Image extends Panel {
    SetImage( path: string ): void;
    SetScaling( v: string ): void;
}

declare interface Carousel extends Panel {
    SetSelectedChild( ...args: any[] ): void;
    GetFocusChild(): Panel;
    GetFocusIndex(): number;
}

declare interface Movie extends Panel {
    SetMovie( path: string ): void;
    SetControls( v: string ): void;
    SetTitle( v: string ): void;
    Play(): void;
    Pause(): void;
    Stop(): void;
    SetRepeat( bEnable: boolean ): void;
    SetPlaybackVolume( v: number ): void;
    BAdjustingVolume(): boolean;
}

declare interface DOTAAvatarImage extends Image {
    steamid: string;
    accountid: number;
    SetAccountID( id: number ): void;
}

declare interface DOTAAbilityImage extends Image {
    abilityid: number;
    abilityname: string;
    abilitylevel: number;
    contextEntityIndex: number;
}

declare interface DOTAItemImage extends Image {
    itemname: string;
    contextEntityIndex: number;
}

declare interface DOTAHeroImage extends Image {
    heroid: number;
    heroname: string;
    persona: any;
    /**
     * Default landscape
     */
    heroimagestyle: 'portrait' | 'landscape' | 'icon';
}

declare interface DOTAUserName extends Panel {
    steamid: string;
    accountid: string;
}

declare interface DOTAScenePanel extends Panel {
    FireEntityInput( entityName: string, event: string, param: string ): void;
    PlayEntitySoundEvent( entityName: string, sound: string ): void;
    SetUnit( sUnitName: string, sEnvironmentName: string, bShowPortraitBackground: boolean ): void;
    GetPanoramaSurfacePanel(): Panel;
    SetRotateParams( pitch: number, yaw: number, roll: number, unknow: number ): void;
}

declare interface DOTAAbilityPanel extends Panel {
    overrideentityindex: number;
    overridedisplaykeybind: number;
}

declare interface DOTAHTMLPanel extends Panel {
    SetURL( url: string ): void;
}

declare enum SteamUGCQuery {
    RankedByVote = 0,
    RankedByPublicationDate = 1,
    AcceptedForGameRankedByAcceptanceDate = 2,
    RankedByTrend = 3,
    FavoritedByFriendsRankedByPublicationDate = 4,
    CreatedByFriendsRankedByPublicationDate = 5,
    RankedByNumTimesReported = 6,
    CreatedByFollowedUsersRankedByPublicationDate = 7,
    NotYetRated = 8,
    RankedByTotalVotesAsc = 9,
    RankedByVotesUp = 10,
    RankedByTextSearch = 11,
    RankedByTotalUniqueSubscriptions = 12,
    RankedByPlaytimeTrend = 13,
    RankedByTotalPlaytime = 14,
    RankedByAveragePlaytimeTrend = 15,
    RankedByLifetimeAveragePlaytime = 16,
    RankedByPlaytimeSessionsTrend = 17,
    RankedByLifetimePlaytimeSessions = 18,
}

declare enum SteamUGCMatchingUGCType {
    Items = 0,
    Items_Mtx = 1,
    Items_ReadyToUse = 2,
    Collections = 3,
    Artwork = 4,
    Videos = 5,
    Screenshots = 6,
    AllGuides = 7,
    WebGuides = 8,
    IntegratedGuides = 9,
    UsableInGame = 10,
    ControllerBindings = 11,
    GameManagedItems = 12,
    All = -1,
}

declare enum SteamUniverse {
    Invalid = 0,
    Internal = 3,
    Dev = 4,
    Beta = 2,
    Public = 1,
}

declare enum DOTA_GameState {
    DOTA_GAMERULES_STATE_INIT = 0,
    DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD = 1,
    DOTA_GAMERULES_STATE_HERO_SELECTION = 3,
    DOTA_GAMERULES_STATE_STRATEGY_TIME = 4,
    DOTA_GAMERULES_STATE_PRE_GAME = 7,
    DOTA_GAMERULES_STATE_GAME_IN_PROGRESS = 8,
    DOTA_GAMERULES_STATE_POST_GAME = 9,
    DOTA_GAMERULES_STATE_DISCONNECT = 10,
    DOTA_GAMERULES_STATE_TEAM_SHOWCASE = 5,
    DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP = 2,
    DOTA_GAMERULES_STATE_WAIT_FOR_MAP_TO_LOAD = 6,
    DOTA_GAMERULES_STATE_LAST = 0,
}

declare enum DOTA_GC_TEAM {
    DOTA_GC_TEAM_GOOD_GUYS = 0,
    DOTA_GC_TEAM_BAD_GUYS = 1,
    DOTA_GC_TEAM_BROADCASTER = 2,
    DOTA_GC_TEAM_SPECTATOR = 3,
    DOTA_GC_TEAM_PLAYER_POOL = 4,
    DOTA_GC_TEAM_NOTEAM = 5,
}

declare enum DOTAConnectionState_t {
    DOTA_CONNECTION_STATE_UNKNOWN = 0,
    DOTA_CONNECTION_STATE_NOT_YET_CONNECTED = 1,
    DOTA_CONNECTION_STATE_CONNECTED = 2,
    DOTA_CONNECTION_STATE_DISCONNECTED = 3,
    DOTA_CONNECTION_STATE_ABANDONED = 4,
    DOTA_CONNECTION_STATE_LOADING = 5,
    DOTA_CONNECTION_STATE_FAILED = 6,
}

declare enum dotaunitorder_t {
    DOTA_UNIT_ORDER_NONE = 0,
    DOTA_UNIT_ORDER_MOVE_TO_POSITION = 1,
    DOTA_UNIT_ORDER_MOVE_TO_TARGET = 2,
    DOTA_UNIT_ORDER_ATTACK_MOVE = 3,
    DOTA_UNIT_ORDER_ATTACK_TARGET = 4,
    DOTA_UNIT_ORDER_CAST_POSITION = 5,
    DOTA_UNIT_ORDER_CAST_TARGET = 6,
    DOTA_UNIT_ORDER_CAST_TARGET_TREE = 7,
    DOTA_UNIT_ORDER_CAST_NO_TARGET = 8,
    DOTA_UNIT_ORDER_CAST_TOGGLE = 9,
    DOTA_UNIT_ORDER_HOLD_POSITION = 10,
    DOTA_UNIT_ORDER_TRAIN_ABILITY = 11,
    DOTA_UNIT_ORDER_DROP_ITEM = 12,
    DOTA_UNIT_ORDER_GIVE_ITEM = 13,
    DOTA_UNIT_ORDER_PICKUP_ITEM = 14,
    DOTA_UNIT_ORDER_PICKUP_RUNE = 15,
    DOTA_UNIT_ORDER_PURCHASE_ITEM = 16,
    DOTA_UNIT_ORDER_SELL_ITEM = 17,
    DOTA_UNIT_ORDER_DISASSEMBLE_ITEM = 18,
    DOTA_UNIT_ORDER_MOVE_ITEM = 19,
    DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO = 20,
    DOTA_UNIT_ORDER_STOP = 21,
    DOTA_UNIT_ORDER_TAUNT = 22,
    DOTA_UNIT_ORDER_BUYBACK = 23,
    DOTA_UNIT_ORDER_GLYPH = 24,
    DOTA_UNIT_ORDER_EJECT_ITEM_FROM_STASH = 25,
    DOTA_UNIT_ORDER_CAST_RUNE = 26,
    DOTA_UNIT_ORDER_PING_ABILITY = 27,
    DOTA_UNIT_ORDER_MOVE_TO_DIRECTION = 28,
    DOTA_UNIT_ORDER_PATROL = 29,
    DOTA_UNIT_ORDER_VECTOR_TARGET_POSITION = 30,
    DOTA_UNIT_ORDER_RADAR = 31,
    DOTA_UNIT_ORDER_SET_ITEM_COMBINE_LOCK = 32,
    DOTA_UNIT_ORDER_CONTINUE = 33,
    DOTA_UNIT_ORDER_VECTOR_TARGET_CANCELED = 34,
    DOTA_UNIT_ORDER_CAST_RIVER_PAINT = 35,
    DOTA_UNIT_ORDER_PREGAME_ADJUST_ITEM_ASSIGNMENT = 36,
    DOTA_UNIT_ORDER_DROP_ITEM_AT_FOUNTAIN = 37,
    DOTA_UNIT_ORDER_TAKE_ITEM_FROM_NEUTRAL_ITEM_STASH = 38,
}

declare enum DOTA_OVERHEAD_ALERT {
    OVERHEAD_ALERT_GOLD = 0,
    OVERHEAD_ALERT_DENY = 1,
    OVERHEAD_ALERT_CRITICAL = 2,
    OVERHEAD_ALERT_XP = 3,
    OVERHEAD_ALERT_BONUS_SPELL_DAMAGE = 4,
    OVERHEAD_ALERT_MISS = 5,
    OVERHEAD_ALERT_DAMAGE = 6,
    OVERHEAD_ALERT_EVADE = 7,
    OVERHEAD_ALERT_BLOCK = 8,
    OVERHEAD_ALERT_BONUS_POISON_DAMAGE = 9,
    OVERHEAD_ALERT_HEAL = 10,
    OVERHEAD_ALERT_MANA_ADD = 11,
    OVERHEAD_ALERT_MANA_LOSS = 12,
    OVERHEAD_ALERT_LAST_HIT_EARLY = 13,
    OVERHEAD_ALERT_LAST_HIT_CLOSE = 14,
    OVERHEAD_ALERT_LAST_HIT_MISS = 15,
    OVERHEAD_ALERT_MAGICAL_BLOCK = 16,
    OVERHEAD_ALERT_INCOMING_DAMAGE = 17,
    OVERHEAD_ALERT_OUTGOING_DAMAGE = 18,
    OVERHEAD_ALERT_DISABLE_RESIST = 19,
    OVERHEAD_ALERT_DEATH = 20,
    OVERHEAD_ALERT_BLOCKED = 21,
}

declare enum DOTA_HeroPickState {
    DOTA_HEROPICK_STATE_NONE = 0,
    DOTA_HEROPICK_STATE_AP_SELECT = 1,
    DOTA_HEROPICK_STATE_SD_SELECT = 2,
    DOTA_HEROPICK_STATE_INTRO_SELECT_UNUSED = 3,
    DOTA_HEROPICK_STATE_RD_SELECT_UNUSED = 4,
    DOTA_HEROPICK_STATE_CM_INTRO = 5,
    DOTA_HEROPICK_STATE_CM_CAPTAINPICK = 6,
    DOTA_HEROPICK_STATE_CM_BAN1 = 7,
    DOTA_HEROPICK_STATE_CM_BAN2 = 8,
    DOTA_HEROPICK_STATE_CM_BAN3 = 9,
    DOTA_HEROPICK_STATE_CM_BAN4 = 10,
    DOTA_HEROPICK_STATE_CM_BAN5 = 11,
    DOTA_HEROPICK_STATE_CM_BAN6 = 12,
    DOTA_HEROPICK_STATE_CM_BAN7 = 13,
    DOTA_HEROPICK_STATE_CM_BAN8 = 14,
    DOTA_HEROPICK_STATE_CM_BAN9 = 15,
    DOTA_HEROPICK_STATE_CM_BAN10 = 16,
    DOTA_HEROPICK_STATE_CM_BAN11 = 17,
    DOTA_HEROPICK_STATE_CM_BAN12 = 18,
    DOTA_HEROPICK_STATE_CM_BAN13 = 19,
    DOTA_HEROPICK_STATE_CM_BAN14 = 20,
    DOTA_HEROPICK_STATE_CM_SELECT1 = 21,
    DOTA_HEROPICK_STATE_CM_SELECT2 = 22,
    DOTA_HEROPICK_STATE_CM_SELECT3 = 23,
    DOTA_HEROPICK_STATE_CM_SELECT4 = 24,
    DOTA_HEROPICK_STATE_CM_SELECT5 = 25,
    DOTA_HEROPICK_STATE_CM_SELECT6 = 26,
    DOTA_HEROPICK_STATE_CM_SELECT7 = 27,
    DOTA_HEROPICK_STATE_CM_SELECT8 = 28,
    DOTA_HEROPICK_STATE_CM_SELECT9 = 29,
    DOTA_HEROPICK_STATE_CM_SELECT10 = 30,
    DOTA_HEROPICK_STATE_CM_PICK = 31,
    DOTA_HEROPICK_STATE_AR_SELECT = 32,
    DOTA_HEROPICK_STATE_MO_SELECT = 33,
    DOTA_HEROPICK_STATE_FH_SELECT = 34,
    DOTA_HEROPICK_STATE_CD_INTRO = 35,
    DOTA_HEROPICK_STATE_CD_CAPTAINPICK = 36,
    DOTA_HEROPICK_STATE_CD_BAN1 = 37,
    DOTA_HEROPICK_STATE_CD_BAN2 = 38,
    DOTA_HEROPICK_STATE_CD_BAN3 = 39,
    DOTA_HEROPICK_STATE_CD_BAN4 = 40,
    DOTA_HEROPICK_STATE_CD_BAN5 = 41,
    DOTA_HEROPICK_STATE_CD_BAN6 = 42,
    DOTA_HEROPICK_STATE_CD_SELECT1 = 43,
    DOTA_HEROPICK_STATE_CD_SELECT2 = 44,
    DOTA_HEROPICK_STATE_CD_SELECT3 = 45,
    DOTA_HEROPICK_STATE_CD_SELECT4 = 46,
    DOTA_HEROPICK_STATE_CD_SELECT5 = 47,
    DOTA_HEROPICK_STATE_CD_SELECT6 = 48,
    DOTA_HEROPICK_STATE_CD_SELECT7 = 49,
    DOTA_HEROPICK_STATE_CD_SELECT8 = 50,
    DOTA_HEROPICK_STATE_CD_SELECT9 = 51,
    DOTA_HEROPICK_STATE_CD_SELECT10 = 52,
    DOTA_HEROPICK_STATE_CD_PICK = 53,
    DOTA_HEROPICK_STATE_BD_SELECT = 54,
    DOTA_HERO_PICK_STATE_ABILITY_DRAFT_SELECT = 55,
    DOTA_HERO_PICK_STATE_ARDM_SELECT = 56,
    DOTA_HEROPICK_STATE_ALL_DRAFT_SELECT = 57,
    DOTA_HERO_PICK_STATE_CUSTOMGAME_SELECT = 58,
    DOTA_HEROPICK_STATE_SELECT_PENALTY = 59,
    DOTA_HEROPICK_STATE_CUSTOM_PICK_RULES = 60,
    DOTA_HEROPICK_STATE_COUNT = 61,
}

declare enum DOTATeam_t {
    DOTA_TEAM_FIRST = 2,
    DOTA_TEAM_GOODGUYS = 2,
    DOTA_TEAM_BADGUYS = 3,
    DOTA_TEAM_NEUTRALS = 4,
    DOTA_TEAM_NOTEAM = 5,
    DOTA_TEAM_CUSTOM_1 = 6,
    DOTA_TEAM_CUSTOM_2 = 7,
    DOTA_TEAM_CUSTOM_3 = 8,
    DOTA_TEAM_CUSTOM_4 = 9,
    DOTA_TEAM_CUSTOM_5 = 10,
    DOTA_TEAM_CUSTOM_6 = 11,
    DOTA_TEAM_CUSTOM_7 = 12,
    DOTA_TEAM_CUSTOM_8 = 13,
    DOTA_TEAM_COUNT = 14,
    DOTA_TEAM_CUSTOM_MIN = 6,
    DOTA_TEAM_CUSTOM_MAX = 13,
    DOTA_TEAM_CUSTOM_COUNT = 8,
}

declare enum DOTA_RUNES {
    DOTA_RUNE_INVALID = -1,
    DOTA_RUNE_DOUBLEDAMAGE = 0,
    DOTA_RUNE_HASTE = 1,
    DOTA_RUNE_ILLUSION = 2,
    DOTA_RUNE_INVISIBILITY = 3,
    DOTA_RUNE_REGENERATION = 4,
    DOTA_RUNE_BOUNTY = 5,
    DOTA_RUNE_ARCANE = 6,
    DOTA_RUNE_XP = 7,
    DOTA_RUNE_COUNT = 8,
}

declare enum DOTA_UNIT_TARGET_TEAM {
    DOTA_UNIT_TARGET_TEAM_NONE = 0,
    DOTA_UNIT_TARGET_TEAM_FRIENDLY = 1,
    DOTA_UNIT_TARGET_TEAM_ENEMY = 2,
    DOTA_UNIT_TARGET_TEAM_CUSTOM = 4,
    DOTA_UNIT_TARGET_TEAM_BOTH = 3,
}

declare enum DOTA_UNIT_TARGET_TYPE {
    DOTA_UNIT_TARGET_NONE = 0,
    DOTA_UNIT_TARGET_HERO = 1,
    DOTA_UNIT_TARGET_CREEP = 2,
    DOTA_UNIT_TARGET_BUILDING = 4,
    DOTA_UNIT_TARGET_COURIER = 16,
    DOTA_UNIT_TARGET_OTHER = 32,
    DOTA_UNIT_TARGET_TREE = 64,
    DOTA_UNIT_TARGET_CUSTOM = 128,
    DOTA_UNIT_TARGET_BASIC = 18,
    DOTA_UNIT_TARGET_ALL = 55,
}

declare enum DOTA_UNIT_TARGET_FLAGS {
    DOTA_UNIT_TARGET_FLAG_NONE = 0,
    DOTA_UNIT_TARGET_FLAG_RANGED_ONLY = 2,
    DOTA_UNIT_TARGET_FLAG_MELEE_ONLY = 4,
    DOTA_UNIT_TARGET_FLAG_DEAD = 8,
    DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES = 16,
    DOTA_UNIT_TARGET_FLAG_NOT_MAGIC_IMMUNE_ALLIES = 32,
    DOTA_UNIT_TARGET_FLAG_INVULNERABLE = 64,
    DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE = 128,
    DOTA_UNIT_TARGET_FLAG_NO_INVIS = 256,
    DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS = 512,
    DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED = 1024,
    DOTA_UNIT_TARGET_FLAG_NOT_DOMINATED = 2048,
    DOTA_UNIT_TARGET_FLAG_NOT_SUMMONED = 4096,
    DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS = 8192,
    DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE = 16384,
    DOTA_UNIT_TARGET_FLAG_MANA_ONLY = 32768,
    DOTA_UNIT_TARGET_FLAG_CHECK_DISABLE_HELP = 65536,
    DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO = 131072,
    DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD = 262144,
    DOTA_UNIT_TARGET_FLAG_NOT_NIGHTMARED = 524288,
    DOTA_UNIT_TARGET_FLAG_PREFER_ENEMIES = 1048576,
    DOTA_UNIT_TARGET_FLAG_RESPECT_OBSTRUCTIONS = 2097152,
}

declare enum DOTALimits_t {
    /**
     * Max number of players connected to the server including spectators.
     */
    DOTA_MAX_PLAYERS = 64,
    /**
     * Max number of players per team.
     */
    DOTA_MAX_TEAM = 24,
    /**
     * Max number of player teams supported.
     */
    DOTA_MAX_PLAYER_TEAMS = 10,
    /**
     * Max number of non-spectator players supported.
     */
    DOTA_MAX_TEAM_PLAYERS = 24,
    /**
     * How many spectators can watch.
     */
    DOTA_MAX_SPECTATOR_TEAM_SIZE = 40,
    /**
     * Max number of viewers in a spectator lobby.
     */
    DOTA_MAX_SPECTATOR_LOBBY_SIZE = 15,
    /**
     * Default number of players per team.
     */
    DOTA_DEFAULT_MAX_TEAM = 5,
    /**
     * Default number of non-spectator players supported.
     */
    DOTA_DEFAULT_MAX_TEAM_PLAYERS = 10,
}

declare enum DOTAInventoryFlags_t {
    DOTA_INVENTORY_ALLOW_NONE = 0,
    DOTA_INVENTORY_ALLOW_MAIN = 1,
    DOTA_INVENTORY_ALLOW_STASH = 2,
    DOTA_INVENTORY_ALLOW_DROP_ON_GROUND = 4,
    DOTA_INVENTORY_ALLOW_DROP_AT_FOUNTAIN = 8,
    DOTA_INVENTORY_LIMIT_DROP_ON_GROUND = 16,
    DOTA_INVENTORY_ALL_ACCESS = 3,
}

declare enum EDOTA_ModifyGold_Reason {
    DOTA_ModifyGold_Unspecified = 0,
    DOTA_ModifyGold_Death = 1,
    DOTA_ModifyGold_Buyback = 2,
    DOTA_ModifyGold_PurchaseConsumable = 3,
    DOTA_ModifyGold_PurchaseItem = 4,
    DOTA_ModifyGold_AbandonedRedistribute = 5,
    DOTA_ModifyGold_SellItem = 6,
    DOTA_ModifyGold_AbilityCost = 7,
    DOTA_ModifyGold_CheatCommand = 8,
    DOTA_ModifyGold_SelectionPenalty = 9,
    DOTA_ModifyGold_GameTick = 10,
    DOTA_ModifyGold_Building = 11,
    DOTA_ModifyGold_HeroKill = 12,
    DOTA_ModifyGold_CreepKill = 13,
    DOTA_ModifyGold_NeutralKill = 14,
    DOTA_ModifyGold_RoshanKill = 15,
    DOTA_ModifyGold_CourierKill = 16,
    DOTA_ModifyGold_BountyRune = 17,
    DOTA_ModifyGold_SharedGold = 18,
    DOTA_ModifyGold_AbilityGold = 19,
    DOTA_ModifyGold_WardKill = 20,
}

declare enum DOTAUnitAttackCapability_t {
    DOTA_UNIT_CAP_NO_ATTACK = 0,
    DOTA_UNIT_CAP_MELEE_ATTACK = 1,
    DOTA_UNIT_CAP_RANGED_ATTACK = 2,
    DOTA_UNIT_CAP_RANGED_ATTACK_DIRECTIONAL = 4,
    DOTA_UNIT_ATTACK_CAPABILITY_BIT_COUNT = 3,
}

declare enum DOTAUnitMoveCapability_t {
    DOTA_UNIT_CAP_MOVE_NONE = 0,
    DOTA_UNIT_CAP_MOVE_GROUND = 1,
    DOTA_UNIT_CAP_MOVE_FLY = 2,
}

declare enum EShareAbility {
    ITEM_FULLY_SHAREABLE = 0,
    ITEM_PARTIALLY_SHAREABLE = 1,
    ITEM_NOT_SHAREABLE = 2,
}

declare enum DOTAMusicStatus_t {
    DOTA_MUSIC_STATUS_NONE = 0,
    DOTA_MUSIC_STATUS_EXPLORATION = 1,
    DOTA_MUSIC_STATUS_BATTLE = 2,
    DOTA_MUSIC_STATUS_PRE_GAME_EXPLORATION = 3,
    DOTA_MUSIC_STATUS_DEAD = 4,
    DOTA_MUSIC_STATUS_LAST = 5,
}

declare enum DOTA_ABILITY_BEHAVIOR {
    DOTA_ABILITY_BEHAVIOR_NONE = 0,
    DOTA_ABILITY_BEHAVIOR_HIDDEN = 1,
    DOTA_ABILITY_BEHAVIOR_PASSIVE = 2,
    DOTA_ABILITY_BEHAVIOR_NO_TARGET = 4,
    DOTA_ABILITY_BEHAVIOR_UNIT_TARGET = 8,
    DOTA_ABILITY_BEHAVIOR_POINT = 16,
    DOTA_ABILITY_BEHAVIOR_AOE = 32,
    DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE = 64,
    DOTA_ABILITY_BEHAVIOR_CHANNELLED = 128,
    DOTA_ABILITY_BEHAVIOR_ITEM = 256,
    DOTA_ABILITY_BEHAVIOR_TOGGLE = 512,
    DOTA_ABILITY_BEHAVIOR_DIRECTIONAL = 1024,
    DOTA_ABILITY_BEHAVIOR_IMMEDIATE = 2048,
    DOTA_ABILITY_BEHAVIOR_AUTOCAST = 4096,
    DOTA_ABILITY_BEHAVIOR_OPTIONAL_UNIT_TARGET = 8192,
    DOTA_ABILITY_BEHAVIOR_OPTIONAL_POINT = 16384,
    DOTA_ABILITY_BEHAVIOR_OPTIONAL_NO_TARGET = 32768,
    DOTA_ABILITY_BEHAVIOR_AURA = 65536,
    DOTA_ABILITY_BEHAVIOR_ATTACK = 131072,
    DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT = 262144,
    DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES = 524288,
    DOTA_ABILITY_BEHAVIOR_UNRESTRICTED = 1048576,
    DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE = 2097152,
    DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL = 4194304,
    DOTA_ABILITY_BEHAVIOR_DONT_CANCEL_MOVEMENT = 8388608,
    DOTA_ABILITY_BEHAVIOR_DONT_ALERT_TARGET = 16777216,
    DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK = 33554432,
    DOTA_ABILITY_BEHAVIOR_NORMAL_WHEN_STOLEN = 67108864,
    DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING = 134217728,
    DOTA_ABILITY_BEHAVIOR_RUNE_TARGET = 268435456,
    DOTA_ABILITY_BEHAVIOR_DONT_CANCEL_CHANNEL = 536870912,
    DOTA_ABILITY_BEHAVIOR_VECTOR_TARGETING = 1073741824,
    DOTA_ABILITY_BEHAVIOR_LAST_RESORT_POINT = 2147483648,
    DOTA_ABILITY_BEHAVIOR_CAN_SELF_CAST = 4294967296,
    DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES = 8589934592,
    DOTA_ABILITY_BEHAVIOR_UNLOCKED_BY_EFFECT_INDEX = 17179869184,
    DOTA_ABILITY_BEHAVIOR_SUPPRESS_ASSOCIATED_CONSUMABLE = 34359738368,
    DOTA_ABILITY_BEHAVIOR_FREE_DRAW_TARGETING = 68719476736,
}

declare enum DAMAGE_TYPES {
    DAMAGE_TYPE_NONE = 0,
    DAMAGE_TYPE_PHYSICAL = 1,
    DAMAGE_TYPE_MAGICAL = 2,
    DAMAGE_TYPE_PURE = 4,
    DAMAGE_TYPE_HP_REMOVAL = 8,
    DAMAGE_TYPE_ALL = 7,
}

declare enum ABILITY_TYPES {
    ABILITY_TYPE_BASIC = 0,
    ABILITY_TYPE_ULTIMATE = 1,
    ABILITY_TYPE_ATTRIBUTES = 2,
    ABILITY_TYPE_HIDDEN = 3,
}

declare enum SPELL_IMMUNITY_TYPES {
    SPELL_IMMUNITY_NONE = 0,
    SPELL_IMMUNITY_ALLIES_YES = 1,
    SPELL_IMMUNITY_ALLIES_NO = 2,
    SPELL_IMMUNITY_ENEMIES_YES = 3,
    SPELL_IMMUNITY_ENEMIES_NO = 4,
    SPELL_IMMUNITY_ALLIES_YES_ENEMIES_NO = 5,
}

declare enum DOTADamageFlag_t {
    DOTA_DAMAGE_FLAG_NONE = 0,
    DOTA_DAMAGE_FLAG_IGNORES_MAGIC_ARMOR = 1,
    DOTA_DAMAGE_FLAG_IGNORES_PHYSICAL_ARMOR = 2,
    DOTA_DAMAGE_FLAG_BYPASSES_INVULNERABILITY = 4,
    DOTA_DAMAGE_FLAG_BYPASSES_BLOCK = 8,
    DOTA_DAMAGE_FLAG_REFLECTION = 16,
    DOTA_DAMAGE_FLAG_HPLOSS = 32,
    DOTA_DAMAGE_FLAG_NO_DIRECTOR_EVENT = 64,
    DOTA_DAMAGE_FLAG_NON_LETHAL = 128,
    DOTA_DAMAGE_FLAG_USE_COMBAT_PROFICIENCY = 256,
    DOTA_DAMAGE_FLAG_NO_DAMAGE_MULTIPLIERS = 512,
    DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION = 1024,
    DOTA_DAMAGE_FLAG_DONT_DISPLAY_DAMAGE_IF_SOURCE_HIDDEN = 2048,
    DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL = 4096,
    DOTA_DAMAGE_FLAG_PROPERTY_FIRE = 8192,
    DOTA_DAMAGE_FLAG_IGNORES_BASE_PHYSICAL_ARMOR = 16384,
}

declare enum EDOTA_ModifyXP_Reason {
    DOTA_ModifyXP_Unspecified = 0,
    DOTA_ModifyXP_HeroKill = 1,
    DOTA_ModifyXP_CreepKill = 2,
    DOTA_ModifyXP_RoshanKill = 3,
    DOTA_ModifyXP_TomeOfKnowledge = 4,
    DOTA_ModifyXP_Outpost = 5,
    DOTA_ModifyXP_MAX = 6,
}

declare enum GameActivity_t {
    ACT_DOTA_IDLE = 1500,
    ACT_DOTA_IDLE_RARE = 1501,
    ACT_DOTA_RUN = 1502,
    ACT_DOTA_ATTACK = 1503,
    ACT_DOTA_ATTACK2 = 1504,
    ACT_DOTA_ATTACK_EVENT = 1505,
    ACT_DOTA_DIE = 1506,
    ACT_DOTA_FLINCH = 1507,
    ACT_DOTA_FLAIL = 1508,
    ACT_DOTA_DISABLED = 1509,
    ACT_DOTA_CAST_ABILITY_1 = 1510,
    ACT_DOTA_CAST_ABILITY_2 = 1511,
    ACT_DOTA_CAST_ABILITY_3 = 1512,
    ACT_DOTA_CAST_ABILITY_4 = 1513,
    ACT_DOTA_CAST_ABILITY_5 = 1514,
    ACT_DOTA_CAST_ABILITY_6 = 1515,
    ACT_DOTA_OVERRIDE_ABILITY_1 = 1516,
    ACT_DOTA_OVERRIDE_ABILITY_2 = 1517,
    ACT_DOTA_OVERRIDE_ABILITY_3 = 1518,
    ACT_DOTA_OVERRIDE_ABILITY_4 = 1519,
    ACT_DOTA_CHANNEL_ABILITY_1 = 1520,
    ACT_DOTA_CHANNEL_ABILITY_2 = 1521,
    ACT_DOTA_CHANNEL_ABILITY_3 = 1522,
    ACT_DOTA_CHANNEL_ABILITY_4 = 1523,
    ACT_DOTA_CHANNEL_ABILITY_5 = 1524,
    ACT_DOTA_CHANNEL_ABILITY_6 = 1525,
    ACT_DOTA_CHANNEL_END_ABILITY_1 = 1526,
    ACT_DOTA_CHANNEL_END_ABILITY_2 = 1527,
    ACT_DOTA_CHANNEL_END_ABILITY_3 = 1528,
    ACT_DOTA_CHANNEL_END_ABILITY_4 = 1529,
    ACT_DOTA_CHANNEL_END_ABILITY_5 = 1530,
    ACT_DOTA_CHANNEL_END_ABILITY_6 = 1531,
    ACT_DOTA_CONSTANT_LAYER = 1532,
    ACT_DOTA_CAPTURE = 1533,
    ACT_DOTA_SPAWN = 1534,
    ACT_DOTA_KILLTAUNT = 1535,
    ACT_DOTA_TAUNT = 1536,
    ACT_DOTA_THIRST = 1537,
    ACT_DOTA_CAST_DRAGONBREATH = 1538,
    ACT_DOTA_ECHO_SLAM = 1539,
    ACT_DOTA_CAST_ABILITY_1_END = 1540,
    ACT_DOTA_CAST_ABILITY_2_END = 1541,
    ACT_DOTA_CAST_ABILITY_3_END = 1542,
    ACT_DOTA_CAST_ABILITY_4_END = 1543,
    ACT_MIRANA_LEAP_END = 1544,
    ACT_WAVEFORM_START = 1545,
    ACT_WAVEFORM_END = 1546,
    ACT_DOTA_CAST_ABILITY_ROT = 1547,
    ACT_DOTA_DIE_SPECIAL = 1548,
    ACT_DOTA_RATTLETRAP_BATTERYASSAULT = 1549,
    ACT_DOTA_RATTLETRAP_POWERCOGS = 1550,
    ACT_DOTA_RATTLETRAP_HOOKSHOT_START = 1551,
    ACT_DOTA_RATTLETRAP_HOOKSHOT_LOOP = 1552,
    ACT_DOTA_RATTLETRAP_HOOKSHOT_END = 1553,
    ACT_STORM_SPIRIT_OVERLOAD_RUN_OVERRIDE = 1554,
    ACT_DOTA_TINKER_REARM1 = 1555,
    ACT_DOTA_TINKER_REARM2 = 1556,
    ACT_DOTA_TINKER_REARM3 = 1557,
    ACT_TINY_AVALANCHE = 1558,
    ACT_TINY_TOSS = 1559,
    ACT_TINY_GROWL = 1560,
    ACT_DOTA_WEAVERBUG_ATTACH = 1561,
    ACT_DOTA_CAST_WILD_AXES_END = 1562,
    ACT_DOTA_CAST_LIFE_BREAK_START = 1563,
    ACT_DOTA_CAST_LIFE_BREAK_END = 1564,
    ACT_DOTA_NIGHTSTALKER_TRANSITION = 1565,
    ACT_DOTA_LIFESTEALER_RAGE = 1566,
    ACT_DOTA_LIFESTEALER_OPEN_WOUNDS = 1567,
    ACT_DOTA_SAND_KING_BURROW_IN = 1568,
    ACT_DOTA_SAND_KING_BURROW_OUT = 1569,
    ACT_DOTA_EARTHSHAKER_TOTEM_ATTACK = 1570,
    ACT_DOTA_WHEEL_LAYER = 1571,
    ACT_DOTA_ALCHEMIST_CHEMICAL_RAGE_START = 1572,
    ACT_DOTA_ALCHEMIST_CONCOCTION = 1573,
    ACT_DOTA_JAKIRO_LIQUIDFIRE_START = 1574,
    ACT_DOTA_JAKIRO_LIQUIDFIRE_LOOP = 1575,
    ACT_DOTA_LIFESTEALER_INFEST = 1576,
    ACT_DOTA_LIFESTEALER_INFEST_END = 1577,
    ACT_DOTA_LASSO_LOOP = 1578,
    ACT_DOTA_ALCHEMIST_CONCOCTION_THROW = 1579,
    ACT_DOTA_ALCHEMIST_CHEMICAL_RAGE_END = 1580,
    ACT_DOTA_CAST_COLD_SNAP = 1581,
    ACT_DOTA_CAST_GHOST_WALK = 1582,
    ACT_DOTA_CAST_TORNADO = 1583,
    ACT_DOTA_CAST_EMP = 1584,
    ACT_DOTA_CAST_ALACRITY = 1585,
    ACT_DOTA_CAST_CHAOS_METEOR = 1586,
    ACT_DOTA_CAST_SUN_STRIKE = 1587,
    ACT_DOTA_CAST_FORGE_SPIRIT = 1588,
    ACT_DOTA_CAST_ICE_WALL = 1589,
    ACT_DOTA_CAST_DEAFENING_BLAST = 1590,
    ACT_DOTA_VICTORY = 1591,
    ACT_DOTA_DEFEAT = 1592,
    ACT_DOTA_SPIRIT_BREAKER_CHARGE_POSE = 1593,
    ACT_DOTA_SPIRIT_BREAKER_CHARGE_END = 1594,
    ACT_DOTA_TELEPORT = 1595,
    ACT_DOTA_TELEPORT_END = 1596,
    ACT_DOTA_CAST_REFRACTION = 1597,
    ACT_DOTA_CAST_ABILITY_7 = 1598,
    ACT_DOTA_CANCEL_SIREN_SONG = 1599,
    ACT_DOTA_CHANNEL_ABILITY_7 = 1600,
    ACT_DOTA_LOADOUT = 1601,
    ACT_DOTA_FORCESTAFF_END = 1602,
    ACT_DOTA_POOF_END = 1603,
    ACT_DOTA_SLARK_POUNCE = 1604,
    ACT_DOTA_MAGNUS_SKEWER_START = 1605,
    ACT_DOTA_MAGNUS_SKEWER_END = 1606,
    ACT_DOTA_MEDUSA_STONE_GAZE = 1607,
    ACT_DOTA_RELAX_START = 1608,
    ACT_DOTA_RELAX_LOOP = 1609,
    ACT_DOTA_RELAX_END = 1610,
    ACT_DOTA_CENTAUR_STAMPEDE = 1611,
    ACT_DOTA_BELLYACHE_START = 1612,
    ACT_DOTA_BELLYACHE_LOOP = 1613,
    ACT_DOTA_BELLYACHE_END = 1614,
    ACT_DOTA_ROQUELAIRE_LAND = 1615,
    ACT_DOTA_ROQUELAIRE_LAND_IDLE = 1616,
    ACT_DOTA_GREEVIL_CAST = 1617,
    ACT_DOTA_GREEVIL_OVERRIDE_ABILITY = 1618,
    ACT_DOTA_GREEVIL_HOOK_START = 1619,
    ACT_DOTA_GREEVIL_HOOK_END = 1620,
    ACT_DOTA_GREEVIL_BLINK_BONE = 1621,
    ACT_DOTA_IDLE_SLEEPING = 1622,
    ACT_DOTA_INTRO = 1623,
    ACT_DOTA_GESTURE_POINT = 1624,
    ACT_DOTA_GESTURE_ACCENT = 1625,
    ACT_DOTA_SLEEPING_END = 1626,
    ACT_DOTA_AMBUSH = 1627,
    ACT_DOTA_ITEM_LOOK = 1628,
    ACT_DOTA_STARTLE = 1629,
    ACT_DOTA_FRUSTRATION = 1630,
    ACT_DOTA_TELEPORT_REACT = 1631,
    ACT_DOTA_TELEPORT_END_REACT = 1632,
    ACT_DOTA_SHRUG = 1633,
    ACT_DOTA_RELAX_LOOP_END = 1634,
    ACT_DOTA_PRESENT_ITEM = 1635,
    ACT_DOTA_IDLE_IMPATIENT = 1636,
    ACT_DOTA_SHARPEN_WEAPON = 1637,
    ACT_DOTA_SHARPEN_WEAPON_OUT = 1638,
    ACT_DOTA_IDLE_SLEEPING_END = 1639,
    ACT_DOTA_BRIDGE_DESTROY = 1640,
    ACT_DOTA_TAUNT_SNIPER = 1641,
    ACT_DOTA_DEATH_BY_SNIPER = 1642,
    ACT_DOTA_LOOK_AROUND = 1643,
    ACT_DOTA_CAGED_CREEP_RAGE = 1644,
    ACT_DOTA_CAGED_CREEP_RAGE_OUT = 1645,
    ACT_DOTA_CAGED_CREEP_SMASH = 1646,
    ACT_DOTA_CAGED_CREEP_SMASH_OUT = 1647,
    ACT_DOTA_IDLE_IMPATIENT_SWORD_TAP = 1648,
    ACT_DOTA_INTRO_LOOP = 1649,
    ACT_DOTA_BRIDGE_THREAT = 1650,
    ACT_DOTA_DAGON = 1651,
    ACT_DOTA_CAST_ABILITY_2_ES_ROLL_START = 1652,
    ACT_DOTA_CAST_ABILITY_2_ES_ROLL = 1653,
    ACT_DOTA_CAST_ABILITY_2_ES_ROLL_END = 1654,
    ACT_DOTA_NIAN_PIN_START = 1655,
    ACT_DOTA_NIAN_PIN_LOOP = 1656,
    ACT_DOTA_NIAN_PIN_END = 1657,
    ACT_DOTA_LEAP_STUN = 1658,
    ACT_DOTA_LEAP_SWIPE = 1659,
    ACT_DOTA_NIAN_INTRO_LEAP = 1660,
    ACT_DOTA_AREA_DENY = 1661,
    ACT_DOTA_NIAN_PIN_TO_STUN = 1662,
    ACT_DOTA_RAZE_1 = 1663,
    ACT_DOTA_RAZE_2 = 1664,
    ACT_DOTA_RAZE_3 = 1665,
    ACT_DOTA_UNDYING_DECAY = 1666,
    ACT_DOTA_UNDYING_SOUL_RIP = 1667,
    ACT_DOTA_UNDYING_TOMBSTONE = 1668,
    ACT_DOTA_WHIRLING_AXES_RANGED = 1669,
    ACT_DOTA_SHALLOW_GRAVE = 1670,
    ACT_DOTA_COLD_FEET = 1671,
    ACT_DOTA_ICE_VORTEX = 1672,
    ACT_DOTA_CHILLING_TOUCH = 1673,
    ACT_DOTA_ENFEEBLE = 1674,
    ACT_DOTA_FATAL_BONDS = 1675,
    ACT_DOTA_MIDNIGHT_PULSE = 1676,
    ACT_DOTA_ANCESTRAL_SPIRIT = 1677,
    ACT_DOTA_THUNDER_STRIKE = 1678,
    ACT_DOTA_KINETIC_FIELD = 1679,
    ACT_DOTA_STATIC_STORM = 1680,
    ACT_DOTA_MINI_TAUNT = 1681,
    ACT_DOTA_ARCTIC_BURN_END = 1682,
    ACT_DOTA_LOADOUT_RARE = 1683,
    ACT_DOTA_SWIM = 1684,
    ACT_DOTA_FLEE = 1685,
    ACT_DOTA_TROT = 1686,
    ACT_DOTA_SHAKE = 1687,
    ACT_DOTA_SWIM_IDLE = 1688,
    ACT_DOTA_WAIT_IDLE = 1689,
    ACT_DOTA_GREET = 1690,
    ACT_DOTA_TELEPORT_COOP_START = 1691,
    ACT_DOTA_TELEPORT_COOP_WAIT = 1692,
    ACT_DOTA_TELEPORT_COOP_END = 1693,
    ACT_DOTA_TELEPORT_COOP_EXIT = 1694,
    ACT_DOTA_SHOPKEEPER_PET_INTERACT = 1695,
    ACT_DOTA_ITEM_PICKUP = 1696,
    ACT_DOTA_ITEM_DROP = 1697,
    ACT_DOTA_CAPTURE_PET = 1698,
    ACT_DOTA_PET_WARD_OBSERVER = 1699,
    ACT_DOTA_PET_WARD_SENTRY = 1700,
    ACT_DOTA_PET_LEVEL = 1701,
    ACT_DOTA_CAST_BURROW_END = 1702,
    ACT_DOTA_LIFESTEALER_ASSIMILATE = 1703,
    ACT_DOTA_LIFESTEALER_EJECT = 1704,
    ACT_DOTA_ATTACK_EVENT_BASH = 1705,
    ACT_DOTA_CAPTURE_RARE = 1706,
    ACT_DOTA_AW_MAGNETIC_FIELD = 1707,
    ACT_DOTA_CAST_GHOST_SHIP = 1708,
    ACT_DOTA_FXANIM = 1709,
    ACT_DOTA_VICTORY_START = 1710,
    ACT_DOTA_DEFEAT_START = 1711,
    ACT_DOTA_DP_SPIRIT_SIPHON = 1712,
    ACT_DOTA_TRICKS_END = 1713,
    ACT_DOTA_ES_STONE_CALLER = 1714,
    ACT_DOTA_MK_STRIKE = 1715,
    ACT_DOTA_VERSUS = 1716,
    ACT_DOTA_CAPTURE_CARD = 1717,
    ACT_DOTA_MK_SPRING_SOAR = 1718,
    ACT_DOTA_MK_SPRING_END = 1719,
    ACT_DOTA_MK_TREE_SOAR = 1720,
    ACT_DOTA_MK_TREE_END = 1721,
    ACT_DOTA_MK_FUR_ARMY = 1722,
    ACT_DOTA_MK_SPRING_CAST = 1723,
    ACT_DOTA_NECRO_GHOST_SHROUD = 1724,
    ACT_DOTA_OVERRIDE_ARCANA = 1725,
    ACT_DOTA_SLIDE = 1726,
    ACT_DOTA_SLIDE_LOOP = 1727,
    ACT_DOTA_GENERIC_CHANNEL_1 = 1728,
    ACT_DOTA_GS_SOUL_CHAIN = 1729,
    ACT_DOTA_GS_INK_CREATURE = 1730,
    ACT_DOTA_TRANSITION = 1731,
    ACT_DOTA_BLINK_DAGGER = 1732,
    ACT_DOTA_BLINK_DAGGER_END = 1733,
    ACT_DOTA_CUSTOM_TOWER_ATTACK = 1734,
    ACT_DOTA_CUSTOM_TOWER_IDLE = 1735,
    ACT_DOTA_CUSTOM_TOWER_DIE = 1736,
    ACT_DOTA_CAST_COLD_SNAP_ORB = 1737,
    ACT_DOTA_CAST_GHOST_WALK_ORB = 1738,
    ACT_DOTA_CAST_TORNADO_ORB = 1739,
    ACT_DOTA_CAST_EMP_ORB = 1740,
    ACT_DOTA_CAST_ALACRITY_ORB = 1741,
    ACT_DOTA_CAST_CHAOS_METEOR_ORB = 1742,
    ACT_DOTA_CAST_SUN_STRIKE_ORB = 1743,
    ACT_DOTA_CAST_FORGE_SPIRIT_ORB = 1744,
    ACT_DOTA_CAST_ICE_WALL_ORB = 1745,
    ACT_DOTA_CAST_DEAFENING_BLAST_ORB = 1746,
    ACT_DOTA_NOTICE = 1747,
    ACT_DOTA_CAST_ABILITY_2_ALLY = 1748,
    ACT_DOTA_SHUFFLE_L = 1749,
    ACT_DOTA_SHUFFLE_R = 1750,
    ACT_DOTA_OVERRIDE_LOADOUT = 1751,
    ACT_DOTA_TAUNT_SPECIAL = 1752,
}

declare enum DOTAMinimapEvent_t {
    DOTA_MINIMAP_EVENT_ANCIENT_UNDER_ATTACK = 2,
    DOTA_MINIMAP_EVENT_BASE_UNDER_ATTACK = 4,
    DOTA_MINIMAP_EVENT_BASE_GLYPHED = 8,
    DOTA_MINIMAP_EVENT_TEAMMATE_UNDER_ATTACK = 16,
    DOTA_MINIMAP_EVENT_TEAMMATE_TELEPORTING = 32,
    DOTA_MINIMAP_EVENT_TEAMMATE_DIED = 64,
    DOTA_MINIMAP_EVENT_TUTORIAL_TASK_ACTIVE = 128,
    DOTA_MINIMAP_EVENT_TUTORIAL_TASK_FINISHED = 256,
    DOTA_MINIMAP_EVENT_HINT_LOCATION = 512,
    DOTA_MINIMAP_EVENT_ENEMY_TELEPORTING = 1024,
    DOTA_MINIMAP_EVENT_CANCEL_TELEPORTING = 2048,
    DOTA_MINIMAP_EVENT_RADAR = 4096,
    DOTA_MINIMAP_EVENT_RADAR_TARGET = 8192,
    DOTA_MINIMAP_EVENT_MOVE_TO_TARGET = 16384,
}

declare enum DOTASlotType_t {
    DOTA_LOADOUT_TYPE_INVALID = -1,
    DOTA_LOADOUT_TYPE_WEAPON = 0,
    DOTA_LOADOUT_TYPE_OFFHAND_WEAPON = 1,
    DOTA_LOADOUT_TYPE_WEAPON2 = 2,
    DOTA_LOADOUT_TYPE_OFFHAND_WEAPON2 = 3,
    DOTA_LOADOUT_TYPE_HEAD = 4,
    DOTA_LOADOUT_TYPE_SHOULDER = 5,
    DOTA_LOADOUT_TYPE_ARMS = 6,
    DOTA_LOADOUT_TYPE_ARMOR = 7,
    DOTA_LOADOUT_TYPE_BELT = 8,
    DOTA_LOADOUT_TYPE_NECK = 9,
    DOTA_LOADOUT_TYPE_BACK = 10,
    DOTA_LOADOUT_TYPE_LEGS = 11,
    DOTA_LOADOUT_TYPE_GLOVES = 12,
    DOTA_LOADOUT_TYPE_TAIL = 13,
    DOTA_LOADOUT_TYPE_MISC = 14,
    DOTA_LOADOUT_TYPE_BODY_HEAD = 15,
    DOTA_LOADOUT_TYPE_MOUNT = 16,
    DOTA_LOADOUT_TYPE_SUMMON = 17,
    DOTA_LOADOUT_TYPE_SHAPESHIFT = 18,
    DOTA_LOADOUT_TYPE_TAUNT = 19,
    DOTA_LOADOUT_TYPE_AMBIENT_EFFECTS = 20,
    DOTA_LOADOUT_TYPE_ABILITY_ATTACK = 21,
    DOTA_LOADOUT_TYPE_ABILITY1 = 22,
    DOTA_LOADOUT_TYPE_ABILITY2 = 23,
    DOTA_LOADOUT_TYPE_ABILITY3 = 24,
    DOTA_LOADOUT_TYPE_ABILITY4 = 25,
    DOTA_LOADOUT_TYPE_ABILITY_ULTIMATE = 26,
    DOTA_LOADOUT_TYPE_VOICE = 27,
    DOTA_LOADOUT_TYPE_WEAPON_PERSONA_1 = 28,
    DOTA_LOADOUT_TYPE_OFFHAND_WEAPON_PERSONA_1 = 29,
    DOTA_LOADOUT_TYPE_WEAPON2_PERSONA_1 = 30,
    DOTA_LOADOUT_TYPE_OFFHAND_WEAPON2_PERSONA_1 = 31,
    DOTA_LOADOUT_TYPE_HEAD_PERSONA_1 = 32,
    DOTA_LOADOUT_TYPE_SHOULDER_PERSONA_1 = 33,
    DOTA_LOADOUT_TYPE_ARMS_PERSONA_1 = 34,
    DOTA_LOADOUT_TYPE_ARMOR_PERSONA_1 = 35,
    DOTA_LOADOUT_TYPE_BELT_PERSONA_1 = 36,
    DOTA_LOADOUT_TYPE_NECK_PERSONA_1 = 37,
    DOTA_LOADOUT_TYPE_BACK_PERSONA_1 = 38,
    DOTA_LOADOUT_TYPE_LEGS_PERSONA_1 = 39,
    DOTA_LOADOUT_TYPE_GLOVES_PERSONA_1 = 40,
    DOTA_LOADOUT_TYPE_TAIL_PERSONA_1 = 41,
    DOTA_LOADOUT_TYPE_MISC_PERSONA_1 = 42,
    DOTA_LOADOUT_TYPE_BODY_HEAD_PERSONA_1 = 43,
    DOTA_LOADOUT_TYPE_MOUNT_PERSONA_1 = 44,
    DOTA_LOADOUT_TYPE_SUMMON_PERSONA_1 = 45,
    DOTA_LOADOUT_TYPE_SHAPESHIFT_PERSONA_1 = 46,
    DOTA_LOADOUT_TYPE_TAUNT_PERSONA_1 = 47,
    DOTA_LOADOUT_TYPE_AMBIENT_EFFECTS_PERSONA_1 = 48,
    DOTA_LOADOUT_TYPE_ABILITY_ATTACK_PERSONA_1 = 49,
    DOTA_LOADOUT_TYPE_ABILITY1_PERSONA_1 = 50,
    DOTA_LOADOUT_TYPE_ABILITY2_PERSONA_1 = 51,
    DOTA_LOADOUT_TYPE_ABILITY3_PERSONA_1 = 52,
    DOTA_LOADOUT_TYPE_ABILITY4_PERSONA_1 = 53,
    DOTA_LOADOUT_TYPE_ABILITY_ULTIMATE_PERSONA_1 = 54,
    DOTA_LOADOUT_TYPE_VOICE_PERSONA_1 = 55,
    DOTA_LOADOUT_PERSONA_1_START = 28,
    DOTA_LOADOUT_PERSONA_1_END = 55,
    DOTA_LOADOUT_TYPE_PERSONA_SELECTOR = 56,
    DOTA_LOADOUT_TYPE_COURIER = 57,
    DOTA_LOADOUT_TYPE_ANNOUNCER = 58,
    DOTA_LOADOUT_TYPE_MEGA_KILLS = 59,
    DOTA_LOADOUT_TYPE_MUSIC = 60,
    DOTA_LOADOUT_TYPE_WARD = 61,
    DOTA_LOADOUT_TYPE_HUD_SKIN = 62,
    DOTA_LOADOUT_TYPE_LOADING_SCREEN = 63,
    DOTA_LOADOUT_TYPE_WEATHER = 64,
    DOTA_LOADOUT_TYPE_HEROIC_STATUE = 65,
    DOTA_LOADOUT_TYPE_MULTIKILL_BANNER = 66,
    DOTA_LOADOUT_TYPE_CURSOR_PACK = 67,
    DOTA_LOADOUT_TYPE_TELEPORT_EFFECT = 68,
    DOTA_LOADOUT_TYPE_BLINK_EFFECT = 69,
    DOTA_LOADOUT_TYPE_EMBLEM = 70,
    DOTA_LOADOUT_TYPE_TERRAIN = 71,
    DOTA_LOADOUT_TYPE_RADIANT_CREEPS = 72,
    DOTA_LOADOUT_TYPE_DIRE_CREEPS = 73,
    DOTA_LOADOUT_TYPE_RADIANT_TOWER = 74,
    DOTA_LOADOUT_TYPE_DIRE_TOWER = 75,
    DOTA_LOADOUT_TYPE_VERSUS_SCREEN = 76,
    DOTA_LOADOUT_TYPE_STREAK_EFFECT = 77,
    DOTA_PLAYER_LOADOUT_START = 57,
    DOTA_PLAYER_LOADOUT_END = 77,
    DOTA_LOADOUT_TYPE_NONE = 78,
    DOTA_LOADOUT_TYPE_COUNT = 79,
}

declare enum modifierstate {
    MODIFIER_STATE_ROOTED = 0,
    MODIFIER_STATE_DISARMED = 1,
    MODIFIER_STATE_ATTACK_IMMUNE = 2,
    MODIFIER_STATE_SILENCED = 3,
    MODIFIER_STATE_MUTED = 4,
    MODIFIER_STATE_STUNNED = 5,
    MODIFIER_STATE_HEXED = 6,
    MODIFIER_STATE_INVISIBLE = 7,
    MODIFIER_STATE_INVULNERABLE = 8,
    MODIFIER_STATE_MAGIC_IMMUNE = 9,
    MODIFIER_STATE_PROVIDES_VISION = 10,
    MODIFIER_STATE_NIGHTMARED = 11,
    MODIFIER_STATE_BLOCK_DISABLED = 12,
    MODIFIER_STATE_EVADE_DISABLED = 13,
    MODIFIER_STATE_UNSELECTABLE = 14,
    MODIFIER_STATE_CANNOT_TARGET_ENEMIES = 15,
    MODIFIER_STATE_CANNOT_MISS = 16,
    MODIFIER_STATE_SPECIALLY_DENIABLE = 17,
    MODIFIER_STATE_FROZEN = 18,
    MODIFIER_STATE_COMMAND_RESTRICTED = 19,
    MODIFIER_STATE_NOT_ON_MINIMAP = 20,
    MODIFIER_STATE_LOW_ATTACK_PRIORITY = 21,
    MODIFIER_STATE_NO_HEALTH_BAR = 22,
    MODIFIER_STATE_FLYING = 23,
    MODIFIER_STATE_NO_UNIT_COLLISION = 24,
    MODIFIER_STATE_NO_TEAM_MOVE_TO = 25,
    MODIFIER_STATE_NO_TEAM_SELECT = 26,
    MODIFIER_STATE_PASSIVES_DISABLED = 27,
    MODIFIER_STATE_DOMINATED = 28,
    MODIFIER_STATE_BLIND = 29,
    MODIFIER_STATE_OUT_OF_GAME = 30,
    MODIFIER_STATE_FAKE_ALLY = 31,
    MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY = 32,
    MODIFIER_STATE_TRUESIGHT_IMMUNE = 33,
    MODIFIER_STATE_UNTARGETABLE = 34,
    MODIFIER_STATE_IGNORING_MOVE_AND_ATTACK_ORDERS = 35,
    MODIFIER_STATE_ALLOW_PATHING_TROUGH_TREES = 36,
    MODIFIER_STATE_NOT_ON_MINIMAP_FOR_ENEMIES = 37,
    MODIFIER_STATE_UNSLOWABLE = 38,
    MODIFIER_STATE_TETHERED = 39,
    MODIFIER_STATE_IGNORING_STOP_ORDERS = 40,
    MODIFIER_STATE_FEARED = 41,
    MODIFIER_STATE_TAUNTED = 42,
    MODIFIER_STATE_CANNOT_BE_MOTION_CONTROLLED = 43,
    MODIFIER_STATE_LAST = 44,
}

declare enum DOTAModifierAttribute_t {
    MODIFIER_ATTRIBUTE_NONE = 0,
    MODIFIER_ATTRIBUTE_PERMANENT = 1,
    MODIFIER_ATTRIBUTE_MULTIPLE = 2,
    MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE = 4,
    MODIFIER_ATTRIBUTE_AURA_PRIORITY = 8,
}

declare enum Attributes {
    DOTA_ATTRIBUTE_STRENGTH = 0,
    DOTA_ATTRIBUTE_AGILITY = 1,
    DOTA_ATTRIBUTE_INTELLECT = 2,
    DOTA_ATTRIBUTE_MAX = 3,
    DOTA_ATTRIBUTE_INVALID = -1,
}

declare enum ParticleAttachment_t {
    PATTACH_INVALID = -1,
    PATTACH_ABSORIGIN = 0,
    PATTACH_ABSORIGIN_FOLLOW = 1,
    PATTACH_CUSTOMORIGIN = 2,
    PATTACH_CUSTOMORIGIN_FOLLOW = 3,
    PATTACH_POINT = 4,
    PATTACH_POINT_FOLLOW = 5,
    PATTACH_EYES_FOLLOW = 6,
    PATTACH_OVERHEAD_FOLLOW = 7,
    PATTACH_WORLDORIGIN = 8,
    PATTACH_ROOTBONE_FOLLOW = 9,
    PATTACH_RENDERORIGIN_FOLLOW = 10,
    PATTACH_MAIN_VIEW = 11,
    PATTACH_WATERWAKE = 12,
    PATTACH_CENTER_FOLLOW = 13,
    PATTACH_CUSTOM_GAME_STATE_1 = 14,
    PATTACH_HEALTHBAR = 15,
    MAX_PATTACH_TYPES = 16,
}

declare enum DOTA_MOTION_CONTROLLER_PRIORITY {
    DOTA_MOTION_CONTROLLER_PRIORITY_LOWEST = 0,
    DOTA_MOTION_CONTROLLER_PRIORITY_LOW = 1,
    DOTA_MOTION_CONTROLLER_PRIORITY_MEDIUM = 2,
    DOTA_MOTION_CONTROLLER_PRIORITY_HIGH = 3,
    DOTA_MOTION_CONTROLLER_PRIORITY_HIGHEST = 4,
}

declare enum DOTASpeechType_t {
    DOTA_SPEECH_USER_INVALID = 0,
    DOTA_SPEECH_USER_SINGLE = 1,
    DOTA_SPEECH_USER_TEAM = 2,
    DOTA_SPEECH_USER_TEAM_NEARBY = 3,
    DOTA_SPEECH_USER_NEARBY = 4,
    DOTA_SPEECH_USER_ALL = 5,
    DOTA_SPEECH_GOOD_TEAM = 6,
    DOTA_SPEECH_BAD_TEAM = 7,
    DOTA_SPEECH_SPECTATOR = 8,
    DOTA_SPEECH_RECIPIENT_TYPE_MAX = 9,
}

declare enum DOTAAbilitySpeakTrigger_t {
    DOTA_ABILITY_SPEAK_START_ACTION_PHASE = 0,
    DOTA_ABILITY_SPEAK_CAST = 1,
}

declare enum DotaCustomUIType_t {
    DOTA_CUSTOM_UI_TYPE_HUD = 0,
    DOTA_CUSTOM_UI_TYPE_HERO_SELECTION = 1,
    DOTA_CUSTOM_UI_TYPE_GAME_INFO = 2,
    DOTA_CUSTOM_UI_TYPE_GAME_SETUP = 3,
    DOTA_CUSTOM_UI_TYPE_FLYOUT_SCOREBOARD = 4,
    DOTA_CUSTOM_UI_TYPE_HUD_TOP_BAR = 5,
    DOTA_CUSTOM_UI_TYPE_END_SCREEN = 6,
    DOTA_CUSTOM_UI_TYPE_COUNT = 7,
    DOTA_CUSTOM_UI_TYPE_INVALID = -1,
}

declare enum DotaDefaultUIElement_t {
    DOTA_DEFAULT_UI_INVALID = -1,
    DOTA_DEFAULT_UI_TOP_TIMEOFDAY = 0,
    DOTA_DEFAULT_UI_TOP_HEROES = 1,
    DOTA_DEFAULT_UI_FLYOUT_SCOREBOARD = 2,
    DOTA_DEFAULT_UI_ACTION_PANEL = 3,
    DOTA_DEFAULT_UI_ACTION_MINIMAP = 4,
    DOTA_DEFAULT_UI_INVENTORY_PANEL = 5,
    DOTA_DEFAULT_UI_INVENTORY_SHOP = 6,
    DOTA_DEFAULT_UI_INVENTORY_ITEMS = 7,
    DOTA_DEFAULT_UI_INVENTORY_QUICKBUY = 8,
    DOTA_DEFAULT_UI_INVENTORY_COURIER = 9,
    DOTA_DEFAULT_UI_INVENTORY_PROTECT = 10,
    DOTA_DEFAULT_UI_INVENTORY_GOLD = 11,
    DOTA_DEFAULT_UI_SHOP_SUGGESTEDITEMS = 12,
    DOTA_DEFAULT_UI_SHOP_COMMONITEMS = 13,
    DOTA_DEFAULT_UI_HERO_SELECTION_TEAMS = 14,
    DOTA_DEFAULT_UI_HERO_SELECTION_GAME_NAME = 15,
    DOTA_DEFAULT_UI_HERO_SELECTION_CLOCK = 16,
    DOTA_DEFAULT_UI_TOP_MENU_BUTTONS = 17,
    DOTA_DEFAULT_UI_TOP_BAR_BACKGROUND = 18,
    DOTA_DEFAULT_UI_TOP_BAR_RADIANT_TEAM = 19,
    DOTA_DEFAULT_UI_TOP_BAR_DIRE_TEAM = 20,
    DOTA_DEFAULT_UI_TOP_BAR_SCORE = 21,
    DOTA_DEFAULT_UI_ENDGAME = 22,
    DOTA_DEFAULT_UI_ENDGAME_CHAT = 23,
    DOTA_DEFAULT_UI_QUICK_STATS = 24,
    DOTA_DEFAULT_UI_PREGAME_STRATEGYUI = 25,
    DOTA_DEFAULT_UI_KILLCAM = 26,
    DOTA_DEFAULT_UI_TOP_BAR = 27,
    DOTA_DEFAULT_UI_CUSTOMUI_BEHIND_HUD_ELEMENTS = 28,
    DOTA_DEFAULT_UI_ELEMENT_COUNT = 29,
}

declare enum PlayerUltimateStateOrTime_t {
    PLAYER_ULTIMATE_STATE_READY = 0,
    PLAYER_ULTIMATE_STATE_NO_MANA = -1,
    PLAYER_ULTIMATE_STATE_NOT_LEVELED = -2,
    PLAYER_ULTIMATE_STATE_HIDDEN = -3,
}

declare enum PlayerOrderIssuer_t {
    DOTA_ORDER_ISSUER_SELECTED_UNITS = 0,
    DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY = 1,
    DOTA_ORDER_ISSUER_HERO_ONLY = 2,
    DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY = 3,
}

declare enum OrderQueueBehavior_t {
    DOTA_ORDER_QUEUE_DEFAULT = 0,
    DOTA_ORDER_QUEUE_NEVER = 1,
    DOTA_ORDER_QUEUE_ALWAYS = 2,
}

declare enum CLICK_BEHAVIORS {
    DOTA_CLICK_BEHAVIOR_NONE = 0,
    DOTA_CLICK_BEHAVIOR_MOVE = 1,
    DOTA_CLICK_BEHAVIOR_ATTACK = 2,
    DOTA_CLICK_BEHAVIOR_CAST = 3,
    DOTA_CLICK_BEHAVIOR_DROP_ITEM = 4,
    DOTA_CLICK_BEHAVIOR_DROP_SHOP_ITEM = 5,
    DOTA_CLICK_BEHAVIOR_DRAG = 6,
    DOTA_CLICK_BEHAVIOR_LEARN_ABILITY = 7,
    DOTA_CLICK_BEHAVIOR_PATROL = 8,
    DOTA_CLICK_BEHAVIOR_VECTOR_CAST = 9,
    DOTA_CLICK_BEHAVIOR_UNUSED = 10,
    DOTA_CLICK_BEHAVIOR_RADAR = 11,
    DOTA_CLICK_BEHAVIOR_LAST = 12,
}

declare enum AbilityLearnResult_t {
    ABILITY_CAN_BE_UPGRADED = 0,
    ABILITY_CANNOT_BE_UPGRADED_NOT_UPGRADABLE = 1,
    ABILITY_CANNOT_BE_UPGRADED_AT_MAX = 2,
    ABILITY_CANNOT_BE_UPGRADED_REQUIRES_LEVEL = 3,
    ABILITY_NOT_LEARNABLE = 4,
}

declare enum DOTAKeybindCommand_t {
    DOTA_KEYBIND_NONE = 0,
    DOTA_KEYBIND_FIRST = 1,
    DOTA_KEYBIND_CAMERA_UP = 1,
    DOTA_KEYBIND_CAMERA_DOWN = 2,
    DOTA_KEYBIND_CAMERA_LEFT = 3,
    DOTA_KEYBIND_CAMERA_RIGHT = 4,
    DOTA_KEYBIND_CAMERA_GRIP = 5,
    DOTA_KEYBIND_CAMERA_YAW_GRIP = 6,
    DOTA_KEYBIND_CAMERA_SAVED_POSITION_1 = 7,
    DOTA_KEYBIND_CAMERA_SAVED_POSITION_2 = 8,
    DOTA_KEYBIND_CAMERA_SAVED_POSITION_3 = 9,
    DOTA_KEYBIND_CAMERA_SAVED_POSITION_4 = 10,
    DOTA_KEYBIND_CAMERA_SAVED_POSITION_5 = 11,
    DOTA_KEYBIND_CAMERA_SAVED_POSITION_6 = 12,
    DOTA_KEYBIND_CAMERA_SAVED_POSITION_7 = 13,
    DOTA_KEYBIND_CAMERA_SAVED_POSITION_8 = 14,
    DOTA_KEYBIND_CAMERA_SAVED_POSITION_9 = 15,
    DOTA_KEYBIND_CAMERA_SAVED_POSITION_10 = 16,
    DOTA_KEYBIND_HERO_ATTACK = 17,
    DOTA_KEYBIND_HERO_MOVE = 18,
    DOTA_KEYBIND_HERO_MOVE_DIRECTION = 19,
    DOTA_KEYBIND_PATROL = 20,
    DOTA_KEYBIND_HERO_STOP = 21,
    DOTA_KEYBIND_HERO_HOLD = 22,
    DOTA_KEYBIND_HERO_SELECT = 23,
    DOTA_KEYBIND_COURIER_SELECT = 24,
    DOTA_KEYBIND_COURIER_DELIVER = 25,
    DOTA_KEYBIND_COURIER_BURST = 26,
    DOTA_KEYBIND_COURIER_SHIELD = 27,
    DOTA_KEYBIND_PAUSE = 28,
    DOTA_SELECT_ALL = 29,
    DOTA_SELECT_ALL_OTHERS = 30,
    DOTA_RECENT_EVENT = 31,
    DOTA_KEYBIND_CHAT_TEAM = 32,
    DOTA_KEYBIND_CHAT_GLOBAL = 33,
    DOTA_KEYBIND_CHAT_TEAM2 = 34,
    DOTA_KEYBIND_CHAT_GLOBAL2 = 35,
    DOTA_KEYBIND_CHAT_VOICE_PARTY = 36,
    DOTA_KEYBIND_CHAT_VOICE_TEAM = 37,
    DOTA_KEYBIND_CHAT_WHEEL = 38,
    DOTA_KEYBIND_CHAT_WHEEL2 = 39,
    DOTA_KEYBIND_CHAT_WHEEL_CARE = 40,
    DOTA_KEYBIND_CHAT_WHEEL_BACK = 41,
    DOTA_KEYBIND_CHAT_WHEEL_NEED_WARDS = 42,
    DOTA_KEYBIND_CHAT_WHEEL_STUN = 43,
    DOTA_KEYBIND_CHAT_WHEEL_HELP = 44,
    DOTA_KEYBIND_CHAT_WHEEL_GET_PUSH = 45,
    DOTA_KEYBIND_CHAT_WHEEL_GOOD_JOB = 46,
    DOTA_KEYBIND_CHAT_WHEEL_MISSING = 47,
    DOTA_KEYBIND_CHAT_WHEEL_MISSING_TOP = 48,
    DOTA_KEYBIND_CHAT_WHEEL_MISSING_MIDDLE = 49,
    DOTA_KEYBIND_CHAT_WHEEL_MISSING_BOTTOM = 50,
    DOTA_KEYBIND_HERO_CHAT_WHEEL = 51,
    DOTA_KEYBIND_SPRAY_WHEEL = 52,
    DOTA_KEYBIND_ABILITY_PRIMARY1 = 53,
    DOTA_KEYBIND_ABILITY_PRIMARY2 = 54,
    DOTA_KEYBIND_ABILITY_PRIMARY3 = 55,
    DOTA_KEYBIND_ABILITY_SECONDARY1 = 56,
    DOTA_KEYBIND_ABILITY_SECONDARY2 = 57,
    DOTA_KEYBIND_ABILITY_ULTIMATE = 58,
    DOTA_KEYBIND_ABILITY_PRIMARY1_QUICKCAST = 59,
    DOTA_KEYBIND_ABILITY_PRIMARY2_QUICKCAST = 60,
    DOTA_KEYBIND_ABILITY_PRIMARY3_QUICKCAST = 61,
    DOTA_KEYBIND_ABILITY_SECONDARY1_QUICKCAST = 62,
    DOTA_KEYBIND_ABILITY_SECONDARY2_QUICKCAST = 63,
    DOTA_KEYBIND_ABILITY_ULTIMATE_QUICKCAST = 64,
    DOTA_KEYBIND_ABILITY_PRIMARY1_EXPLICIT_AUTOCAST = 65,
    DOTA_KEYBIND_ABILITY_PRIMARY2_EXPLICIT_AUTOCAST = 66,
    DOTA_KEYBIND_ABILITY_PRIMARY3_EXPLICIT_AUTOCAST = 67,
    DOTA_KEYBIND_ABILITY_SECONDARY1_EXPLICIT_AUTOCAST = 68,
    DOTA_KEYBIND_ABILITY_SECONDARY2_EXPLICIT_AUTOCAST = 69,
    DOTA_KEYBIND_ABILITY_ULTIMATE_EXPLICIT_AUTOCAST = 70,
    DOTA_KEYBIND_ABILITY_PRIMARY1_QUICKCAST_AUTOCAST = 71,
    DOTA_KEYBIND_ABILITY_PRIMARY2_QUICKCAST_AUTOCAST = 72,
    DOTA_KEYBIND_ABILITY_PRIMARY3_QUICKCAST_AUTOCAST = 73,
    DOTA_KEYBIND_ABILITY_SECONDARY1_QUICKCAST_AUTOCAST = 74,
    DOTA_KEYBIND_ABILITY_SECONDARY2_QUICKCAST_AUTOCAST = 75,
    DOTA_KEYBIND_ABILITY_ULTIMATE_QUICKCAST_AUTOCAST = 76,
    DOTA_KEYBIND_ABILITY_PRIMARY1_AUTOMATIC_AUTOCAST = 77,
    DOTA_KEYBIND_ABILITY_PRIMARY2_AUTOMATIC_AUTOCAST = 78,
    DOTA_KEYBIND_ABILITY_PRIMARY3_AUTOMATIC_AUTOCAST = 79,
    DOTA_KEYBIND_ABILITY_SECONDARY1_AUTOMATIC_AUTOCAST = 80,
    DOTA_KEYBIND_ABILITY_SECONDARY2_AUTOMATIC_AUTOCAST = 81,
    DOTA_KEYBIND_ABILITY_ULTIMATE_AUTOMATIC_AUTOCAST = 82,
    DOTA_KEYBIND_INVENTORY1 = 83,
    DOTA_KEYBIND_INVENTORY2 = 84,
    DOTA_KEYBIND_INVENTORY3 = 85,
    DOTA_KEYBIND_INVENTORY4 = 86,
    DOTA_KEYBIND_INVENTORY5 = 87,
    DOTA_KEYBIND_INVENTORY6 = 88,
    DOTA_KEYBIND_INVENTORYTP = 89,
    DOTA_KEYBIND_INVENTORYNEUTRAL = 90,
    DOTA_KEYBIND_INVENTORY1_QUICKCAST = 91,
    DOTA_KEYBIND_INVENTORY2_QUICKCAST = 92,
    DOTA_KEYBIND_INVENTORY3_QUICKCAST = 93,
    DOTA_KEYBIND_INVENTORY4_QUICKCAST = 94,
    DOTA_KEYBIND_INVENTORY5_QUICKCAST = 95,
    DOTA_KEYBIND_INVENTORY6_QUICKCAST = 96,
    DOTA_KEYBIND_INVENTORYTP_QUICKCAST = 97,
    DOTA_KEYBIND_INVENTORYNEUTRAL_QUICKCAST = 98,
    DOTA_KEYBIND_INVENTORY1_AUTOCAST = 99,
    DOTA_KEYBIND_INVENTORY2_AUTOCAST = 100,
    DOTA_KEYBIND_INVENTORY3_AUTOCAST = 101,
    DOTA_KEYBIND_INVENTORY4_AUTOCAST = 102,
    DOTA_KEYBIND_INVENTORY5_AUTOCAST = 103,
    DOTA_KEYBIND_INVENTORY6_AUTOCAST = 104,
    DOTA_KEYBIND_INVENTORYTP_AUTOCAST = 105,
    DOTA_KEYBIND_INVENTORYNEUTRAL_AUTOCAST = 106,
    DOTA_KEYBIND_INVENTORY1_QUICKAUTOCAST = 107,
    DOTA_KEYBIND_INVENTORY2_QUICKAUTOCAST = 108,
    DOTA_KEYBIND_INVENTORY3_QUICKAUTOCAST = 109,
    DOTA_KEYBIND_INVENTORY4_QUICKAUTOCAST = 110,
    DOTA_KEYBIND_INVENTORY5_QUICKAUTOCAST = 111,
    DOTA_KEYBIND_INVENTORY6_QUICKAUTOCAST = 112,
    DOTA_KEYBIND_INVENTORYTP_QUICKAUTOCAST = 113,
    DOTA_KEYBIND_INVENTORYNEUTRAL_QUICKAUTOCAST = 114,
    DOTA_KEYBIND_CONTROL_GROUP1 = 115,
    DOTA_KEYBIND_CONTROL_GROUP2 = 116,
    DOTA_KEYBIND_CONTROL_GROUP3 = 117,
    DOTA_KEYBIND_CONTROL_GROUP4 = 118,
    DOTA_KEYBIND_CONTROL_GROUP5 = 119,
    DOTA_KEYBIND_CONTROL_GROUP6 = 120,
    DOTA_KEYBIND_CONTROL_GROUP7 = 121,
    DOTA_KEYBIND_CONTROL_GROUP8 = 122,
    DOTA_KEYBIND_CONTROL_GROUP9 = 123,
    DOTA_KEYBIND_CONTROL_GROUP10 = 124,
    DOTA_KEYBIND_CONTROL_GROUPCYCLE = 125,
    DOTA_KEYBIND_SELECT_ALLY1 = 126,
    DOTA_KEYBIND_SELECT_ALLY2 = 127,
    DOTA_KEYBIND_SELECT_ALLY3 = 128,
    DOTA_KEYBIND_SELECT_ALLY4 = 129,
    DOTA_KEYBIND_SELECT_ALLY5 = 130,
    DOTA_KEYBIND_SHOP_TOGGLE = 131,
    DOTA_KEYBIND_SCOREBOARD_TOGGLE = 132,
    DOTA_KEYBIND_SCREENSHOT = 133,
    DOTA_KEYBIND_ESCAPE = 134,
    DOTA_KEYBIND_CONSOLE = 135,
    DOTA_KEYBIND_DEATH_SUMMARY = 136,
    DOTA_KEYBIND_LEARN_ABILITIES = 137,
    DOTA_KEYBIND_LEARN_STATS = 138,
    DOTA_KEYBIND_ACTIVATE_GLYPH = 139,
    DOTA_KEYBIND_ACTIVATE_RADAR = 140,
    DOTA_KEYBIND_PURCHASE_QUICKBUY = 141,
    DOTA_KEYBIND_PURCHASE_STICKY = 142,
    DOTA_KEYBIND_GRAB_STASH_ITEMS = 143,
    DOTA_KEYBIND_TOGGLE_AUTOATTACK = 144,
    DOTA_KEYBIND_TAUNT = 145,
    DOTA_KEYBIND_SHOP_CONSUMABLES = 146,
    DOTA_KEYBIND_SHOP_ATTRIBUTES = 147,
    DOTA_KEYBIND_SHOP_ARMAMENTS = 148,
    DOTA_KEYBIND_SHOP_ARCANE = 149,
    DOTA_KEYBIND_SHOP_BASICS = 150,
    DOTA_KEYBIND_SHOP_SUPPORT = 151,
    DOTA_KEYBIND_SHOP_CASTER = 152,
    DOTA_KEYBIND_SHOP_WEAPONS = 153,
    DOTA_KEYBIND_SHOP_ARMOR = 154,
    DOTA_KEYBIND_SHOP_ARTIFACTS = 155,
    DOTA_KEYBIND_SHOP_SIDE_PAGE_1 = 156,
    DOTA_KEYBIND_SHOP_SIDE_PAGE_2 = 157,
    DOTA_KEYBIND_SHOP_SECRET = 158,
    DOTA_KEYBIND_SHOP_SEARCHBOX = 159,
    DOTA_KEYBIND_SHOP_SLOT_1 = 160,
    DOTA_KEYBIND_SHOP_SLOT_2 = 161,
    DOTA_KEYBIND_SHOP_SLOT_3 = 162,
    DOTA_KEYBIND_SHOP_SLOT_4 = 163,
    DOTA_KEYBIND_SHOP_SLOT_5 = 164,
    DOTA_KEYBIND_SHOP_SLOT_6 = 165,
    DOTA_KEYBIND_SHOP_SLOT_7 = 166,
    DOTA_KEYBIND_SHOP_SLOT_8 = 167,
    DOTA_KEYBIND_SHOP_SLOT_9 = 168,
    DOTA_KEYBIND_SHOP_SLOT_10 = 169,
    DOTA_KEYBIND_SHOP_SLOT_11 = 170,
    DOTA_KEYBIND_SHOP_SLOT_12 = 171,
    DOTA_KEYBIND_SHOP_SLOT_13 = 172,
    DOTA_KEYBIND_SHOP_SLOT_14 = 173,
    DOTA_KEYBIND_SPEC_CAMERA_UP = 174,
    DOTA_KEYBIND_SPEC_CAMERA_DOWN = 175,
    DOTA_KEYBIND_SPEC_CAMERA_LEFT = 176,
    DOTA_KEYBIND_SPEC_CAMERA_RIGHT = 177,
    DOTA_KEYBIND_SPEC_CAMERA_GRIP = 178,
    DOTA_KEYBIND_SPEC_CAMERA_SAVED_POSITION_1 = 179,
    DOTA_KEYBIND_SPEC_CAMERA_SAVED_POSITION_2 = 180,
    DOTA_KEYBIND_SPEC_CAMERA_SAVED_POSITION_3 = 181,
    DOTA_KEYBIND_SPEC_CAMERA_SAVED_POSITION_4 = 182,
    DOTA_KEYBIND_SPEC_CAMERA_SAVED_POSITION_5 = 183,
    DOTA_KEYBIND_SPEC_CAMERA_SAVED_POSITION_6 = 184,
    DOTA_KEYBIND_SPEC_CAMERA_SAVED_POSITION_7 = 185,
    DOTA_KEYBIND_SPEC_CAMERA_SAVED_POSITION_8 = 186,
    DOTA_KEYBIND_SPEC_CAMERA_SAVED_POSITION_9 = 187,
    DOTA_KEYBIND_SPEC_CAMERA_SAVED_POSITION_10 = 188,
    DOTA_KEYBIND_SPEC_UNIT_SELECT = 189,
    DOTA_KEYBIND_SPEC_HERO_SELECT = 190,
    DOTA_KEYBIND_SPEC_PAUSE = 191,
    DOTA_KEYBIND_SPEC_CHAT = 192,
    DOTA_KEYBIND_SPEC_SCOREBOARD = 193,
    DOTA_KEYBIND_SPEC_INCREASE_REPLAY_SPEED = 194,
    DOTA_KEYBIND_SPEC_DECREASE_REPLAY_SPEED = 195,
    DOTA_KEYBIND_SPEC_STATS_HARVEST = 196,
    DOTA_KEYBIND_SPEC_STATS_ITEM = 197,
    DOTA_KEYBIND_SPEC_STATS_GOLD = 198,
    DOTA_KEYBIND_SPEC_STATS_XP = 199,
    DOTA_KEYBIND_SPEC_STATS_FANTASY = 200,
    DOTA_KEYBIND_SPEC_STATS_WINCHANCE = 201,
    DOTA_KEYBIND_SPEC_FOW_TOGGLEBOTH = 202,
    DOTA_KEYBIND_SPEC_FOW_TOGGLERADIENT = 203,
    DOTA_KEYBIND_SPEC_FOW_TOGGLEDIRE = 204,
    DOTA_KEYBIND_SPEC_OPEN_BROADCASTER_MENU = 205,
    DOTA_KEYBIND_SPEC_DROPDOWN_KDA = 206,
    DOTA_KEYBIND_SPEC_DROPDOWN_LASTHITS_DENIES = 207,
    DOTA_KEYBIND_SPEC_DROPDOWN_LEVEL = 208,
    DOTA_KEYBIND_SPEC_DROPDOWN_XP_PER_MIN = 209,
    DOTA_KEYBIND_SPEC_DROPDOWN_GOLD = 210,
    DOTA_KEYBIND_SPEC_DROPDOWN_TOTALGOLD = 211,
    DOTA_KEYBIND_SPEC_DROPDOWN_GOLD_PER_MIN = 212,
    DOTA_KEYBIND_SPEC_DROPDOWN_BUYBACK = 213,
    DOTA_KEYBIND_SPEC_DROPDOWN_NETWORTH = 214,
    DOTA_KEYBIND_SPEC_DROPDOWN_FANTASY = 215,
    DOTA_KEYBIND_SPEC_DROPDOWN_SORT = 216,
    DOTA_KEYBIND_SPEC_DROPDOWN_CLOSE = 217,
    DOTA_KEYBIND_SPEC_FOCUS_PLAYER_1 = 218,
    DOTA_KEYBIND_SPEC_FOCUS_PLAYER_2 = 219,
    DOTA_KEYBIND_SPEC_FOCUS_PLAYER_3 = 220,
    DOTA_KEYBIND_SPEC_FOCUS_PLAYER_4 = 221,
    DOTA_KEYBIND_SPEC_FOCUS_PLAYER_5 = 222,
    DOTA_KEYBIND_SPEC_FOCUS_PLAYER_6 = 223,
    DOTA_KEYBIND_SPEC_FOCUS_PLAYER_7 = 224,
    DOTA_KEYBIND_SPEC_FOCUS_PLAYER_8 = 225,
    DOTA_KEYBIND_SPEC_FOCUS_PLAYER_9 = 226,
    DOTA_KEYBIND_SPEC_FOCUS_PLAYER_10 = 227,
    DOTA_KEYBIND_SPEC_COACH_VIEWTOGGLE = 228,
    DOTA_KEYBIND_INSPECTHEROINWORLD = 229,
    DOTA_KEYBIND_CAMERA_ZOOM_IN = 230,
    DOTA_KEYBIND_CAMERA_ZOOM_OUT = 231,
    DOTA_KEYBIND_CONTROL_GROUPCYCLEPREV = 232,
    DOTA_KEYBIND_DOTA_ALT = 233,
    DOTA_KEYBIND_COUNT = 234,
}

declare enum DOTA_SHOP_TYPE {
    DOTA_SHOP_HOME = 0,
    DOTA_SHOP_SIDE = 1,
    DOTA_SHOP_SECRET = 2,
    DOTA_SHOP_GROUND = 3,
    DOTA_SHOP_SIDE2 = 4,
    DOTA_SHOP_SECRET2 = 5,
    DOTA_SHOP_CUSTOM = 6,
    DOTA_SHOP_NEUTRALS = 7,
    DOTA_SHOP_NONE = 8,
}

