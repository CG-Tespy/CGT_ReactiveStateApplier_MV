import { triggerRegexes, anyInteger } from '../Shared/Shared';
let Event = CGT.Core.Utils.Event;  
type Event = CGT.Core.Utils.Event; 
let ArrayEx = CGT.Core.Extensions.ArrayEx;

/** Applies its state to the relevant Battlers when its event trigger is fired. */
export class StateApplier
{
    private state: RPG.State = null;
    get State(): RPG.State { return this.state; }

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

    private signaler: Event;
    /** Combat callback event this listens to, to decide when and to what to apply a state. */
    get Signaler(): Event { return this.signaler; }
    set Signaler(value)
    {
        this.signaler = value;
        this.ListenForTrigger();
    }
    
    protected Execute(target: Game_Battler, result: Game_ActionResult): void
    {
        if (this.ShouldApplyTo(target))
            target.addState(this.state.id);
    }

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
            newApp.Signaler = signaler;
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
        this.signaler.RemoveListener(this.Execute, this);
    }

    protected ListenForTrigger(): void
    {
        this.signaler.AddListener(this.Execute, this);
    }

}