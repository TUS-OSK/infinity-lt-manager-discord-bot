import { ButtonBuilder, ButtonStyle, MessageFlags } from "discord.js";
import type { Button } from "../types";
import { moveNextLT } from "../services/LTNotificationService";

const { ADMIN_USER_ID } = process.env;

export const moveNextLTButton: Button = {
    create: () => {
        return new ButtonBuilder()
            .setCustomId('move-next-lt')
            .setLabel('次のLTへ（LT会管理者のみ実行可能）')
            .setStyle(ButtonStyle.Primary)
    },
    isThisButton: (interaction) => {
        return interaction.customId === 'move-next-lt';
    },
    onClick: async (interaction) => {
        if (interaction.user.id !== ADMIN_USER_ID) {
            await interaction.reply({ content: 'このコマンドは特定の管理者のみ実行可能です。', flags: MessageFlags.Ephemeral });
            return;
        }
        await interaction.deferUpdate();
        await moveNextLT(interaction.client);
    }
}
