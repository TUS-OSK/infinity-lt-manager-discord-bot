import type { AnySelectMenuInteraction, APISelectMenuComponent, BaseSelectMenuBuilder } from "discord.js";

export type SelectMenu = {
    create: (...args: any[]) => BaseSelectMenuBuilder<APISelectMenuComponent>;
    isThisSelectMenu: (Interaction: AnySelectMenuInteraction) => boolean;
    onSelect: (interaction: AnySelectMenuInteraction) => Promise<void>;
};
