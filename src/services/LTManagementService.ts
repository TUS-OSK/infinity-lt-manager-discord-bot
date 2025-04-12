/**
 * LT（ライトニングトーク）管理サービス
 * LTの登録、削除、状態変更などのビジネスロジックを扱う
 */
import { ActionRowBuilder } from "discord.js";
import type { ButtonBuilder, ButtonInteraction, Client, BaseMessageOptions, Message } from "discord.js";
import { deleteLTById, insertLT, updateLTStateById } from "../tables/lightningTalkTable";
import { notifyLTRegistration } from "./LTNotificationService";
import { strikethroughTextMessage } from "./messageEditingService";
import { deleteLTButton } from "../buttons/deleteLTButton";
import { deleteNotificationMessage } from "../tables/notificationMessageTable";
import { readyLTButton } from "../buttons/readyLTButton";
import { unreadyLTButton } from "../buttons/unreadyLTButtons";


/**
 * LTを登録する関数
 * 
 * @param client - クライアントオブジェクト
 * @param title - LTのタイトル
 * @param ready - 発表準備ができているかどうかのフラグ
 * @param userId - ユーザーID
 * @param description - LTの説明（省略可能）
 * @returns 返信すべきメッセージオプションを含むPromise
 */
export const handleLTRegistration = async (client: Client, title: string, ready: boolean, userId: string, description: string = ''): Promise<BaseMessageOptions> => {
    console.log('registerLTByCommand start');

    const { lt, error } = await insertLT(
        title as string,
        userId as string,
        ready as boolean,
        description as string
    )

    if (error || !lt) {
        console.error('insert error', error);
        return { content: 'Failed to register LT' };
    }

    await notifyLTRegistration(client, lt);

    console.log('registerLTByCommand end');
    return {
        content: `以下のLTを登録しました！\n 「${lt.title}」（${(ready ? '発表可能' : '準備中')}）${lt.description && "\n 概要: " + lt.description}`,
    };
}

/**
 * LTを削除する関数
 * 
 * @param client - クライアントオブジェクト
 * @param ltId - 削除するLTのID
 * @param messageContent - 元のメッセージの内容
 * @returns 返信すべきメッセージオプションを含むPromise
 */

export const handleLTDeletion = async (client: Client, ltId: number, messageContent: string): Promise<BaseMessageOptions> => {
    console.log('deleteLTInteraction start');

    // 先に子要素である通知メッセージを削除し、message idを取得しておく
    const { notificationMessage } = await deleteNotificationMessage(ltId);

    const { lt, error: ltError } = await deleteLTById(ltId);
    if (ltError || !lt) {
        console.error('delete error', ltError);
        return { content: messageContent + '\nFailed to delete LT due to DB layer error' };
    }
    if (notificationMessage) {
        await strikethroughTextMessage(client, notificationMessage.messageId, { footer: '（削除済）' });
    }

    // [WHY] strikethroughTextMessageで編集してもよさそうだが、messageがephemeralであるためinteractionが必要
    const newContent = messageContent.split('\n').map((line) => '~~' + line + '~~').join('\n') + '\n（削除済）';
    console.log('newContent', newContent);
    console.log('deleteLTInteraction end');
    return ({ content: newContent, components: [] });
}

/**
 * LTの準備状態を切り替える関数
 * 
 * @param interaction - ボタンインタラクションオブジェクト
 * @param isCurrentlyReady - 現在の準備状態
 * @returns Promise<void>
 */
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
