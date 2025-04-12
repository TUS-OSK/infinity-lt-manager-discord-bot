/**
 * 次回LT通知コマンド
 * 管理者が次回のLT発表者を通知するためのスラッシュコマンドを提供する
 */
import { MessageFlags } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import type { Command } from '../types';
import { notifyNextLTsByCommand } from '../services/LTNotificationService';

const { ADMIN_USER_ID } = process.env;

/**
 * 次回LT通知コマンドの実装
 * 管理者のみ実行可能で、準備が整ったLT発表者を通知する
 */
export const notifyNextLTsCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('next-lt')
        .setDescription('（LT会管理者のみ実行可能）次回のLTを通知します。')
        .addIntegerOption(option => option.setName('limit').setDescription('発表者数（default: 10）').setRequired(false)),

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
        await notifyNextLTsByCommand(interaction);
    }
}
