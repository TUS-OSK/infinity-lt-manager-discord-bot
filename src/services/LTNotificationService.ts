import { roleMention, userMention, type Client, type TextChannel } from "discord.js";
import type { LightningTalk } from "@prisma/client";
import { insertNotificationMessage } from "../tables/notificationMessageTable";

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

