import { PrismaClient, State, type LightningTalk } from "@prisma/client";

/**
 * Lightning Talkを挿入します。
 * 挿入可能なのはstateがREADYまたはUNREADYのLTのみであるため、booleanのreadyによってstateを設定します。
 * 
 * @param {string} title - Lightning Talkのタイトル
 * @param {string} speaker - スピーカーの名前
 * @param {boolean} ready - 準備ができているかどうか
 * @param {string} description - Lightning Talkの説明
 * @returns {Promise<{ lt: LightningTalk | null, error: any }>} 挿入されたLightning Talkとエラー情報を含むPromise
 */
export const insertLT = async (title: string, speaker: string, ready: boolean, description: string): Promise<{ lt: LightningTalk | null, error: any }> => {
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

/**
 * 指定されたIDのLightning Talkを削除します。
 * stateがDOINGまたはDONEのLTは削除できません。
 * 
 * @param {number} id - 削除するLightning TalkのID
 * @returns {Promise<{ lt: LightningTalk | null, error: any }>} 削除されたLightning Talkとエラー情報を含むPromise
 */
export const deleteLTById = async (id: number): Promise<{ lt: LightningTalk | null, error: any }> => {
    console.log('start deleteLTById');

    const prisma = new PrismaClient();

    try {
        const { lt, error: getError } = await getLTById(id);

        // [WHY] lt===nullのときgetErrorは必ず存在するはずだが、後の処理でtype errorが出るため、明示的にチェック
        if (getError || !lt) {
            return { lt: null, error: getError };
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

/**
 * 指定されたIDのLightning Talkを取得します。
 * 
 * @param {number} id - 取得するLightning TalkのID
 * @returns {Promise<{ lt: LightningTalk, error: null } | { lt: null, error: NonNullable<any> }>} 指定されたIDのLightning Talkとエラー情報を含むPromise
 */
export const getLTById = async (id: number): Promise<{ lt: LightningTalk, error: null } | { lt: null, error: NonNullable<any> }> => {
    console.log('start getLTById');

    const prisma = new PrismaClient();

    try {
        const lt = await prisma.lightningTalk.findUniqueOrThrow({
            where: {
                id
            }
        });
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
 * 指定されたIDのLightning Talkの状態を更新します。
 * 以下の状態遷移のみ許容します。
 * - UNREADY <-> READY
 * - READY -> DOING
 * - DOING -> DONE
 *  
 * @param {number} id - 更新するLightning TalkのID
 * @param {State} state - 新しい状態
 * @returns {Promise<{ lt: LightningTalk | null, error: any }>} 更新されたLightning Talkとエラー情報を含むPromise
 */
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

/**
 * 次に発表する準備ができているLightning Talkのリストを取得します。
 * 以下の順で、speakerの重複がないように取得します。
 * 1. 発表済みの回数が少ない順
 * 2. 更新日時が古い順
 * 
 * @param {number} limit - 取得するLightning Talkの最大数
 * @returns {Promise<{ lts: LightningTalk[] | null, error: any }>} 取得されたLightning Talkのリストとエラー情報を含むPromise
 */
export const getNextReadyLTs = async (limit: number): Promise<{ lts: LightningTalk[] | null, error: any }> => {
    console.log('start getNextLTsList');

    const prisma = new PrismaClient();

    try {

        const readyLTs = await prisma.lightningTalk.findMany({
            where: {
                state: 'READY'
            },
            orderBy: {
                updatedAt: 'asc'
            }
        });

        const speakerDoneCounts = await prisma.lightningTalk.groupBy({
            by: ['speaker'],
            where: {
                state: 'DONE'
            },
            _count: {
                _all: true
            }
        });

        // [WHY] 発表済みLTの順でソートするためのMap
        const speakerDoneCountMap = new Map(speakerDoneCounts.map(item => [item.speaker, item._count._all]));
        const speakerSet = new Set<string>();   // filter用のSet

        const sortedReadyLTs = readyLTs
            // [WHY] 同じスピーカーが複数回発表しないようにするためのfilter（最初に現れたものを採用 i.e. updatedAtが古いものを採用）
            .filter(lt => {
                if (speakerSet.has(lt.speaker)) {
                    return false;
                }
                speakerSet.add(lt.speaker);
                return true;
            })
            .sort((a, b) => (speakerDoneCountMap.get(a.speaker) || 0) - (speakerDoneCountMap.get(b.speaker) || 0))
            .slice(0, limit);

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


export const getLTsBySpeaker = async (speaker: string, includeDone: boolean = false): Promise<{ lts: LightningTalk[] | null, error: any }> => {
    console.log('start getLTsBySpeaker');

    const prisma = new PrismaClient();

    try {
        const lts = await prisma.lightningTalk.findMany({
            where: {
                speaker,
                state: includeDone ? {
                    not: 'DOING'
                } : {
                    notIn: ['DONE', 'DOING']
                }
            }
        });

        console.log('getLTsBySpeaker', lts);

        return { lts, error: null };

    } catch (error: any) {
        console.error('Failed to getLTsBySpeaker', error);
        return { lts: null, error };

    } finally {
        await prisma.$disconnect();
        console.log('end getLTsBySpeaker');
    }
}

export const getMaxPriorityLT = async (discordUserId: string): Promise<number> => {
    console.log('start getMaxPriorityLT');

    const prisma = new PrismaClient();

    try {
        const lts = await prisma.lightningTalk.findMany({
            where: {
                speaker: discordUserId
            },
            orderBy: {
                priority: 'desc'
            }
        });

        console.log('getMaxPriorityLT', lts);

        return lts.length > 0 ? lts[0].priority : 0;

    } catch (error: any) {
        console.error('Failed to getMaxPriorityLT', error);
        return 0;

    } finally {
        await prisma.$disconnect();
        console.log('end getMaxPriorityLT');
    }
}