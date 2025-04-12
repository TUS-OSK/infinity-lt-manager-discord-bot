import type { CommandInteraction, SharedSlashCommand } from "discord.js";

/**
 * Discordスラッシュコマンドの型定義
 * コマンドの定義、識別、実行処理を標準化するためのインターフェース
 */
export type Command = {
    /**
     * コマンドの定義情報
     * @type {SharedSlashCommand}
     */
    data: SharedSlashCommand;
    
    /**
     * インタラクションがこのコマンドかどうかを判定する
     * @param {CommandInteraction} interaction - 判定対象のインタラクション
     * @returns {boolean} このコマンドのインタラクションならtrue
     */
    isThisCommand: (interaction: CommandInteraction) => boolean;
    
    /**
     * コマンド実行時の処理
     * @param {CommandInteraction} interaction - 実行されたコマンドのインタラクション
     * @returns {Promise<void>} 処理が完了するPromise
     */
    execute: (interaction: CommandInteraction) => Promise<void>;
}
