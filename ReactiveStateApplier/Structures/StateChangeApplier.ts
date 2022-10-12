import { ArrayEx } from "../Shared/Shared";
import { StateChangeTarget } from "./Enums/StateChangeTarget";
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
        
        for (const currentTarget of targets.keys())
        {
            let procIt = this.ShouldProcOn(currentTarget);
            if (!procIt)
                continue;

            let targetingType = targets.get(currentTarget);
            this.UpdateLogWindowAsNeededFor(currentTarget, targetingType);
            // ^We want the log window updated first in case the attacker
            // did a multi-hit attack that can trigger the state more than
            // once 
            currentTarget.addState(this.StateToProc.id);
        }
        
    }

    protected get StateToProc(): RPG.State { return this.triggerContext.State; }

    protected FindTargetsFrom(damageArgs: DamageArgs)
    {
        let targets: Map<Game_Battler, StateChangeTarget> = new Map();
        let potentialTargets = this.triggerContext.AppliesTo;

        if (ArrayEx.Includes(potentialTargets, StateChangeTarget.Attacker))
            targets.set(damageArgs.User, StateChangeTarget.Attacker);
        if (ArrayEx.Includes(potentialTargets, StateChangeTarget.TargetOfAttack))
            targets.set(damageArgs.Target, StateChangeTarget.TargetOfAttack);

        return targets;
    }

    protected ShouldProcOn(target: Game_Battler): boolean
    {
        if (!this.ShouldTryToProc())
            return false;

        // We don't want to do stuff like force states onto enemies that are supposed
        // to be immune to them, so...
        let susceptibility = target.stateRate(this.StateToProc.id);
        let whetherWeShould = susceptibility > Math.random();

        return whetherWeShould;
    }

    protected ShouldTryToProc()
    {
        return this.triggerContext.AttemptChanceNormalized >= Math.random();
    }

    protected UpdateLogWindowAsNeededFor(target: Game_Battler, targeting: StateChangeTarget)
    {
        // For some reason, the status message for the attacker just doesn't show up
        // without this little workaround
        let targetIsAttacker = targeting == StateChangeTarget.Attacker;
        let targetAlreadyHasState = target.isStateAffected(this.StateToProc.id);
        if (targetIsAttacker && !targetAlreadyHasState)
        {
            BattleManager._logWindow.push("addText", target.name() + this.StateToProc.message1);
        }
    }

}