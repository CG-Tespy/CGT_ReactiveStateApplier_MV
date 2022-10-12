declare namespace CGT
{
    namespace MoStTr
    {
        let version: number;

        let stateAppliers: StateApplier[];

        let Params: MoStTrParams;

        class MoStTrParams
        {
            get OnCrit(): StateTriggerContext[]
            get OnWeaknessHit(): StateTriggerContext[]
        }

        /** Applies its state to the relevant Battlers when its event trigger is fired. */
        class StateApplier
        {
            get State(): RPG.State;

            /** At least 0. */
            get SuccessRate(): number;

            /** Normalized the same way state rates are. */
            get SuccessRateNormalized(): number

            /** Combat callback event this listens to, to decide when and to what to apply a state. */
            get Signaler(): Event;
            
            /** Creates StateAppliers based on the passed state's notetag contents. */
            static MultiFrom(state: RPG.State): StateApplier[]

            static Null: Readonly<StateApplier>;

            public RefreshTriggerListenings(): void

        }

        class StateChangeApplier 
        {

        }

        class StateTriggerContext 
        {
            get Name(): string;

            get State(): RPG.State;

            get AttemptChanceNormalized(): number;

            /** 
             * Since the actual proc chance will depend on the targets' susceptibility
             * to the States
             */
            get AttemptChance(): number;
            
            get StateChangeType(): StateChange;

            get AppliesTo(): StateChangeTarget[];

            get Notes(): string;

            get Null(): Readonly<StateTriggerContext>;
        }

        enum StateChangeTarget
        {
            Null, Attacker, TargetOfAttack
        }

        enum StateChange 
        {
            Null, Add, Remove
        }

        let Appliers: {
            Crit: StateChangeApplier[],
            WeaknessHit: StateChangeApplier[]
        };

    }
}