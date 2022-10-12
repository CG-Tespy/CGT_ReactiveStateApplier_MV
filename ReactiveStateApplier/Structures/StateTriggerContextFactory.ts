import { IParsedStateTriggerContext } from "./IParsedStateTriggerContext";
import { StateChangeTarget } from "./Enums/StateChangeTarget";
import { StateTriggerContext } from "./StateTriggerContext";
import { StateChange } from "./Enums/StateChange"; 

let PluginParamEx = CGT.Core.Extensions.PluginParamEx;

export class StateTriggerContextFactory
{
    static CreateMultiFrom(stringifiedArr: string): StateTriggerContext[]
    {
        let validArr = stringifiedArr.trim().length > 0;
        if (!validArr)
            return [];

        let results = [];

        let inArrayForm = JSON.parse(stringifiedArr);

        for (const stringifiedContext of inArrayForm)
        {
            let properContext = this.CreateFrom(stringifiedContext);
            results.push(properContext);
        }

        return results;
    }

    static CreateFrom(stringifiedParam: string): StateTriggerContext
    {
        let notValid = stringifiedParam.trim().length == 0;
        if (notValid)
            return StateTriggerContext.Null as StateTriggerContext;

        let result = this.FromStringified(stringifiedParam);
        return result;
    }

    protected static FromStringified(stringified: string)
    {
        let parsed: IParsedStateTriggerContext = JSON.parse(stringified);
        let newContext = new StateTriggerContext();

        newContext.Name = parsed.Name;

        let stateID = Number(parsed.State);
        newContext.State = $dataStates[stateID];

        newContext.AttemptChance = Number(parsed.AttemptChance);
        newContext.StateChangeType = StateChange[parsed.StateChangeType];
        newContext.AppliesTo = this.GetAppliesTo(parsed);
        newContext.Notes = parsed.Notes;

        return newContext;
    }

    protected static GetAppliesTo(parsed: IParsedStateTriggerContext): StateChangeTarget[]
    {
        let targets: StateChangeTarget[] = [];

        if (parsed.ApplyToAttacker == 'true')
            targets.push(StateChangeTarget.Attacker);
        if (parsed.ApplyToTarget == 'true')
            targets.push(StateChangeTarget.TargetOfAttack);

        return targets;
    }
}
