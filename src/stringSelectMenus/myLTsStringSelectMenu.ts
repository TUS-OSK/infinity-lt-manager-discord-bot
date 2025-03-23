import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, type RestOrArray } from "discord.js";
import type { StringSelectMenu } from "../types";
import { getLTsBySpeaker } from "../tables/lightningTalkTable";


export const myLTsStringSelectMenu: StringSelectMenu = {
    create: async (discordUserId: string) => {
        const { lts, error } = await getLTsBySpeaker(discordUserId);
        if (error) {
            console.error('Failed to get LTs by speaker', error);
            return null;
        }

        if (!lts) {
            console.error('LTs not found');
            return null;
        }

        return new StringSelectMenuBuilder()
            .setCustomId(`my-lts-${discordUserId}`)
            .setPlaceholder('編集したいLTを選択してください')
            .addOptions(
                lts.map(lt => {
                    return new StringSelectMenuOptionBuilder()
                        .setLabel(lt.title)
                        .setValue(lt.id.toString())
                })
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