import { type NotificationMessage, PrismaClient } from "@prisma/client";


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