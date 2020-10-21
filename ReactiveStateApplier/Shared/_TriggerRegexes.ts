import { eventKeys } from './_EventKeys';
import { tagPrefix, anyWhitespace, anyInteger } from './_RegexFragments';

type Event = CGT.Core.Utils.Event;

let CoreExtensions = CGT.Core.Extensions;
let ArrayEx = CoreExtensions.ArrayEx;
export let triggerRegexes: Map<Event, RegExp> = SetUpTriggerRegexes();

function SetUpTriggerRegexes()
{
    let triggerRegexes = new Map<Event, RegExp>();
    let events: Event[] = ArrayEx.From(eventKeys.keys());
    
    for (let i = 0; i < events.length; i++)
    {
        let eventEl = events[i];
        let eventKeyEl = eventKeys.get(eventEl);
        let regexFormat = `${tagPrefix}${anyWhitespace}${eventKeyEl}${anyWhitespace}${anyInteger}`;
        let regex = new RegExp(regexFormat);
        triggerRegexes.set(eventEl, regex);
    }

    return triggerRegexes;
}