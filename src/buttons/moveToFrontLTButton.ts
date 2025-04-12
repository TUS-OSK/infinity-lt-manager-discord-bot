/**
 * Lightning Talk(LT)を先頭に移動するためのボタンコンポーネント
 * 
 * このボタンは以下の処理を行います:
 * - LTを先頭に移動するボタンのUIを生成
 * - 優先度変更処理の実行
 * - 優先度更新結果のフィードバック
 */
import { ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonStyle, type MessageActionRowComponent } from "discord.js";
import type { Button } from "../types";
import { getMaxPriorityLT, updatePriority } from "../tables/lightningTalkTable";

/**
 * LTを先頭に移動するボタンの定義
 */
export const MoveToFrontLTButton: Button = {
    /**
     * LTを先頭に移動するボタンのUIを生成
     * @param {string} ltId - 移動対象のLT ID
     * @returns {ButtonBuilder} ボタンのインスタンス
     */
    create: (ltId: string) => {
        return new ButtonBuilder()
            .setCustomId(`priority-lt-${ltId}`)
            .setLabel('このLTを先頭に移動')
            .setStyle(ButtonStyle.Secondary)
    },
    /**
     * インタラクションがこのボタンかどうかを判定
     * @param {ButtonInteraction} interaction - Discordのボタンインタラクション
     * @returns {boolean} このボタンのインタラクションかどうか
     */
    isThisButton: (interaction) => {
        return interaction.customId.startsWith('priority-lt-');
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
            await interaction.editReply({ 
                content: interaction.message.content + '\nFailed to change priority due to parsing error' 
            });
            return;
        }

        // 現在の最大優先度を取得
        const maxPriority = await getMaxPriorityLT(interaction.user.id);
        
        // 優先度を更新 (最大優先度+1で先頭に移動)
        const { lt, error } = await updatePriority(parseInt(ltId), maxPriority + 1);

        if (error || !lt) {
            console.error('Failed to change priority', error);
            await interaction.editReply({ 
                content: interaction.message.content + '\nFailed to change priority' 
            });
            return;
        }

        // 成功メッセージを表示し、ボタンを無効化
        await interaction.editReply({
            content: '先頭に移動しました',
            components: []
        });
    }
}
