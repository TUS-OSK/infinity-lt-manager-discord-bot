import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, CommandInteraction } from "discord.js";
import { deleteLTById, insertLT, updateLTStateById } from "../tables/lightningTalkTable";
import { deleteNotificationMessageById, notifyLTRegistration } from "./LTNotificationService";
import { deleteLTButton } from "../buttons/deleteLTButton";
import { deleteNotificationMessage } from "../tables/notificationMessageTable";
import { readyLTButton } from "../buttons/readyLTButton";
import { unreadyLTButton } from "../buttons/unreadyLTButtons";

export const registerLTByCommand = async (interaction: CommandInteraction) => {
    console.log('registerLTByCommand start');

    const title = interaction.options.get('title')?.value;
    const ready = interaction.options.get('ready')?.value;
    if (title === undefined || ready === undefined) {
        console.error('title or ready is empty\n title: ' + title + ', ready: ' + ready);
        await interaction.editReply({ content: 'Failed to register LT' });
        return;
    }

    const description = interaction.options.get('description')?.value || '';

    const { lt, error } = await insertLT(
        title as string,
        interaction.user.id,
        ready as boolean,
        description as string
    )

    if (error || !lt) {
        console.error('insert error', error);
        await interaction.editReply({ content: 'Failed to register LT' });
        return;
    } else {
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(deleteLTButton.create(lt.id.toString()))
            .addComponents(ready ? unreadyLTButton.create(lt.id.toString()) : readyLTButton.create(lt.id.toString()));

        await interaction.editReply({
            content: `以下のLTを登録しました！\n 「${lt.title}」（${(ready ? '発表可能' : '準備中')}）${lt.description && "\n 概要: " + lt.description}`,
            components: [row],
        });
    }

    await notifyLTRegistration(interaction.client, lt);

    console.log('registerLTByCommand end');
}


export const deleteLTByButton = async (interaction: ButtonInteraction) => {
    console.log('deleteLTByButton start');

    // この時点でltIdは「delete-lt-<ltId>」の形式になっているかどうかを確認する
    if (!interaction.customId.startsWith('delete-lt-')) {
        console.error('ltId is empty');
        await interaction.editReply({ content: 'Failed to delete LT' });
        return;
    }

    const ltId = parseInt(interaction.customId.split('-')[2]);

    // 先に子要素である通知メッセージを削除し、message idを取得しておく
    const { notificationMessage } = await deleteNotificationMessage(ltId);

    const { lt, error: ltError } = await deleteLTById(ltId);
    if (ltError || !lt) {
        console.error('delete error', ltError);
        await interaction.editReply({ content: 'Failed to delete LT' });
        return;
    } else {
        const newContent = '削除済み\n' + interaction.message.content.split('\n').map((line) => '~~' + line + '~~').join('\n');
        console.log('newContent', newContent);
        await interaction.editReply({ content: newContent, components: [] });

        if (notificationMessage) {
            await deleteNotificationMessageById(interaction.client, notificationMessage.messageId);
        }
    }

    console.log('deleteLTByButton end');
}


export const switchLTReadyStateByButton = async (interaction: ButtonInteraction, isCurrentlyReady: boolean) => {
    console.log('switchReadyState start');

    const currentButton = isCurrentlyReady ? unreadyLTButton : readyLTButton;
    const newButton = isCurrentlyReady ? readyLTButton : unreadyLTButton;

    if (!currentButton.isThisButton(interaction)) {
        console.error('ltId is empty');
        await interaction.editReply({ content: 'Failed to switch ready state' });
        return;
    }

    const ltId = parseInt(interaction.customId.split('-')[2]);

    const { lt, error } = await updateLTStateById(ltId, isCurrentlyReady ? 'UNREADY' : 'READY');

    // ltが取得できている場合は変更が成功しているとみなす
    // => 変更が無かったときもltが取得できるため、成功扱いとする
    if (lt) {
        const newComponents = interaction.message.components.map((row) => {
            return new ActionRowBuilder<ButtonBuilder>().addComponents(
                row.components.map((component) => {
                    if (component.customId === interaction.customId) {
                        return newButton.create(lt.id.toString());
                    }
                    return component;
                }) as ButtonBuilder[]
            );
        });

        const newContent = interaction.message.content.replace(isCurrentlyReady ? '発表可能' : '準備中', isCurrentlyReady ? '準備中' : '発表可能');

        await interaction.editReply({ content: newContent, components: newComponents });
    } else {
        console.error('update error', error);
        await interaction.editReply({ content: 'Failed to switch ready state' });
    }
    console.log('switchReadyState end');
}
