/**
 * Discordのインタラクション作成イベントを処理するハンドラー
 * コマンド、ボタンクリック、セレクトメニュー選択などのインタラクションを処理する
 */

import { MessageFlags, type Interaction } from "discord.js";
import commands from "../commands";
import buttons from "../buttons";
import stringSelectMenus from "../stringSelectMenus";

/**
 * インタラクション作成時のイベントハンドラー
 * @param interaction - Discord.jsのインタラクションオブジェクト
 * @returns 戻り値なしのPromise
 */
export const interactionCreateHandler = async (interaction: Interaction) => {
    console.log('interactionCreateHandler start');

    // コマンドインタラクションの処理
    if (interaction.isCommand()) {
        const command = commands.find(command => command.isThisCommand(interaction));

        if (command) {
            try {
                // コマンドを実行
                await command.execute(interaction);
            } catch (error) {
                console.error('Failed to execute command', error);
                await interaction.editReply({ content: 'Failed to execute command.' });
            }
        } else {
            await interaction.reply({ content: 'Unknown command.', flags: MessageFlags.Ephemeral });
        }
    } 
    // ボタンインタラクションの処理
    else if (interaction.isButton()) {
        const button = buttons.find(button => button.isThisButton(interaction));

        if (button) {
            try {
                // ボタンクリック処理を実行
                await button.onClick(interaction);
            } catch (error) {
                console.error('Failed to execute button', error);
                await interaction.editReply({ content: interaction.message.content + '\nFailed to execute button.' });
            }
        } else {
            await interaction.editReply({ content: interaction.message.content + '\nUnknown button.' });
        }
    } 
    // 文字列選択メニューインタラクションの処理
    else if (interaction.isStringSelectMenu()) {
        console.log(stringSelectMenus);
        const stringSelectMenu = stringSelectMenus.find(selectMenu => selectMenu.isThisSelectMenu(interaction));

        if (stringSelectMenu) {
            try {
                // 選択メニューの処理を実行
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });
                await stringSelectMenu.onSelect(interaction);
            } catch (error) {
                console.error('Failed to execute select menu', error);
                await interaction.editReply({ content: interaction.message.content + '\nFailed to execute select menu.' });
            }
        } else {
            await interaction.reply({ content: interaction.message.content + '\nUnknown select menu.' });
        }
    }

    console.log('interactionCreateHandler end');
}
