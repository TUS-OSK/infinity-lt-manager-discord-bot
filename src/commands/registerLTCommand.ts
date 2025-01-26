import { MessageFlags } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import type { Command } from '../types';
import { registerLTInteraction } from '../services/LTManagementService';

export const registerLTCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('register-lt')
        .setDescription('登壇予定のLTを登録します。')
        .addStringOption(option => option.setName('title').setDescription('LTのタイトル').setRequired(true))
        .addBooleanOption(option => option.setName('ready').setDescription('今すぐ発表できますか？').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('LTの概要').setRequired(false)),

    isThisCommand: function (interaction) {
        return interaction.commandName === this.data.name;
    },

    execute: async function (interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const title = interaction.options?.get('title')?.value as string | undefined;
        const ready = interaction.options?.get('ready')?.value as boolean | undefined;
        const description = interaction.options?.get('description')?.value as string | undefined;

        if (title === undefined || ready === undefined) {
            await interaction.editReply({ content: 'Failed to parse options' });
            return;
        }

        const responseMessageOptions = await registerLTInteraction(interaction.client, title, ready, interaction.user.id, description);
        await interaction.editReply(responseMessageOptions);
    }

}