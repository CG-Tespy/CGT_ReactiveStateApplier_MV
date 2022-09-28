import { triggerRegexes, anyInteger } from '../Shared/Shared';
import { ApplierTargeting } from './ApplierTargeting';
import { StateApplierSettings } from './StateApplierSettings';
let Event = CGT.Core.Utils.Event;  
type Event = CGT.Core.Utils.Event; 
let ArrayEx = CGT.Core.Extensions.ArrayEx;

/** Applies its state to the relevant Battlers when its event trigger is fired. */
export class StateApplier
{
    get State(): RPG.State { return this.state; }
    private state: RPG.State = null;
    set State(value) { this.state = value; }

    private successRate: number = 0;
    /** At least 0. */
    get SuccessRate(): number { return this.successRate; }
    set SuccessRate(value)
    {
        this.successRate = value;
        this.successRateNormalized = value / 100.0;
    }

    private successRateNormalized = 0;
    /** Normalized the same way state rates are. */
    get SuccessRateNormalized(): number { return this.successRateNormalized; }

    private trigger: Event;
    /** Combat callback event this listens to, to decide when and to what to apply a state. */
    get Trigger(): Event { return this.trigger; }
    set Trigger(value)
    {
        this.trigger = value;
        this.ListenForTrigger();
    }
    
    protected Execute(damageArgs: DamageArgs): void
    {
        let target = this.DecideWhatToApplyTo(damageArgs);
        if (this.ShouldApplyTo(target)) {
            target.addState(this.state.id);
            this.RegisterAddedStateTo(target);
            this.UpdateLogWindowAsNeededFor(target);
        }
    }

    protected DecideWhatToApplyTo(damageArgs: DamageArgs): Game_Battler
    {
        if (this.Targeting == ApplierTargeting.attackTarget)
            return damageArgs.Target;
        else if (this.Targeting == ApplierTargeting.attacker)
            return damageArgs.User;
    }

    get Targeting() { return this.targeting; }
    private targeting: ApplierTargeting = ApplierTargeting.null;
    set Targeting(value) { this.targeting = value; }

    protected ShouldApplyTo(target: Game_Battler): boolean
    {
        let effSuccessChance = this.EffectiveSuccessChance(target);
        return effSuccessChance >= Math.random();
    }

    protected EffectiveSuccessChance(target: Game_Battler): number
    {
        let susceptibility: number = target.stateRate(this.state.id);
        // ^Should be normalized the same way the success rate is
        let chanceToLand: number = susceptibility * this.SuccessRateNormalized;

        return chanceToLand;
    }

    protected RegisterAddedStateTo(target: Game_Battler)
    {
        let result = target.result();
        result.pushAddedState(this.state.id);
    }

    protected UpdateLogWindowAsNeededFor(target: Game_Battler)
    {
        // When the state is being applied to the user, the log window doesn't
        // show the message letting the player know that... So we have to
        // make it do that ourselves.
        if (this.targeting == ApplierTargeting.attacker)
            BattleManager._logWindow.push("addText", target.name() + this.state.message1);
    }

    /** Creates StateAppliers based on the passed state's notetag contents. */
    static MultiFrom(state: RPG.State): StateApplier[]
    {
        let noteTags = state.note;
        let signalersThatApply: Event[] = this.GetSignalersFrom(noteTags);
        let apps: StateApplier[] = [];

        for (let i = 0; i < signalersThatApply.length; i++)
        {
            let signaler = signalersThatApply[i];
            let newApp = new StateApplier();
            newApp.state = state;
            newApp.Trigger = signaler;
            newApp.SuccessRate = this.GetTriggerSuccessRate(signaler, noteTags);
            newApp.RefreshTriggerListenings();
            apps.push(newApp);
        }

        return apps;
    }

    /**
     * Gets the event triggers/callbacks that apply, as per the contents of the notetags.
     * @param noteTags 
     */
    protected static GetSignalersFrom(noteTags: string): Event[]
    {
        let allTriggers: Event[] = ArrayEx.From(triggerRegexes.keys());
        let triggersThatApply: Event[] = [];

        for (let i = 0; i < allTriggers.length; i++)
        {
            let trigger: Event = allTriggers[i];
            let regexForTrigger: RegExp = triggerRegexes.get(trigger);
            let triggerMatch = noteTags.match(regexForTrigger) || [];

            let foundMatch = triggerMatch.length > 0;
            if (foundMatch) 
            {
                triggersThatApply.push(trigger);
            }

        }

        return triggersThatApply;
    }

    protected static GetTriggerSuccessRate(trigger: Event, noteTags: string): number
    {
        // This assumes that the trigger's regex has a valid match in the noteTags
        let regexForTrigger: RegExp = triggerRegexes.get(trigger);
        let triggerNotetag: string = noteTags.match(regexForTrigger)[0];
        let successRateStr = triggerNotetag.match(anyInteger)[0];

        return parseInt(successRateStr);
    }

    static Null: Readonly<StateApplier> = Object.freeze(new StateApplier());

    public RefreshTriggerListenings(): void
    {
        this.UnlistenForTrigger();
        this.ListenForTrigger();
    }

    protected UnlistenForTrigger(): void
    {
        this.trigger.RemoveListener(this.Execute, this);
    }

    protected ListenForTrigger(): void
    {
        this.trigger.AddListener(this.Execute, this);
    }

}

type DamageArgs = CGT.Core.Battle.DamageArgs;

export class StateApplierFactory
{
    static CreateMultiFrom(state: RPG.State)
    {
        let settingsArr = StateApplierSettings.MultiFrom(state);
        let apps = [];

        for (const settings of settingsArr)
        {
            let newApplier = new StateApplier();
            newApplier.State = settings.State;
            newApplier.SuccessRate = settings.SuccessRate;
            newApplier.Targeting = settings.Targeting;
            newApplier.Trigger = settings.Trigger;
            apps.push(newApplier);
        }

        return apps;
    }
}