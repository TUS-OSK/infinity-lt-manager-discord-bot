import { roleMention, userMention, type Client, type TextChannel } from "discord.js";
import type { LightningTalk } from "@prisma/client";
import { deleteNotificationMessage, insertNotificationMessage } from "../tables/notificationMessageTable";
import { map } from "zod";

const { NOTIFICATION_CHANNEL_ID, ROLE_ID } = process.env;


export const notifyLTRegistration = async (client: Client, lt: LightningTalk) => {
    console.log('start announceRegisterLT');

    const channel = client.channels.cache.get(NOTIFICATION_CHANNEL_ID) as TextChannel;
    console.log('channel', channel.name);

    const notificationMessage = [
        `${roleMention(ROLE_ID)}`,
        `「${lt.title}」 が登録されました:tada: :tada:`,
        `登壇者：${userMention(lt.speaker)}`,
    ]

    if (lt.description) {
        notificationMessage.push(`概要：${lt.description}`);
    }

    const sendMessage = await channel?.send(notificationMessage.join('\n'));
    insertNotificationMessage(lt.id, sendMessage.id);

    console.log('end announceRegisterLT');
}

/* 完全に削除するのではなく、罫線を引いて削除したことを示す */
export const deleteNotificationMessageById = async (client: Client, messageId:string) => {
    console.log('start deleteNotificationMessageById');

    const channel = client.channels.cache.get(NOTIFICATION_CHANNEL_ID) as TextChannel;
    const message = await channel.messages.fetch(messageId);
    console.log('message', message.content);

    await message.edit('このLTは削除されました\n' + message.content.split('\n').map((line) => '~~' + line + '~~').join('\n'));

    console.log('end deleteNotificationMessageById');
}
