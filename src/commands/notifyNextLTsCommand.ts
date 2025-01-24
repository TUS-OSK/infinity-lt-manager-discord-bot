import { MessageFlags } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import type { Command } from '../types';

export const notifyNextLTsCommand: Command = {
    data: new SlashCommandBuilder()
    .setName('next-lt')
    .setDescription('次回のLTを通知します。')
    .addIntegerOption(option => option.setName('limit').setDescription('発表者数（default: 10）').setRequired(false)),

    isThisCommand: function (interaction) {
        return interaction.commandName === this.data.name;
    },

    execute: async function (interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    }
}
