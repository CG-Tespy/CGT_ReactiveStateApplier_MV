import { pluginName } from "../Shared/_Strings";
import { MoStTrParams } from "../Structures/MoStTrParams";
import { StateTriggerContextFactory } from "../Structures/StateTriggerContextFactory";

AliasTitleScreenStart();

function AliasTitleScreenStart()
{
    let oldInit = Scene_Title.prototype.initialize;

    function NewInit(this: Scene_Title)
    {
        oldInit.call(this, arguments);
        SetUpPluginParams();
    }

    function SetUpPluginParams()
    {
        let rawParams = PluginManager.parameters(pluginName);
        let creator = StateTriggerContextFactory;
        let onCrit = creator.CreateMultiFrom(rawParams[paramNames.OnCrit]);
        let onWeaknessHit = creator.CreateMultiFrom(rawParams[paramNames.OnWeaknessHit]);

        let paramContainer = new MoStTrParams();
        paramContainer.OnCrit = onCrit;
        paramContainer.OnWeaknessHit = onWeaknessHit;

        // @ts-ignore
        CGT.MoStTr.Params = paramContainer;
    }

    Scene_Title.prototype.initialize = NewInit;
}

let paramNames = 
{
    OnCrit: "OnCrit",
    OnWeaknessHit: "OnWeaknessHit",
};