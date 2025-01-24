import { MessageFlags } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import type { Command } from '../types';
import { notifyNextLTsByCommand } from '../services/LTNotificationService';

const { ADMIN_USER_ID } = process.env;

export const notifyNextLTsCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('next-lt')
        .setDescription('（LT会管理者のみ実行可能）次回のLTを通知します。')
        .addIntegerOption(option => option.setName('limit').setDescription('発表者数（default: 10）').setRequired(false)),

    isThisCommand: function (interaction) {
        return interaction.commandName === this.data.name;
    },

    execute: async function (interaction) {
        if (interaction.user.id !== ADMIN_USER_ID) {
            await interaction.reply({ content: 'このコマンドは特定の管理者のみ実行可能です。', flags: MessageFlags.Ephemeral });
            return;
        }
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        await notifyNextLTsByCommand(interaction);
    }
}
