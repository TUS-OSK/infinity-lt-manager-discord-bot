import type { ButtonComponent, ButtonInteraction } from "discord.js";

export type Button = {
    create: (...args: any[]) => ButtonComponent;
    isThisButton: (Interaction: ButtonInteraction) => boolean;
    onClick: (interaction: ButtonInteraction) => Promise<void>;
};
