/**
 * Lightning Talk(LT)を削除するためのボタンコンポーネント
 * 
 * このボタンはLTの削除機能を提供し、以下の処理を行います:
 * - 削除ボタンのUIを生成
 * - ボタンクリックイベントのハンドリング
 * - LTの削除処理の実行
 */
import { ButtonBuilder, ButtonStyle } from "discord.js";
import type { Button } from "../types";
import { handleLTDeletion } from "../services/LTManagementService";

/**
 * LT削除ボタンの定義
 */
export const deleteLTButton: Button = {
    /**
     * 削除ボタンのUIを生成
     * @param {string} ltId - 削除対象のLT ID
     * @returns {ButtonBuilder} 削除ボタンのインスタンス
     */
    create: (ltId: string) => {
        return new ButtonBuilder()
            .setCustomId(`delete-lt-${ltId}`)
            .setLabel('削除')
            .setStyle(ButtonStyle.Danger)
    },
    /**
     * インタラクションがこのボタンかどうかを判定
     * @param {ButtonInteraction} interaction - Discordのボタンインタラクション
     * @returns {boolean} このボタンのインタラクションかどうか
     */
    isThisButton: (interaction) => {
        return interaction.customId.startsWith('delete-lt-');
    },
    /**
     * ボタンクリック時の処理
     * @param {ButtonInteraction} interaction - Discordのボタンインタラクション
     */
    onClick: async (interaction) => {
        await interaction.deferUpdate();

        // カスタムIDからLT IDを抽出
        const ltId = interaction.customId.split('-')[2];
        if (!ltId || isNaN(parseInt(ltId))) {
            console.error('ltId is empty');
            await interaction.editReply({ content: interaction.message.content + '\nFailed to delete LT due to parsing error' });
            return;
        }

        // LT削除処理を実行
        const responseMessageOptions = await handleLTDeletion(interaction.client, parseInt(ltId), interaction.message.content);
        await interaction.editReply(responseMessageOptions);
    }
}
