/**
 * Lightning Talk(LT)関連のボタンコンポーネントをエクスポートするモジュール
 * 
 * このファイルは以下のボタンコンポーネントを集約してエクスポートします:
 * - LT削除ボタン
 * - LT準備完了/準備中ボタン
 * - LT移動関連ボタン
 */
import type { Button } from '../types';
import { deleteLTButton } from './deleteLTButton';
import { moveNextLTButton } from './moveNextLTButton';
import { readyLTButton } from './readyLTButton';
import { unreadyLTButton } from './unreadyLTButtons';
import { MoveToFrontLTButton } from './moveToFrontLTButton';

/**
 * 全てのLT関連ボタンコンポーネントの配列
 * 
 * この配列に追加されたボタンはアプリケーション全体で利用可能になります
 */
const buttons: Button[] = [
    deleteLTButton,
    readyLTButton,
    unreadyLTButton,
    moveNextLTButton,
    MoveToFrontLTButton
];

export default buttons;
