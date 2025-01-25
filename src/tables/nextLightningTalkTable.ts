import { type NextLightningTalk, PrismaClient } from "@prisma/client";


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

