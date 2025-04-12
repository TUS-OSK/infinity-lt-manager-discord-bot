import { PrismaClient, type NextLightningTalk } from "@prisma/client";
import type { NextLightningTalkWithDetails } from "../types";

/**
 * 次のLTを挿入します。
 * 挿入時、元々のデータは全て削除されます。
 * 
 * @param {number[]} lightningTalkIds - 挿入するLTのIDの配列
 * @returns {Promise<{ nextLTs: NextLightningTalk[] | null, error: any }>} 挿入されたLTの配列とエラー情報を含むPromise
 */
export const insertNextLTs = async (lightningTalkIds: number[]): Promise<{ nextLTs: NextLightningTalk[] | null, error: any }> => {
    console.log('start insertNextLTs');

    const { error: deleteAllNextLTsError } = await deleteAllNextLTs();
    if (deleteAllNextLTsError) {
        return { nextLTs: null, error: deleteAllNextLTsError };
    }
    const prisma = new PrismaClient();

    try {
        const nextLTs: NextLightningTalk[] = await Promise.all(lightningTalkIds.map(async (lightningTalkId, index) => {
            const nextLT = await prisma.nextLightningTalk.create({
                data: {
                    lightningTalkId,
                    order: index
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

/**
 * nextLTテーブルの全てのレコードを削除します。
 * 
 * @returns {Promise<{ count: number | null, error: any }>} 削除されたレコードの数とエラー情報を含むPromise
 */
export const deleteAllNextLTs = async (): Promise<{ count: number | null, error: any }> => {
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

/**
 * 次のLTを取得します。
 * 次のLTが存在しない場合は、nextLTとerrorの両方がnullとなります。
 * 
 * @returns {Promise<{ nextLT: NextLightningTalkWithDetails | null, error: any }>} 次のLTの詳細とエラー情報を含むPromise
 */
export const getNextLT = async (): Promise<{ nextLT: NextLightningTalkWithDetails | null, error: any }> => {
    console.log('start getNextLT');

    const prisma = new PrismaClient();

    try {
        const nextLT: NextLightningTalkWithDetails | null = await prisma.nextLightningTalk.findFirst({
            include: {
                lightningTalk: {
                    select: {
                        id: true,
                        title: true,
                        speaker: true,
                        description: true
                    }
                }
            },
            where: {
                done: false
            },
            orderBy: {
                order: 'asc'
            }
        });
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

/**
 * 指定されたIDのnextLTテーブルのレコードを削除します。
 * 
 * @param {number} nextLTId - 削除する次のLTのID
 * @returns {Promise<{ nextLT: NextLightningTalk | null, error: any }>} 削除されたLTとエラー情報を含むPromise
 */
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

/**
 * 指定されたIDのnextLTを「完了」状態に更新します。
 * 
 * @param {number} nextLTId - 更新するnextLTのID
 * @returns {Promise<{ nextLT: NextLightningTalk | null, error: any }>} 更新されたnextLTとエラー情報を含むPromise
 */
export const updateDoneNextLT = async (nextLTId: number): Promise<{ nextLT: NextLightningTalk | null, error: any }> => {
    console.log('start updateDoneNextLT');

    const prisma = new PrismaClient();

    try {
        const nextLT: NextLightningTalk = await prisma.nextLightningTalk.update({
            where: {
                id: nextLTId
            },
            data: {
                done: true
            }
        });
        console.log('updateDoneNextLT', nextLT);

        return { nextLT, error: null };
    } catch (error: any) {
        console.error('Failed to updateDoneNextLT', error);
        return { nextLT: null, error };
    } finally {
        await prisma.$disconnect();
        console.log('end updateDoneNextLT');
    }
}

/**
 * 完了状態の全てのnextLTを取得します。
 * 
 * @returns {Promise<{ nextLTs: NextLightningTalkWithDetails[] | null, error: any }>} 完了状態のnextLTリストとエラー情報を含むPromise
 */
export const getAllDoneNextLTs = async (): Promise<{ nextLTs: NextLightningTalkWithDetails[] | null, error: any }> => {
    console.log('start getAllDoneNextLTs');

    const prisma = new PrismaClient();

    try {
        const nextLTs: NextLightningTalkWithDetails[] = await prisma.nextLightningTalk.findMany({
            include: {
                lightningTalk: {
                    select: {
                        id: true,
                        title: true,
                        speaker: true,
                        description: true
                    }
                }
            },
            where: {
                done: true
            },
            orderBy: {
                order: 'asc'
            }
        });
        console.log('getAllDoneNextLTs', nextLTs);

        return { nextLTs, error: null };
    } catch (error: any) {
        console.error('Failed to getAllDoneNextLTs', error);
        return { nextLTs: null, error };
    } finally {
        await prisma.$disconnect();
        console.log('end getAllDoneNextLTs');
    }
}
