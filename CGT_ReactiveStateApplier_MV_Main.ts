
/*:

@plugindesc Version 0.01.01. Allows you to have states applied upon certain triggers, like critical hitting, exploiting weaknesses, etc.

@author CG-Tespy - https://github.com/CG-Tespy

@help Tested with RMMV versions 1.5.1 and 1.6.2. Requires the CGT Core Engine plugin (Version 1.01.08+).
See the User Guide for info on using this plugin.

Please make sure to credit me (and any of this plugin's other contributing coders)
if you're using this plugin in your game. Include the names and (if available)
webpage links.

*/

/*
May want to set up the battle events in the Core Engine; they're general enough to not tie
to the ReStAp namespace.

For this plugin, I'll need params that let you decide the states to apply, as well as 
the success rates of those applications.

Perhaps a custom type with the fields:
- State
- Success rate (min 0, default 100)

Each trigger would have an array of these...

Or perhaps it might be better to go with the notetag route. The users apply 
notetags to each state, deciding which triggers they're applied with, 
and the success rates in response to those triggers.

In that case, I could require a notetag to let the system know it's supposed
to work with it. Or instead check for one that declares a trigger response and success rate.

Perhaps it could be...
CGT_ReStAp <insertBattleEventNameHere> <insertSuccessRateNumberHere>

For convenience, I can use regexes that allow any amount of whitespace before the
success rate.
*/

import { ReStAp } from './ReactiveStateApplier/_CGT_ReactiveStateApplier_MV_Setup';

// @ts-ignore
CGT.ReStAp = ReStAp;