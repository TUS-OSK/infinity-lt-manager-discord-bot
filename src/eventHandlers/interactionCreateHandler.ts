import type { Interaction } from "discord.js";
import commands from "../commands";

export const interactionCreateHandler = async (interaction: Interaction) => {
    console.log('interactionCreateHandler start');

    if (interaction.isCommand()) {
        const command = commands.find(command => command.isThisCommand(interaction));

        if (command) {
            await command.execute(interaction);
        } else {
            await interaction.reply({ content: 'Unknown command.', ephemeral: true });
        }
    }



    console.log('interactionCreateHandler end');
}