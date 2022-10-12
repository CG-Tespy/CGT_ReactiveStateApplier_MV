import { ArrayEx } from "../Shared/Shared";
import { StateChangeTarget } from "./StateChangeTarget";
import { StateTriggerContext } from "./StateTriggerContext";

type DamageArgs = CGT.Core.Battle.DamageArgs;
type Event = CGT.Core.Utils.Event;

export class StateChangeApplier
{
    private triggerContext: StateTriggerContext = StateTriggerContext.Null as StateTriggerContext;
    set TriggerContext(value: StateTriggerContext) 
    { 
        this.triggerContext = value || StateTriggerContext.Null as StateTriggerContext; 
    }

    HaveRespondTo(battleEvent: Event)
    {
        battleEvent.AddListener(this.BattleEventResponse, this);
    }

    StopHavingRespondTo(battleEvent: Event)
    {
        battleEvent.RemoveListener(this.BattleEventResponse, this);
    }

    BattleEventResponse(damageArgs: DamageArgs)
    {
        let targets = this.FindTargetsFrom(damageArgs);
        let stateToProc: RPG.State = this.triggerContext.State;
        
        for (const currentTarget of targets)
        {
            let procIt = this.ShouldProc(stateToProc, currentTarget);
            if (!procIt)
                continue;

            currentTarget.addState(stateToProc.id);
            this.RegisterStateAsProcced(damageArgs.Result);
        }
        
    }

    protected FindTargetsFrom(damageArgs: DamageArgs): Game_Battler[]
    {
        let targets: Game_Battler[] = [];
        let potentialTargets = this.triggerContext.AppliesTo;

        if (ArrayEx.Includes(potentialTargets, StateChangeTarget.Attacker))
            targets.push(damageArgs.User);
        if (ArrayEx.Includes(potentialTargets, StateChangeTarget.TargetOfAttack))
            targets.push(damageArgs.Target);

        return targets;
    }

    protected ShouldProc(state: RPG.State, target: Game_Battler)
    {
        // We don't want to do stuff like force states onto enemies that are supposed
        // to be immune to them, so...
        let susceptibility = target.stateRate(state.id);
        let actualProcChance = susceptibility * this.triggerContext.AttemptChanceNormalized;
        let whetherWeShould = actualProcChance >= Math.random();

        return whetherWeShould;
    }

    protected RegisterStateAsProcced(result: Game_ActionResult)
    {
        // So the battle log updates as appropriate
        let state = this.triggerContext.State;
        result.pushAddedState(state.id);
    }

}