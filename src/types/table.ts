import type { NextLightningTalk } from "@prisma/client";

export type NextLightningTalkWithDetails = NextLightningTalk & {
    lightningTalk: {
        title: string;
        speaker: string;
        description: string;
    };
};