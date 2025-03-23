import { ActionRowBuilder, MessageFlags, StringSelectMenuBuilder } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import type { Command } from '../types';
import { myLTsStringSelectMenu } from '../stringSelectMenus/myLTsStringSelectMenu';


export const editLTCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('edit-lt')
        .setDescription('自分のLTを編集します。'),

    isThisCommand: function (interaction) {
        return interaction.commandName === this.data.name;
    },

    execute: async function (interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const select = myLTsStringSelectMenu.create(interaction.user.id);

        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(select);

        await interaction.editReply({
            content: 'Choose your starter!',
            components: [row],
        });
    }
}
