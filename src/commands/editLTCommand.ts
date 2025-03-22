import { ActionRowBuilder, MessageFlags, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import type { Command } from '../types';


export const editLTCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('edit-lt')
        .setDescription('自分のLTを編集します。'),

    isThisCommand: function (interaction) {
        return interaction.commandName === this.data.name;
    },

    execute: async function (interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const select = new StringSelectMenuBuilder()
            .setCustomId('starter')
            .setPlaceholder('Make a selection!')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Bulbasaur')
                    .setDescription('The dual-type Grass/Poison Seed Pokémon.')
                    .setValue('bulbasaur'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Charmander')
                    .setDescription('The Fire-type Lizard Pokémon.')
                    .setValue('charmander'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Squirtle')
                    .setDescription('The Water-type Tiny Turtle Pokémon.')
                    .setValue('squirtle'),
            );

        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(select);

        await interaction.editReply({
            content: 'Choose your starter!',
            components: [row],
        });
    }
}
