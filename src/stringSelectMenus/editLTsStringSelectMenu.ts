import { ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, type RestOrArray } from "discord.js";
import type { StringSelectMenu } from "../types";
import { getLTById, getLTsBySpeaker } from "../tables/lightningTalkTable";
import { deleteLTButton } from "../buttons/deleteLTButton";
import { readyLTButton } from "../buttons/readyLTButton";
import { unreadyLTButton } from "../buttons/unreadyLTButtons";
import { moveNextLTButton } from "../buttons/moveNextLTButton";
import { MoveToFrontLTButton } from "../buttons/moveToFrontLTButton";


export const editLTsStringSelectMenu: StringSelectMenu = {
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
        const ltId = interaction.values[0];
        console.log('Selected LT', ltId);

        const { lt, error } = await getLTById(parseInt(ltId));
        if (error || !lt) {
            console.error('Failed to get LT by ID', error);
            return;
        }

        const ltInfoString = `タイトル: ${lt.title}\n状態: ${lt.state === "READY" ? "準備中" : "発表可能"}\n説明: ${lt.description}`;

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(deleteLTButton.create(lt.id.toString()))
            .addComponents(lt.state === "UNREADY" ? unreadyLTButton.create(lt.id.toString()) : readyLTButton.create(lt.id.toString()))
            .addComponents(MoveToFrontLTButton.create(lt.id.toString()))

        await interaction.editReply({
            content: ltInfoString,
            components: [row],
        });

    }
}