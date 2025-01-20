import type { ButtonBuilder, ButtonInteraction } from "discord.js";

export type Button = {
    create: (...args: any[]) => ButtonBuilder
    isThisButton: (Interaction: ButtonInteraction) => boolean;
    onClick: (interaction: ButtonInteraction) => Promise<void>;
};
