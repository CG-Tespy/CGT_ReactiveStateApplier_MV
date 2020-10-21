declare namespace CGT
{
    namespace ReStAp
    {
        let version: number;

        let stateAppliers: StateApplier[];

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

    }
}