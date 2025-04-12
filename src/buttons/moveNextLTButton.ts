/**
 * Lightning Talk(LT)を次の発表に進めるためのボタンコンポーネント
 * 
 * このボタンは管理者専用機能で、以下の処理を行います:
 * - 次のLTへ進むボタンのUIを生成
 * - 管理者権限のチェック
 * - 次のLTへの移行処理の実行
 */
import { ButtonBuilder, ButtonStyle, MessageFlags } from "discord.js";
import type { Button } from "../types";
import { moveNextLT } from "../services/LTNotificationService";

const { ADMIN_USER_ID } = process.env;

/**
 * 次のLTへ進むボタンの定義
 */
export const moveNextLTButton: Button = {
    /**
     * 次のLTへ進むボタンのUIを生成
     * @returns {ButtonBuilder} ボタンのインスタンス
     */
    create: () => {
        return new ButtonBuilder()
            .setCustomId('move-next-lt')
            .setLabel('次のLTへ（LT会管理者のみ実行可能）')
            .setStyle(ButtonStyle.Primary)
    },
    /**
     * インタラクションがこのボタンかどうかを判定
     * @param {ButtonInteraction} interaction - Discordのボタンインタラクション
     * @returns {boolean} このボタンのインタラクションかどうか
     */
    isThisButton: (interaction) => {
        return interaction.customId === 'move-next-lt';
    },
    /**
     * ボタンクリック時の処理
     * @param {ButtonInteraction} interaction - Discordのボタンインタラクション
     */
    onClick: async (interaction) => {
        // 管理者権限チェック
        if (interaction.user.id !== ADMIN_USER_ID) {
            await interaction.reply({ 
                content: 'このコマンドは特定の管理者のみ実行可能です。', 
                flags: MessageFlags.Ephemeral 
            });
            return;
        }

        await interaction.deferUpdate();
        
        // 次のLTへ進む処理を実行
        await moveNextLT(interaction.client);
        
        // ボタンを無効化
        await interaction.message.edit({ components: [] });
    }
}
