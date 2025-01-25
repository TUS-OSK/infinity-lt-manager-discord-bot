import { ButtonBuilder, ButtonStyle } from "discord.js";
import type { Button } from "../types";

export const moveNextLTButton: Button = {
    create: () => {
        return new ButtonBuilder()
            .setCustomId('move-next-lt')
            .setLabel('次のLTへ')
            .setStyle(ButtonStyle.Primary)
    },
    isThisButton: (interaction) => {
        return interaction.customId === 'move-next-lt';
    },
    onClick: async (interaction) => {
        await interaction.deferUpdate();
    }
}
