import { ButtonBuilder, ButtonStyle } from "discord.js";
import type { Button } from "../types";
import { getMaxPriorityLT, updatePriority } from "../tables/lightningTalkTable";

export const MoveToFrontLTButton: Button = {
    create: (ltId: string) => {
        return new ButtonBuilder()
            .setCustomId(`priority-lt-${ltId}`)
            .setLabel('このLTを先頭に移動')
            .setStyle(ButtonStyle.Secondary)
    },
    isThisButton: (interaction) => {
        return interaction.customId.startsWith('priority-lt-');
    },
    onClick: async (interaction) => {
        await interaction.deferUpdate();
        const ltId = interaction.customId.split('-')[2];
        if (!ltId || isNaN(parseInt(ltId))) {
            console.error('ltId is empty');
            await interaction.editReply({ content: interaction.message.content + '\nFailed to change priority due to parsing error' });
            return;
        }

        const maxPriority = await getMaxPriorityLT(interaction.user.id);
        const { lt, error } = await updatePriority(parseInt(ltId), maxPriority + 1);

        if (error || !lt) {
            console.error('Failed to change priority', error);
            await interaction.editReply({ content: interaction.message.content + '\nFailed to change priority' });
            return;
        }
        await interaction.editReply({ content: interaction.message.content + '\nLTの優先度を変更し、先頭に移動しました' });
    }
}
