import type { CommandInteraction, SharedSlashCommand } from "discord.js";

export type Command = {
    data: SharedSlashCommand;
    isThisCommand: (interaction: CommandInteraction) => boolean;
    execute: (interaction: CommandInteraction) => Promise<void>;
}


