import { CommandInteraction, roleMention, userMention, type Client, type TextChannel } from "discord.js";
import type { LightningTalk } from "@prisma/client";
import { insertNotificationMessage } from "../tables/notificationMessageTable";
import { getNextReadyLTs } from "../tables/lightningTalkTable";

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


export const notifyNextLTsByCommand = async (interaction: CommandInteraction) => {
    console.log('start notifyNextLTs');

    const limitOption = interaction.options.get('limit');
    const limit = limitOption ? limitOption.value as number : 10;

    const {lts, error} = await getNextReadyLTs(limit);

    if (error || !lts) {
        console.error('Failed to get LTs', error);
        await interaction.editReply({ content: 'Failed to get LTs' });
        return;
    }

    if (lts.length === 0) {
        console.error('No LTs');
        await interaction.editReply({ content: 'No LTs' });
        return;
    }

    const notificationMessageContent = [
        `${roleMention(ROLE_ID)}`,
        `次回のLTは以下の通りです！`,
        ...lts.map((lt) => `「${lt.title}」 発表者：${userMention(lt.speaker)}`),
    ].join('\n');


    const channel = interaction.client.channels.cache.get(NOTIFICATION_CHANNEL_ID) as TextChannel;
    console.log('channel', channel.name);

    const sendMessage = await channel?.send(notificationMessageContent);
    console.log('sendMessage', sendMessage.content);

    await interaction.editReply({ content: '通知しました！' });
    console.log('end notifyNextLTs');
}

