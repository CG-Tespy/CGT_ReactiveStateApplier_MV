import { StateChange } from "./StateChange";
import { StateChangeTarget } from "./StateChangeTarget";

export class StateTriggerContext
{
    get Name(): string { return this.name; }
    private name: string = "";
    set Name(value) { this.name = value || ""; }

    get State(): RPG.State { return this.state; }
    private state: RPG.State = null;
    set State(value) { this.state = value; }

    get AttemptChanceNormalized(): number { return this.AttemptChance / 100; }

    get AttemptChance(): number { return this.attemptChance; }
    private attemptChance: number = 100;
    set AttemptChance(value) { this.attemptChance = value || 0; }

    get StateChangeType(): StateChange { return this.stateChangeType; }
    private stateChangeType: StateChange = StateChange.Null;
    set StateChangeType(value) { this.stateChangeType = value || StateChange.Null; }

    get AppliesTo(): StateChangeTarget[] { return this.appliesTo; }
    private appliesTo: StateChangeTarget[] = [];
    set AppliesTo(value) { this.appliesTo = value || []; }

    get Notes(): string { return this.notes; }
    private notes: string = "";
    set Notes(value) { this.notes = value || ""; }

    static Null: Readonly<StateTriggerContext> = new StateTriggerContext();

}
