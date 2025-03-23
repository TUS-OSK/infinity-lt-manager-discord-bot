import { ActionRowBuilder, MessageFlags, StringSelectMenuBuilder } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import type { Command } from '../types';
import { editLTsStringSelectMenu } from '../stringSelectMenus/editLTsStringSelectMenu';


export const editLTCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('edit-lt')
        .setDescription('自分のLTを編集します。'),

    isThisCommand: function (interaction) {
        return interaction.commandName === this.data.name;
    },

    execute: async function (interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const select = await editLTsStringSelectMenu.create(interaction.user.id);
        if (!select) {
            await interaction.editReply('Failed to get your LTs');
            return;
        }

        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(select);

        await interaction.editReply({
            content: '編集したいLTを選択してください',
            components: [row],
        });
    }
}
