
import "./PluginCommandSetup/_PluginCommand_Setup";
import "./StateApplierSetup/_StateApplierSetup";
import { StateApplier } from './Structures/_Structures_Setup';

export let ReStAp =
{
    version: 10101, // 1.01.01
    
    // Will be filled by the time the title screen loads
    stateAppliers: [],
    

    // Structures
    StateApplier: StateApplier,
    
};

