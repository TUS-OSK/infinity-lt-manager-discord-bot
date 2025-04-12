import type { NextLightningTalk } from "@prisma/client";

/**
 * 次のライトニングトーク情報の拡張型定義
 * PrismaのNextLightningTalk型に詳細情報を追加した型
 */
export type NextLightningTalkWithDetails = NextLightningTalk & {
    /**
     * 関連するライトニングトークの詳細情報
     */
    lightningTalk: {
        id: number;
        title: string;
        speaker: string;
        description: string;
    };
};
