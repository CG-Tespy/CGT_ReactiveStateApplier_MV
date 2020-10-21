type Event = CGT.Core.Utils.Event;
let CoreUtils = CGT.Core.Utils;
let Callbacks = CoreUtils.Callbacks;
let CriticalHit = Callbacks.CriticalHit;
let WeaknessHit = Callbacks.WeaknessExploited;
export let eventKeys = SetUpEventKeys();

function SetUpEventKeys()
{
    let eventKeys = new Map<Event, string>
    ( 
        [
            [CriticalHit, 'OnCrit'],
            [WeaknessHit, 'OnWeaknessHit'],
        ]
    );

    return eventKeys;
}