import type { Command } from '../types';
import { SlashCommandBuilder } from '@discordjs/builders';

export const registerLTCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('register-lt')
        .setDescription('登壇予定のLTを登録します。')
        .addStringOption(option => option.setName('title').setDescription('LTのタイトル').setRequired(true))
        .addBooleanOption(option => option.setName('isReady').setDescription('準備完了かどうか').setRequired(true)),

    isThisCommand: function (interaction) {
        return interaction.commandName === this.data.name;
    },

    execute: async function (interaction) {
        await interaction.reply({ content: 'LTを登録しました。', ephemeral: true });
    }
}
