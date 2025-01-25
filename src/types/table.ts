import type { NextLightningTalk } from "@prisma/client";

export type NextLightningTalkWithDetails = NextLightningTalk & {
    lightningTalk: {
        id: number;
        title: string;
        speaker: string;
        description: string;
    };
};