import { ButtonBuilder, ButtonStyle } from "discord.js";
import type { Button } from "../types";
import { deleteLTInteraction } from "../services/LTManagementService";

export const deleteLTButton: Button = {
    create: (ltId: string) => {
        return new ButtonBuilder()
            .setCustomId(`delete-lt-${ltId}`)
            .setLabel('削除')
            .setStyle(ButtonStyle.Danger)
    },
    isThisButton: (interaction) => {
        return interaction.customId.startsWith('delete-lt-');
    },
    onClick: async (interaction) => {
        await interaction.deferUpdate();

        const ltId = interaction.customId.split('-')[2];
        if (!ltId || isNaN(parseInt(ltId))) {
            console.error('ltId is empty');
            await interaction.editReply({ content: interaction.message.content + '\nFailed to delete LT due to parsing error' });
            return;
        }

        const responseMessageOptions = await deleteLTInteraction(interaction.client, parseInt(ltId), interaction.message.content);
        await interaction.editReply(responseMessageOptions);
    }
}
