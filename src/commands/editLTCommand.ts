/**
 * LT編集コマンド
 * ユーザーが自分のLTを編集するためのスラッシュコマンドを提供する
 */
import { ActionRowBuilder, MessageFlags, StringSelectMenuBuilder } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import type { Command } from '../types';
import { editLTsStringSelectMenu } from '../stringSelectMenus/editLTsStringSelectMenu';


/**
 * LT編集コマンドの実装
 * ユーザーが登録したLTを選択して編集する
 */
export const editLTCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('edit-lt')
        .setDescription('自分のLTを編集します。'),

    isThisCommand: function (interaction) {
        return interaction.commandName === this.data.name;
    },

    /**
     * コマンド実行処理
     * @param interaction - コマンドインタラクション
     * @returns Promise<void>
     * @throws ユーザーに登録されたLTがない場合はエラーメッセージを返す
     */
    execute: async function (interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const select = await editLTsStringSelectMenu.create(interaction.user.id);
        if (!select) {
            await interaction.editReply('あなたのLTが存在しません');
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
