import type { ButtonBuilder, ButtonInteraction } from "discord.js";

/**
 * Discordボタンコンポーネントの型定義
 * ボタンの作成、識別、クリック処理を標準化するためのインターフェース
 */
export type Button = {
    /**
     * ボタンを作成する関数
     * @param {...any} args - ボタン作成に必要な任意の引数
     * @returns {ButtonBuilder} 作成されたボタンインスタンス
     */
    create: (...args: any[]) => ButtonBuilder;
    
    /**
     * インタラクションがこのボタンかどうかを判定する
     * @param {ButtonInteraction} Interaction - 判定対象のインタラクション
     * @returns {boolean} このボタンのインタラクションならtrue
     */
    isThisButton: (Interaction: ButtonInteraction) => boolean;
    
    /**
     * ボタンクリック時の処理
     * @param {ButtonInteraction} interaction - クリックされたボタンのインタラクション
     * @returns {Promise<void>} 処理が完了するPromise
     */
    onClick: (interaction: ButtonInteraction) => Promise<void>;
};
