import { StateTriggerContext } from "./StateTriggerContext";

export class MoStTrParams 
{
    get OnCrit(): StateTriggerContext[] { return this.onCrit; }
    private onCrit: StateTriggerContext[] = [];
    set OnCrit(value) { this.onCrit = value; }

    get OnWeaknessHit(): StateTriggerContext[] { return this.onWeaknessHit; }
    private onWeaknessHit: StateTriggerContext[] = [];
    set OnWeaknessHit(value) { this.onWeaknessHit = value; }
}
