import { CommandInteraction } from "discord.js";
import { insertLT } from "../tables/lightningTalkTable";

export const registerLTByCommand = async (interaction: CommandInteraction) => {
    console.log('registerLTByCommand start');

    const title = interaction.options.get('title')?.value;
    const ready = interaction.options.get('ready')?.value;
    if (!title || !ready) {
        console.log('title or ready is empty');
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
        console.log('error', error);
        await interaction.editReply({
            content: 'Failed to register LT',
        });
        return;
    } else {
        await interaction.editReply({
            content: 'Successfully registered LT\n title: ' + lt.title + '\n state: ' + lt.state + '\n description: ' + lt.description,
        });
    }

    console.log('registerLTByCommand end');
}