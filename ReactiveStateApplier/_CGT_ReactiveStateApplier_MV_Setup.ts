
import "./PluginCommandSetup/_PluginCommand_Setup";
import "./PluginParamSetup/_PluginParamSetup";
import "./StateChangeApplierSetup/_StateChangeApplierSetup"

import { StateChangeApplier } from "./Structures/StateChangeApplier";
import { StateChange } from "./Structures/StateChange";
import { StateChangeTarget } from "./Structures/StateChangeTarget";
import { StateTriggerContext } from "./Structures/StateTriggerContext";

export let MoStTr =
{
    version: 10101, // 1.01.01
    
    // Will be set up by the time the title screen loads
    Appliers: null,
    Params: null,
    
    // Structures
    StateChangeApplier: StateChangeApplier,
    StateChange: StateChange,
    StateChangeTarget: StateChangeTarget,
    StateTriggerContext: StateTriggerContext,
    
};

