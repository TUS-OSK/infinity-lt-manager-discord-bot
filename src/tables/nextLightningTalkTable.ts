import { type NextLightningTalk, PrismaClient } from "@prisma/client";


export const insertNextLTs = async (lightningTalkIds: number[]): Promise<{ nextLTs: NextLightningTalk[] | null, error: any }> => {

    console.log('start insertNextLTs');

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


export const getAllNextLTs = async (): Promise<{ nextLTs: NextLightningTalk[] | null, error: any }> => {
    console.log('start getAllNextLTs');

    const prisma = new PrismaClient();

    try {
        const nextLTs: NextLightningTalk[] = await prisma.nextLightningTalk.findMany();
        console.log('getAllNextLTs', nextLTs);

        return { nextLTs, error: null };
    } catch (error: any) {
        console.error('Failed to getAllNextLTs', error);
        return { nextLTs: null, error };
    } finally {
        await prisma.$disconnect();
        console.log('end getAllNextLTs');
    }
}
