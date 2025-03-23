import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import type { StringSelectMenu } from "../types";


export const myLTsStringSelectMenu: StringSelectMenu = {
    create: (discordUserId: string): StringSelectMenuBuilder => {
        return new StringSelectMenuBuilder()
            .setCustomId(`my-lts-${discordUserId}`)
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
    },

    isThisSelectMenu: (interaction) => {
        console.log('isThisSelectMenu', interaction.customId);
        return interaction.customId.startsWith('my-lts-');
    },

    onSelect: async (interaction) => {
        await interaction.deferReply();
        await interaction.editReply('You selected ' + interaction.values[0]);
    }
}