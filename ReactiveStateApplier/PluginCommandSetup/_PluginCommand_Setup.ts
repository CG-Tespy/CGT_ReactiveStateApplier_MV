let commands = new Map<string, CGT.Core.PluginCommands.RawCommandFunc>(
    [
        
    ]
);

let RegisterPluginCommand = CGT.Core.PluginCommands.Register;

for (let commandName of commands.keys())
{
    let commandFunc = commands.get(commandName);
    RegisterPluginCommand(commandName, commandFunc);
}
