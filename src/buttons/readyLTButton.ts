/**
 * Lightning Talk(LT)の準備完了状態を切り替えるボタンコンポーネント
 * 
 * このボタンは以下の処理を行います:
 * - 準備完了ボタンのUIを生成
 * - LTの準備状態の切り替え処理
 */
import { ButtonBuilder, ButtonStyle } from "discord.js";
import type { Button } from "../types";
import { switchLTReadyStateByButton } from "../services/LTManagementService";

/**
 * LT準備完了ボタンの定義
 */
export const readyLTButton: Button = {
    /**
     * 準備完了ボタンのUIを生成
     * @param {string} ltId - 対象のLT ID
     * @returns {ButtonBuilder} ボタンのインスタンス
     */
    create: (ltId: string) => {
        return new ButtonBuilder()
            .setCustomId(`ready-lt-${ltId}`)
            .setLabel('準備完了')
            .setStyle(ButtonStyle.Primary)
    },
    /**
     * インタラクションがこのボタンかどうかを判定
     * @param {ButtonInteraction} interaction - Discordのボタンインタラクション
     * @returns {boolean} このボタンのインタラクションかどうか
     */
    isThisButton: (interaction) => {
        return interaction.customId.startsWith('ready-lt-');
    },
    /**
     * ボタンクリック時の処理
     * @param {ButtonInteraction} interaction - Discordのボタンインタラクション
     */
    onClick: async (interaction) => {
        await interaction.deferUpdate();
        // LTの準備状態を切り替え
        await switchLTReadyStateByButton(interaction, false);
    }
}
