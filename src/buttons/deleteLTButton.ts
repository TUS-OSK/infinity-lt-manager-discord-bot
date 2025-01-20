import { ButtonBuilder, ButtonStyle } from "discord.js";
import type { Button } from "../types";

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
        interaction.deferReply();
        interaction.editReply('削除しました');
    }
}
