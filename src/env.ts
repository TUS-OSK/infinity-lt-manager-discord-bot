import { z } from 'zod'

const nonEmptyString = z.string().min(1)
const environmentVariablesSchema = z.object({
    DISCORD_BOT_TOKEN: nonEmptyString,
    CLIENT_ID: nonEmptyString,
    GUILD_ID: nonEmptyString,
    NOTIFICATION_CHANNEL_ID: nonEmptyString,
})

const result = environmentVariablesSchema.safeParse(process.env)
if (!result.success) {
    throw new Error(`env type is invalid\n${result.error.errors.map((v) => `${v.message}: env.${v.path[0]}`).join('\n')}`)
}


declare module 'bun' {
    interface Env extends z.infer<typeof environmentVariablesSchema> { }
}
