import { type NextLightningTalk, PrismaClient } from "@prisma/client";
import type { NextLightningTalkWithDetails } from "../types";


export const insertNextLTs = async (lightningTalkIds: number[]): Promise<{ nextLTs: NextLightningTalk[] | null, error: any }> => {
    console.log('start insertNextLTs');

    await deleteAllNextLTs();
    const prisma = new PrismaClient();

    try {
        const nextLTs: NextLightningTalk[] = await Promise.all(lightningTalkIds.map(async (lightningTalkId) => {
            const nextLT = await prisma.nextLightningTalk.create({
                data: {
                    lightningTalkId
                }
            });
            return nextLT;
        }));
        console.log('insertNextLTs', nextLTs);

        return { nextLTs, error: null };
    } catch (error: any) {
        console.error('Failed to insertNextLTs', error);
        return { nextLTs: null, error };
    } finally {
        await prisma.$disconnect();
        console.log('end insertNextLTs');
    }
}

const deleteAllNextLTs = async (): Promise<{ count: number | null, error: any }> => {
    console.log('start deleteAllNextLTs');

    const prisma = new PrismaClient();

    try {
        const result = await prisma.nextLightningTalk.deleteMany();
        console.log('deleteAllNextLTs', result);

        return { count: result.count, error: null };
    } catch (error: any) {
        console.error('Failed to deleteAllNextLTs', error);
        return { count: null, error };
    } finally {
        await prisma.$disconnect();
        console.log('end deleteAllNextLTs');
    }
}

export const getNextLT = async (): Promise<{ nextLT: NextLightningTalkWithDetails | null, error: any }> => {
    console.log('start getNextLT');

    const prisma = new PrismaClient();

    try {
        const nextLT: NextLightningTalkWithDetails | null = await prisma.nextLightningTalk.findFirst({
            include: {
                lightningTalk: {
                    select: {
                        title: true,
                        speaker: true,
                        description: true
                    }
                }
            }
        });
        if (!nextLT) {
            console.log('No next lightning talk found');
            return { nextLT: null, error: 'No next lightning talk found' };
        }
        console.log('getNextLT', nextLT);

        return { nextLT, error: null };
    } catch (error: any) {
        console.error('Failed to getNextLT', error);
        return { nextLT: null, error };
    } finally {
        await prisma.$disconnect();
        console.log('end getNextLT');
    }
}

export const deleteNextLT = async (nextLTId: number): Promise<{ nextLT: NextLightningTalk | null, error: any }> => {
    console.log('start deleteNextLT');

    const prisma = new PrismaClient();

    try {
        const nextLT: NextLightningTalk = await prisma.nextLightningTalk.delete({
            where: {
                id: nextLTId
            }
        });
        console.log('deleteNextLT', nextLT);

        return { nextLT, error: null };
    } catch (error: any) {
        console.error('Failed to deleteNextLT', error);
        return { nextLT: null, error };
    } finally {
        await prisma.$disconnect();
        console.log('end deleteNextLT');
    }
}
