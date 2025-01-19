import type { Client, TextChannel } from "discord.js";
import type { LightningTalk } from "@prisma/client";

const { NOTIFICATION_CHANNEL_ID } = process.env;


export const notifyLTRegistration = async (client: Client, lt: LightningTalk) => {
    console.log('start announceRegisterLT');

    const channel = client.channels.cache.get(NOTIFICATION_CHANNEL_ID) as TextChannel;
    console.log('channel', channel.name);

    await channel?.send(`🎉 ${lt.title} が登録されました！`);

    console.log('end announceRegisterLT');
}

