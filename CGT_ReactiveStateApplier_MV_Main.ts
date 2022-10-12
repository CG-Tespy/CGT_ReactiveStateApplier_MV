
/*:

@plugindesc Version 0.02.03. Allows you to have states applied in response to certain events, like critical hitting, exploiting weaknesses, etc.

@author CG-Tespy - https://github.com/CG-Tespy

@help Tested with RMMV versions 1.5.1 and 1.6.2. Requires the CGT Core Engine plugin 
(Version 1.01.15+). See the User Guide for info on using this plugin.

Please make sure to credit me (and any of this plugin's other contributing coders)
if you're using this plugin in your game. Include the names and (if available)
webpage links.

@param Triggers

@param OnCrit
@parent Triggers
@type struct<StateTriggerContext>[]
@default []

@param OnWeaknessHit
@parent Triggers
@type struct<StateTriggerContext>[]
@default []

*/

/*~struct~StateTriggerContext:

@param Name
@default SomeName

@param State
@type state
@default 

@param AttemptChance
@type number
@default 100

@param StateChangeType
@type select
@option Add
@option Remove
@default Add

@param StateChangedFor

@param ApplyToAttacker
@text Attacker
@parent StateChangedFor
@type boolean
@default false

@param ApplyToTarget
@text Target
@parent StateChangedFor
@type boolean
@default false

@param Notes
@type note
@default ""

*/

import { MoStTr } from './ReactiveStateApplier/_CGT_ReactiveStateApplier_MV_Setup';

// @ts-ignore
CGT.MoStTr = MoStTr;