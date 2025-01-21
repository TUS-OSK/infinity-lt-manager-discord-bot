import { ButtonBuilder, ButtonStyle } from "discord.js";
import type { Button } from "../types";

export const unreadyLTButton: Button = {
    create: (ltId: string) => {
        return new ButtonBuilder()
            .setCustomId(`unready-lt-${ltId}`)
            .setLabel('準備中に戻す')
            .setStyle(ButtonStyle.Secondary)
    },
    isThisButton: (interaction) => {
        return interaction.customId.startsWith('unready-lt-');
    },
    onClick: async (interaction) => {
        await interaction.reply('発表準備中に戻しました:');
    }
}
