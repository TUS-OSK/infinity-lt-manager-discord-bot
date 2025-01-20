import { CommandInteraction } from "discord.js";
import { insertLT } from "../tables/lightningTalkTable";
import { notifyLTRegistration } from "./LTNotificationService";

export const registerLTByCommand = async (interaction: CommandInteraction) => {
    console.log('registerLTByCommand start');

    const title = interaction.options.get('title')?.value;
    const ready = interaction.options.get('ready')?.value;
    if (title === undefined || ready === undefined) {
        console.error('title or ready is empty\n title: ' + title + ', ready: ' + ready);
        await interaction.editReply({
            content: 'Failed to register LT',
        });
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
        await interaction.editReply({
            content: 'Failed to register LT',
        });
        return;
    } else {
        await interaction.editReply({
            content: `以下のLTを登録しました！\n 「${lt.title}」（${(ready ? '発表可能' : '準備中')}）${lt.description && "\n 概要: "+lt.description}`,
        });
    }

    await notifyLTRegistration(interaction.client, lt);

    console.log('registerLTByCommand end');
}
