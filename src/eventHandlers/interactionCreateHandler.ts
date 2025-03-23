import { MessageFlags, type Interaction } from "discord.js";
import commands from "../commands";
import buttons from "../buttons";
import stringSelectMenus from "../stringSelectMenus";

export const interactionCreateHandler = async (interaction: Interaction) => {
    console.log('interactionCreateHandler start');

    if (interaction.isCommand()) {
        const command = commands.find(command => command.isThisCommand(interaction));

        if (command) {
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error('Failed to execute command', error);

                await interaction.editReply({ content: 'Failed to execute command.' });
            }
        } else {
            await interaction.reply({ content: 'Unknown command.', flags: MessageFlags.Ephemeral });
        }
    } else if (interaction.isButton()) {
        const button = buttons.find(button => button.isThisButton(interaction));

        if (button) {
            try {
                await button.onClick(interaction);
            } catch (error) {
                console.error('Failed to execute button', error);
                await interaction.editReply({ content: interaction.message.content + '\nFailed to execute button.' });
            }
        } else {
            await interaction.editReply({ content: interaction.message.content + '\nUnknown button.' });
        }
    } else if (interaction.isStringSelectMenu()) {
        console.log(stringSelectMenus);
        const stringSelectMenu = stringSelectMenus.find(selectMenu => selectMenu.isThisSelectMenu(interaction));

        if (stringSelectMenu) {
            try {
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });
                await stringSelectMenu.onSelect(interaction);
            } catch (error) {
                console.error('Failed to execute select menu', error);
                await interaction.editReply({ content: interaction.message.content + '\nFailed to execute select menu.' });
            }
        } else {
            await interaction.reply({ content: interaction.message.content + '\nUnknown select menu.' });
        }
    }

    console.log('interactionCreateHandler end');
}
