import { ActionRowBuilder, ButtonBuilder, CommandInteraction, roleMention, userMention, type Client, type TextChannel } from "discord.js";
import type { LightningTalk } from "@prisma/client";
import { insertNotificationMessage } from "../tables/notificationMessageTable";
import { getNextReadyLTs, updateLTStateById } from "../tables/lightningTalkTable";
import { deleteAllNextLTs, getAllDoneNextLTs, getNextLT, insertNextLTs, updateDoneNextLT } from "../tables/nextLightningTalkTable";
import { moveNextLTButton } from "../buttons/moveNextLTButton";

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

export const notifyNextLTsByCommand = async (interaction: CommandInteraction) => {
    console.log('start notifyNextLTs');

    const limitOption = interaction.options.get('limit');
    const limit = limitOption ? limitOption.value as number : 10;

    const { lts, error } = await getNextReadyLTs(limit);

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

export const startLTsByCommand = async (interaction: CommandInteraction) => {
    console.log('start startLTsByCommand');

    const limit = interaction.options.get('limit')?.value as number || 10
    const { lts, error: getNextLtsError } = await getNextReadyLTs(limit);

    if (getNextLtsError || !lts) {
        console.error('Failed to get LTs', getNextLtsError);
        await interaction.editReply({ content: 'Failed to get LTs' });
        return;
    }

    if (lts.length === 0) {
        console.error('No LTs');
        await interaction.editReply({ content: 'No LTs' });
        return;
    }

    const { nextLTs, error: insertNextLTsError } = await insertNextLTs(lts.map((lt) => lt.id));

    if (insertNextLTsError || !nextLTs) {
        console.error('Failed to insert next LTs', insertNextLTsError);
        await interaction.editReply({ content: 'Failed to start LT' });
        return;
    }

    lts.map(async (lt) => {
        const { lt: tmpLT, error } = await updateLTStateById(lt.id, 'DOING');
        if (error || !tmpLT) {
            console.error('Failed to update LT', error);
            await interaction.editReply({ content: 'Failed to start LT' });
            return;
        }
    });

    const notificationMessageContent = [
        `${roleMention(ROLE_ID)}`,
        `以下のLTセッションを開始します！`,
        ...lts.map((lt) => `「${lt.title}」 発表者：${userMention(lt.speaker)}`),
    ].join('\n');

    const channel = interaction.client.channels.cache.get(NOTIFICATION_CHANNEL_ID) as TextChannel;
    console.log('channel', channel.name);

    const sendMessage = await channel?.send(notificationMessageContent);
    console.log('sendMessage', sendMessage.content);

    await moveNextLT(interaction.client, true);

    await interaction.editReply({ content: 'LTを開始しました！' });
    console.log('end startLTsByCommand');
}

export const moveNextLT = async (client: Client, isFirst: boolean = false) => {
    console.log('start moveNextLT');

    if (!isFirst) {
        const { nextLT: doneLT, error } = await getNextLT();

        if (error || !doneLT) {
            console.error('Failed to get next LT', error);
            return;
        }

        const { lt: currentLT, error: updateCurrentLTError } = await updateLTStateById(doneLT.lightningTalk.id, 'DONE');

        if (updateCurrentLTError || !currentLT) {
            console.error('Failed to update current LT', updateCurrentLTError);
            return;
        }

        const { error: nextDoneLTError } = await updateDoneNextLT(doneLT.id);

        if (nextDoneLTError) {
            console.error('Failed to be done next LT', nextDoneLTError);
            return;
        }
    }

    const { nextLT, error: getNextLTError } = await getNextLT();

    if (getNextLTError) {
        console.error('Failed to get next LT', getNextLTError);
        return;
    }

    const channel = client.channels.cache.get(NOTIFICATION_CHANNEL_ID) as TextChannel;
    console.log('channel', channel.name);

    const notificationMessageContent =
        nextLT ?
            [
                `${roleMention(ROLE_ID)}`,
                `次のLTは以下の通りです！`,
                `「${nextLT.lightningTalk.title}」 発表者：${userMention(nextLT.lightningTalk.speaker)}`,
                nextLT.lightningTalk.description ? `概要：${nextLT.lightningTalk.description}` : '',
            ].filter(Boolean).join('\n')
            :
            `${roleMention(ROLE_ID)}\nこのセッションにおける全てのLTが終了しました！\n投票をお願いします！`;

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(moveNextLTButton.create())

    const sendMessage = await channel?.send({ content: notificationMessageContent, components: nextLT ? [row] : [] });
    console.log('sendMessage', sendMessage.content);

    if (!nextLT) {
        const { nextLTs, error } = await getAllDoneNextLTs();
        if (error || !nextLTs) {
            console.error('Failed to get all done next LTs', error);
            return;
        }
        nextLTs.map(async (nextLT) => {
            const message = await channel?.send(
                `「${nextLT.lightningTalk.title}」 発表者：${userMention(nextLT.lightningTalk.speaker)}`
            )
            await message.react('🥇');
            await message.react('🥈');
        }
        );

        await deleteAllNextLTs();
    }

    console.log('end moveNextLT');
}

