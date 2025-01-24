import { Prisma, PrismaClient, State, type LightningTalk } from "@prisma/client";

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
        const { lt } = await getLTById(id);
        if (lt === null) {
            console.error('LT not found');
            return { lt: null, error: 'LT not found' };
        }
        // validation
        // DOING, DONEのLTは削除できない
        if (lt.state === 'DOING' || lt.state === 'DONE') {
            console.error('Cannot delete LT in DOING or DONE state');
            return { lt: null, error: 'Cannot delete LT in DOING or DONE state' };
        }

        await prisma.lightningTalk.delete({
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


export const updateLTStateById = async (id: number, state: State): Promise<{ lt: LightningTalk | null, error: any }> => {
    console.log('start updateStateById');

    const { lt: targetLT, error } = await getLTById(id);

    if (error || !targetLT) {
        console.error('get error', error);
        return { lt: null, error };
    }

    if (targetLT.state === state) {
        console.error('currentState and newState are the same');
        return { lt: targetLT, error: 'currentState and newState are the same' };
    }

    /**
     * 以下の変更のみ許容する
     * - UNREADY <-> READY
     * - READY -> DOING
     * - DOING -> DONE
    */
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

export const getNextReadyLTs = async (limit: number): Promise<{ lts: LightningTalk[] | null, error: any }> => {
    console.log('start getNextLTsList');

    const prisma = new PrismaClient();

    try {
        const sortedReadyLTs: LightningTalk[] = await prisma.$queryRaw`
        SELECT lt.*
        FROM "lightning_talks" lt
        INNER JOIN (
            -- 各speakerのREADYなLTの中で最も古いものを取得
            SELECT speaker, MIN("updated_at") as min_updated_at
            FROM "lightning_talks"
            WHERE state = 'READY'
            GROUP BY speaker
        ) sub ON lt.speaker = sub.speaker AND lt."updated_at" = sub.min_updated_at
        ORDER BY (
            -- 発表済みのLTの数が少ない順に並べる
            SELECT COUNT(*)
            FROM "lightning_talks" lt2
            WHERE lt2.speaker = lt.speaker AND lt2.state = 'DONE'
        ) ASC
        LIMIT ${limit}
    `;
        console.log('getNextLTsList', sortedReadyLTs);

        return { lts: sortedReadyLTs, error: null };

    } catch (error: any) {
        console.error('Failed to getNextLTsList', error);
        return { lts: null, error };

    } finally {
        await prisma.$disconnect();
        console.log('end getNextLTsList');
    }
}
