import { MessageFlags } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import type { Command } from '../types';

const { ADMIN_USER_ID } = process.env;

export const startLTsCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('start-lts')
        .setDescription('（LT会管理者のみ実行可能）LTを開始します。'),

    isThisCommand: function (interaction) {
        return interaction.commandName === this.data.name;
    },

    execute: async function (interaction) {
        if (interaction.user.id !== ADMIN_USER_ID) {
            await interaction.reply({ content: 'このコマンドは特定の管理者のみ実行可能です。', flags: MessageFlags.Ephemeral });
            return;
        }
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    }
}
