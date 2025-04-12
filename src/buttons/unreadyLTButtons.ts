/**
 * Lightning Talk(LT)の準備状態を「準備中」に戻すボタンコンポーネント
 * 
 * このボタンは以下の処理を行います:
 * - 準備中に戻すボタンのUIを生成
 * - LTの準備状態の切り替え処理
 */
import { ButtonBuilder, ButtonStyle } from "discord.js";
import type { Button } from "../types";
import { switchLTReadyStateByButton } from "../services/LTManagementService";

/**
 * LT準備中ボタンの定義
 */
export const unreadyLTButton: Button = {
    /**
     * 準備中に戻すボタンのUIを生成
     * @param {string} ltId - 対象のLT ID
     * @returns {ButtonBuilder} ボタンのインスタンス
     */
    create: (ltId: string) => {
        return new ButtonBuilder()
            .setCustomId(`unready-lt-${ltId}`)
            .setLabel('準備中に戻す')
            .setStyle(ButtonStyle.Secondary)
    },
    /**
     * インタラクションがこのボタンかどうかを判定
     * @param {ButtonInteraction} interaction - Discordのボタンインタラクション
     * @returns {boolean} このボタンのインタラクションかどうか
     */
    isThisButton: (interaction) => {
        return interaction.customId.startsWith('unready-lt-');
    },
    /**
     * ボタンクリック時の処理
     * @param {ButtonInteraction} interaction - Discordのボタンインタラクション
     */
    onClick: async (interaction) => {
        await interaction.deferUpdate();
        // LTの準備状態を準備中に切り替え
        await switchLTReadyStateByButton(interaction, true);
    }
}
