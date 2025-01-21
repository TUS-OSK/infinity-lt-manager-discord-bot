import { PrismaClient, State, type LightningTalk } from "@prisma/client";

export const insertLT = async (title: string, speaker: string, ready: boolean, description?: string): Promise<{ lt: LightningTalk | null, error: any }> => {
    console.log('start insertLT');

    const state: State = ready ? 'READY' : 'UNREADY';
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


export const deleteLTById = async (id: number): Promise<{ lt: LightningTalk | null, error: any }> => {
    console.log('start deleteLTById');

    const prisma = new PrismaClient();

    try {
        const lt: LightningTalk = await prisma.lightningTalk.delete({
            where: {
                id
            }
        });
        console.log('deleteLTById', lt);

        return { lt, error: null };
    } catch (error: any) {
        console.error('Failed to deleteLTById', error);
        return { lt: null, error };
    } finally {
        await prisma.$disconnect();
        console.log('end deleteLTById');
    }
}


export const getLTById = async (id: number): Promise<{ lt: LightningTalk | null, error: any }> => {
    console.log('start getLTById');

    const prisma = new PrismaClient();

    try {
        const lt = await prisma.lightningTalk.findUnique({
            where: {
                id
            }
        });
        console.log('getLTById', lt);
        if (!lt) {
            return { lt: null, error: 'LT not found' };
        }
        return { lt, error: null };
    } catch (error: any) {
        console.error('Failed to getLTById', error);
        return { lt: null, error };
    } finally {
        await prisma.$disconnect();
        console.log('end getLTById');
    }
}

/**
 * 以下の変更のみ許容する
 * - UNREADY <-> READY
 * - READY -> DOING
 * - DOING -> DONE
*/
export const updateLTStateById = async (id: number, state: State): Promise<{ lt: LightningTalk | null, error: any }> => {
    console.log('start updateStateById');

    const {lt: targetLT, error} = await getLTById(id);
    if (error || !targetLT) {
        console.error('get error', error);
        return { lt: null, error };
    }

    const validTransitions: Record<State, State[]> = {
        UNREADY: ['READY'],
        READY: ['UNREADY', 'DOING'],
        DOING: ['DONE'],
        DONE: []
    };

    if (!validTransitions[targetLT.state].includes(state)) {
        const error = `Invalid state transition from ${targetLT.state} to ${state}`;
        console.error(error);
        return { lt: null, error };
    }



    const prisma = new PrismaClient();

    try {
        const lt = await prisma.lightningTalk.update({
            where: {
                id
            },
            data: {
                state
            }
        });
        console.log('updateStateById', lt);
        return { lt, error: null };
    } catch (error: any) {
        console.error('Failed to updateStateById', error);
        return { lt: null, error };
    } finally {
        await prisma.$disconnect();
        console.log('end updateStateById');
    }
}
