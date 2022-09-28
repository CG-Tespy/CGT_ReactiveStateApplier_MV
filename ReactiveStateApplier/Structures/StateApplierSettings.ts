import { allTriggers } from "../Shared/_Events";
import { anyInteger } from "../Shared/_RegexFragments";
import { singleSpace } from "../Shared/_Strings";
import { triggerRegexes } from "../Shared/_TriggerRegexes";
import { ApplierTargeting } from "./ApplierTargeting";

type Event = CGT.Core.Utils.Event;

/**
 * Holds the state of a StateApplier without any behavior. Meant to be
 * used to help set up actual StateAppliers.
 */
export class StateApplierSettings
{
    get Targeting() { return this.targeting; }
    private targeting: ApplierTargeting = ApplierTargeting.null;

    private state: RPG.State = null;
    get State(): RPG.State { return this.state; }

    private successRate: number = 0;
    /** At least 0. */
    get SuccessRate(): number { return this.successRate; }
    set SuccessRate(value) { this.successRate = value; }

    get Trigger() { return this.trigger; }
    private trigger: Event = null;
    set Trigger(value) { this.trigger = value; }

    static MultiFrom(state: RPG.State): StateApplierSettings[]
    {
        let fullNoteTags = state.note;
        let noteTagLines = this.GetNoteTagLinesFrom(fullNoteTags);
        let settingsArr: StateApplierSettings[] = [];

        for (const line of noteTagLines)
        {
            settingsArr.push(this.From(state, line));
        }

        return settingsArr;
    }

    // The ones that this plugin is supposed to respond to
    protected static GetNoteTagLinesFrom(fullNoteTags: string): string[]
    {
        let noteTagLines: string[] = [];
        for (const trigger of allTriggers)
        {
            let regex = triggerRegexes.get(trigger);
            let linesFound = fullNoteTags.match(regex) || [];
            noteTagLines = noteTagLines.concat(linesFound);
        }

        return noteTagLines;
    }

    protected static From(state: RPG.State, line: string)
    {
        var newSettings = new StateApplierSettings();
        newSettings.state = state;
        newSettings.trigger = this.GetTriggerFrom(line);
        newSettings.successRate = this.GetSuccessRateFrom(line.split(singleSpace));
        newSettings.targeting = this.GetTargetingFrom(line);
        return newSettings;
    }

    protected static GetTriggerFrom(line: string): Event
    {
        for (const trigger of allTriggers)
        {
            let regex = triggerRegexes.get(trigger);
            let triggerFound = regex.test(line);
            if (triggerFound)
                return trigger;
        }

        throw `Could not find trigger in ${line}`;
    }

    protected static GetSuccessRateFrom(lineSplit: string[])
    {
        let successRateStr = lineSplit[this.successRateIndex];
        return parseInt(successRateStr);
    }

    protected static successRateIndex = 2;

    protected static GetTargetingFrom(fullLine: string): ApplierTargeting
    {
        let result: ApplierTargeting = ApplierTargeting.null;
        fullLine = fullLine.toLowerCase(); // We want things case-insensitive here
        let targetingKeys: string[] = Object.keys(ApplierTargeting);
        for (const key of targetingKeys)
        {
            if (fullLine.contains(key.toLowerCase()))
                return ApplierTargeting[key];
        }

        return result;
    }

    protected static targetingIndex = 3;

}