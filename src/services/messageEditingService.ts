/**
 * メッセージ編集サービス
 * Discordメッセージの編集やフォーマット変更などの機能を提供する
 */
import type { Client, Message, TextChannel } from "discord.js";

const { NOTIFICATION_CHANNEL_ID } = process.env;


/**
 * メッセージIDからメッセージを取得する
 * @param client - Discordクライアントインスタンス
 * @param messageId - 取得するメッセージのID
 * @param textChannelId - メッセージが存在するテキストチャンネルID
 * @returns Promise<Message> 取得したメッセージ
 * @throws チャンネルが見つからない場合にエラーをスロー
 */
const fetchMessageById = async (client: Client, messageId: string, textChannelId: string = NOTIFICATION_CHANNEL_ID) => {
    const channel = client.channels.cache.get(textChannelId) as TextChannel;
    if (!channel) {
        throw new Error('Channel not found');
    }
    return await channel.messages.fetch(messageId);
};


type additionalMessageContent = {
    header?: string,
    footer?: string,
}

/**
 * 指定されたメッセージの内容を取り消し線で囲み、オプションで追加のメッセージコンテンツを含めて編集します。
 *
 * @param client - メッセージを取得および編集するためのクライアントオブジェクト。
 * @param messageId - 編集するメッセージのID。
 * @param additionalMessageContent - オプションの追加メッセージコンテンツ（ヘッダーとフッター）。
 * @param textChannelId - メッセージが存在するテキストチャンネルのID。デフォルトは `NOTIFICATION_CHANNEL_ID`。
 * @returns プロミスを返し、メッセージの編集が完了したら解決します。
 */
export const strikethroughTextMessage = async (client: Client, messageId: string, additionalMessageContent?: additionalMessageContent, textChannelId: string = NOTIFICATION_CHANNEL_ID) => {
    console.log('start strikethroughTextMessage');

    await fetchMessageById(client, messageId, textChannelId).then(async (message: Message) => {
        console.log('message', message.content);
        const newContent = [
            additionalMessageContent?.header,
            ...message.content.split('\n').map((line) => `~~${line}~~`),
            additionalMessageContent?.footer,
        ].join('\n');
        await message.edit(newContent);
        console.log('end strikethroughTextMessage');
    }).catch((error) => {
        console.error('error in strikethroughTextMessage', error);
    });
};
