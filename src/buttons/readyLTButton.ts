import { ButtonBuilder, ButtonStyle } from "discord.js";
import type { Button } from "../types";

export const readyLTButton: Button = {
    create: (ltId: string) => {
        return new ButtonBuilder()
            .setCustomId(`ready-lt-${ltId}`)
            .setLabel('準備完了')
            .setStyle(ButtonStyle.Primary)
    },
    isThisButton: (interaction) => {
        return interaction.customId.startsWith('ready-lt-');
    },
    onClick: async (interaction) => {
        await interaction.reply('発表準備完了ですね！:tada:');
    }
}
