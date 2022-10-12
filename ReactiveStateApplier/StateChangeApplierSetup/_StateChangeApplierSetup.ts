
// Check the notetags on the states, registering which are to be applied in response
// to which battle events.

import { StateChangeApplier } from "../Structures/StateChangeApplier";

// The states may not have all been loaded in by the time this plugin has, so we need to
// put a delay on the setup... The title screen boot should be good.
let Callbacks = CGT.Core.Utils.Callbacks;
let RightTimeToSetUp = Callbacks.TitleScreenStart;
RightTimeToSetUp.AddListener(ApplySetup, this);

function ApplySetup()
{
    // In case the player returns to the title screen to load a different save
    // or something
    let alreadyDone = CGT.MoStTr.Appliers != null;
    if (alreadyDone)
        return;

    let appliers = GetStateAppliers();

    CGT.MoStTr.Appliers = appliers;
}

type StateTriggerContext = CGT.MoStTr.StateTriggerContext;

function GetStateAppliers()
{
    let onCritContexts: StateTriggerContext[] = CGT.MoStTr.Params.OnCrit;
    let appliersForCrits = GetAppliersFor(onCritContexts, Callbacks.CriticalHit);

    let weaknessHitContexts = CGT.MoStTr.Params.OnWeaknessHit;
    let appliersForWeaknessHits = GetAppliersFor(weaknessHitContexts, Callbacks.WeaknessExploited);

    let appliers = 
    {
        Crit: appliersForCrits,
        WeaknessHit: appliersForWeaknessHits,
    };

    return appliers;
}

type Event = CGT.Core.Utils.Event;

function GetAppliersFor(contexts: StateTriggerContext[], battleEvent: Event)
{
    let appliers = [];

    for (const contextEl of contexts)
    {
        let newChangeApplier = new StateChangeApplier();
        // @ts-ignore
        newChangeApplier.TriggerContext = contextEl;
        newChangeApplier.HaveRespondTo(battleEvent);
        appliers.push(newChangeApplier);
    }

    return appliers;
}