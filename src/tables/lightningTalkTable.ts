import { PrismaClient, type LightningTalk } from "@prisma/client";

export const insertLT = async (title: string, speaker: string, ready: boolean, description?: string): Promise<{ lt: LightningTalk | null, error: any }> => {
    console.log('start insertLT');

    const state = ready ? 'READY' : 'UNREADY';
    const prisma = new PrismaClient();

    try {
        const lt: LightningTalk = await prisma.lightningTalk.create({
            data: {
                title,
                speaker,
                state,
                description
            }
        });
        console.log('insertLT', lt);

        return { lt, error: null };
    } catch (error: any) {
        console.error('Failed to insertLT', error);
        return { lt: null, error };
    } finally {
        await prisma.$disconnect();
        console.log('end insertLT');
    }
}

