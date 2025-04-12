/**
 * LT開始コマンド
 * 管理者がLTセッションを開始するためのスラッシュコマンドを提供する
 */
import { MessageFlags } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import type { Command } from '../types';
import { startLTsByCommand } from '../services/LTNotificationService';

const { ADMIN_USER_ID } = process.env;

/**
 * LT開始コマンドの実装
 * 管理者のみ実行可能で、LTセッションを開始し発表者を通知する
 */
export const startLTsCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('start-lts')
        .setDescription('（LT会管理者のみ実行可能）LTを開始します。'),

    isThisCommand: function (interaction) {
        return interaction.commandName === this.data.name;
    },

    /**
     * コマンド実行処理
     * @param interaction - コマンドインタラクション
     * @returns Promise<void>
     * @throws 管理者以外が実行した場合はエラーメッセージを返す
     */
    execute: async function (interaction) {
        if (interaction.user.id !== ADMIN_USER_ID) {
            await interaction.reply({ content: 'このコマンドは特定の管理者のみ実行可能です。', flags: MessageFlags.Ephemeral });
            return;
        }
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        await startLTsByCommand(interaction);
    }
}
