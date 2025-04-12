import type { StringSelectMenuInteraction, StringSelectMenuBuilder } from "discord.js";

/**
 * Discord文字列選択メニューの型定義
 * 選択メニューの作成、識別、選択処理を標準化するためのインターフェース
 */
export type StringSelectMenu = {
    /**
     * 選択メニューを作成する関数
     * @param {...any} args - メニュー作成に必要な任意の引数
     * @returns {StringSelectMenuBuilder | Promise<StringSelectMenuBuilder | null>} 作成されたメニューインスタンス
     */
    create: (...args: any[]) => StringSelectMenuBuilder | Promise<StringSelectMenuBuilder | null>;
    
    /**
     * インタラクションがこの選択メニューかどうかを判定する
     * @param {StringSelectMenuInteraction} Interaction - 判定対象のインタラクション
     * @returns {boolean} このメニューのインタラクションならtrue
     */
    isThisSelectMenu: (Interaction: StringSelectMenuInteraction) => boolean;
    
    /**
     * メニュー項目選択時の処理
     * @param {StringSelectMenuInteraction} interaction - 選択されたメニューのインタラクション
     * @returns {Promise<void>} 処理が完了するPromise
     */
    onSelect: (interaction: StringSelectMenuInteraction) => Promise<void>;
};
