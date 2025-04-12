/**
 * コマンドモジュールのエントリポイント
 * 全てのスラッシュコマンドを集約してエクスポートする
 */
import type { Command } from '../types';
import { notifyNextLTsCommand } from './notifyNextLTsCommand';
import { registerLTCommand } from './registerLTCommand';
import { startLTsCommand } from './startLTCommand';
import { editLTCommand } from './editLTCommand';

// 登録する全てのスラッシュコマンドの配列
const commands: Command[] = [
    registerLTCommand,
    notifyNextLTsCommand,
    startLTsCommand,
    editLTCommand,
];

export default commands;
