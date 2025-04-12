import { ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, type RestOrArray } from "discord.js";
import type { StringSelectMenu } from "../types";
import { getLTById, getLTsBySpeaker } from "../tables/lightningTalkTable";
import { deleteLTButton } from "../buttons/deleteLTButton";
import { readyLTButton } from "../buttons/readyLTButton";
import { unreadyLTButton } from "../buttons/unreadyLTButtons";
import { MoveToFrontLTButton } from "../buttons/moveToFrontLTButton";

/**
 * LT(Lightning Talk)編集用の文字列選択メニュー
 * ユーザーが所有するLTの一覧を表示し、選択されたLTの情報と操作ボタンを表示する
 */
export const editLTsStringSelectMenu: StringSelectMenu = {
    /**
     * ユーザーのLT一覧を表示する選択メニューを作成
     * @param discordUserId - LTを取得するDiscordユーザーID
     * @returns 作成されたStringSelectMenuBuilderインスタンス、またはエラー時はnull
     */
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

        console.log('LTs', lts);

        return new StringSelectMenuBuilder()
            .setCustomId(`my-lts-${discordUserId}`)
            .setPlaceholder('発表順に並んでいます')
            .addOptions(
                lts.map(lt => {
                    return new StringSelectMenuOptionBuilder()
                        .setLabel(`「${lt.title}」 (${lt.state === "UNREADY" ? "準備中" : "発表可能"}): 優先度${lt.priority}`)
                        .setValue(lt.id.toString())
                })
            );
    },

    /**
     * インタラクションがこの選択メニューかどうかを判定
     * @param interaction - 判定するインタラクション
     * @returns このメニューのインタラクションならtrue
     */
    isThisSelectMenu: (interaction) => {
        console.log('isThisSelectMenu', interaction.customId);
        return interaction.customId.startsWith('my-lts-');
    },

    /**
     * 選択メニューが選択された時の処理
     * 選択されたLTの詳細情報を表示し、操作ボタン(削除、準備状態変更、最前面移動)を表示
     * @param interaction - 選択メニューのインタラクション
     */
    onSelect: async (interaction) => {
        const ltId = interaction.values[0];
        console.log('Selected LT', ltId);

        const { lt, error } = await getLTById(parseInt(ltId));
        if (error || !lt) {
            console.error('Failed to get LT by ID', error);
            return;
        }

        const ltInfoString = `タイトル: ${lt.title}\n状態: ${lt.state === "UNREADY" ? "準備中" : "発表可能"}\n説明: ${lt.description}`;

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(deleteLTButton.create(lt.id.toString()))
            .addComponents(lt.state === "UNREADY" ? readyLTButton.create(lt.id.toString()) : unreadyLTButton.create(lt.id.toString()))
            .addComponents(MoveToFrontLTButton.create(lt.id.toString()))

        await interaction.editReply({
            content: ltInfoString,
            components: [row],
        });

    }
}
