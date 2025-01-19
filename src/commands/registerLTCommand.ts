import { MessageFlags } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import type { Command } from '../types';
import { registerLTByCommand } from '../services/LTService';

export const registerLTCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('register-lt')
        .setDescription('登壇予定のLTを登録します。')
        .addStringOption(option => option.setName('title').setDescription('LTのタイトル').setRequired(true))
        .addBooleanOption(option => option.setName('ready').setDescription('準備完了かどうか').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('LTの概要').setRequired(false)),

    isThisCommand: function (interaction) {
        return interaction.commandName === this.data.name;
    },

    execute: async function (interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        await registerLTByCommand(interaction);
    }
}
