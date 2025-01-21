import { ButtonBuilder, ButtonStyle } from "discord.js";
import type { Button } from "../types";
import { deleteLTByButton } from "../services/LTManagementService";

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
        await deleteLTByButton(interaction);
    }
}
