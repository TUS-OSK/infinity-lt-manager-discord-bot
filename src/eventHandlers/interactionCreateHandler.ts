import { MessageFlags, type Interaction } from "discord.js";
import commands from "../commands";

export const interactionCreateHandler = async (interaction: Interaction) => {
    console.log('interactionCreateHandler start');

    if (interaction.isCommand()) {
        const command = commands.find(command => command.isThisCommand(interaction));

        if (command) {
            try{
            await command.execute(interaction);
            } catch (error) {
                console.error('Failed to execute command', error);
                await interaction.editReply({ content: 'Failed to execute command.' });
            }
        } else {
            await interaction.reply({ content: 'Unknown command.', flags: MessageFlags.Ephemeral });
        }
    }



    console.log('interactionCreateHandler end');
}