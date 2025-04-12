/**
 * Discordアプリケーションコマンドを登録するスクリプト
 * 指定されたギルド(サーバー)にスラッシュコマンドを登録する
 */
import { REST, Routes } from "discord.js";
// src/commandsから全てのコマンド定義をインポート
import commands from "../src/commands";

// 環境変数から必要な設定値を取得
const { 
    DISCORD_BOT_TOKEN, // Discordボットのトークン
    GUILD_ID,         // コマンドを登録するギルド(サーバー)ID
    CLIENT_ID        // DiscordアプリケーションのクライアントID
} = process.env;

// Discord REST APIクライアントを初期化
const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);

// 登録するコマンド名をログ出力
console.log(`アプリケーションコマンド(/)の登録を開始: ${commands.map(cmd => cmd.data.name).join(', ')}`);

// コマンドデータを準備
const commandData = commands.map(cmd => cmd.data);

try {
    // ギルドコマンドを登録
    await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), 
        { body: commandData }
    );
    console.log(`コマンド登録完了: ${commandData.map(cmd => cmd.name).join(', ')}`);
} catch (error) {
    console.error(`コマンド登録に失敗しました: ${error}`);
}

console.log('アプリケーションコマンド(/)の登録処理が完了しました');
