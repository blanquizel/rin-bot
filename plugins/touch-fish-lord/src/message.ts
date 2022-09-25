import { Context } from 'koishi'
import dayjs from 'dayjs'


export function message(ctx: Context) {
    ctx.on('message', async (session) => {
        // console.log(session);
        const platform = session.platform;
        const channel = session.channelId;
        const user = session.author.userId;

        const time = dayjs().format('YYYY-MM-DD');

        const rows: any = [{
            platform: platform,
            channel: channel,
            date: time,
            user: user,
            message: { $add: [{ $: 'message' }, 1] },
        }]

        await ctx.database.upsert('talk_statistic', rows);
    })
}
