import { StateApplier, StateApplierFactory } from '../Structures/StateApplier';
// Check the notetags on the states, registering which are to be applied in response
// to which battle events.

// The states may not have all been loaded in by the time this plugin has, so we need to
// put a delay on the setup... The title screen boot should be good.
let Callbacks = CGT.Core.Utils.Callbacks;
let RightTimeToSetUp = Callbacks.TitleScreenStart;
RightTimeToSetUp.AddListener(ApplySetup, this);

function ApplySetup()
{
    let stateAppliers: StateApplier[] = GetStateAppliers();

    // @ts-ignore
    CGT.MoStTr.stateAppliers = stateAppliers;
}

function GetStateAppliers(): StateApplier[]
{
    let allStates: RPG.State[] = $dataStates.slice();
    allStates.shift(); 
    // ^The original first element is null. Best not have to do any null checks
    // as we iterate over the states.
    let triggers: StateApplier[] = [];

    for (const state of allStates)
    {
        let triggersForState = StateApplierFactory.CreateMultiFrom(state);
        if (triggersForState.length > 0)
            triggers = triggers.concat(triggersForState);
    }

    return triggers;
}