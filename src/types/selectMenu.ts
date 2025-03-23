import type { StringSelectMenuInteraction, StringSelectMenuBuilder } from "discord.js";

export type StringSelectMenu = {
    create: (...args: any[]) => StringSelectMenuBuilder;
    isThisSelectMenu: (Interaction: StringSelectMenuInteraction) => boolean;
    onSelect: (interaction: StringSelectMenuInteraction) => Promise<void>;
};
