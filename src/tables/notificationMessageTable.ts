import { type NotificationMessage, PrismaClient } from "@prisma/client";

/**
 * 通知メッセージテーブル操作のための関数群
 * Discord通知メッセージとLTの関連付けを管理する
 */

/**
 * 指定されたlightningTalkIdとmessageIdを使用して通知メッセージを挿入します。
 * 
 * @param {number} lightningTalkId - 挿入する通知メッセージのlightningTalkId。
 * @param {string} messageId - 挿入する通知メッセージのmessageId。
 * @returns {Promise<{ notificationMessage: NotificationMessage | null, error: any }>} 挿入された通知メッセージとエラー情報を含むPromise。
 */
export const insertNotificationMessage = async (lightningTalkId: number, messageId: string): Promise<{ notificationMessage: NotificationMessage | null, error: any }> => {
    console.log('start insertNotificationMessage');

    const prisma = new PrismaClient();

    try {
        const notificationMessage: NotificationMessage = await prisma.notificationMessage.create({
            data: {
                lightningTalkId,
                messageId
            }
        });
        console.log('insertNotificationMessage', notificationMessage);

        return { notificationMessage, error: null };
    } catch (error: any) {
        console.error('Failed to insertNotificationMessage', error);
        return { notificationMessage: null, error };
    } finally {
        await prisma.$disconnect();
        console.log('end insertNotificationMessage');
    }
}

/**
 * 指定されたlightningTalkIdを使用して通知メッセージを削除します。
 * 
 * @param {number} lightningTalkId - 削除する通知メッセージのlightningTalkId。
 * @returns {Promise<{ notificationMessage: NotificationMessage | null, error: any }>} 削除された通知メッセージとエラー情報を含むPromise。
 */
export const deleteNotificationMessage = async (lightningTalkId: number): Promise<{ notificationMessage: NotificationMessage | null, error: any }> => {
    console.log('start deleteNotificationMessage');

    const prisma = new PrismaClient();

    try {
        const notificationMessage: NotificationMessage = await prisma.notificationMessage.delete({
            where: {
                lightningTalkId
            }
        });
        console.log('deleteNotificationMessage', notificationMessage);

        return { notificationMessage, error: null };
    } catch (error: any) {
        console.error('Failed to deleteNotificationMessage', error);
        return { notificationMessage: null, error };
    } finally {
        await prisma.$disconnect();
        console.log('end deleteNotificationMessage');
    }
}
