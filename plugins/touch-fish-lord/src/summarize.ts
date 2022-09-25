import { Context, Session } from 'koishi'
import dayjs from 'dayjs'

import { Duration } from './duration';


const genSql = () => {
    const sql = `
        SELECT user, SUM(message) as message
        FROM talk_statistic
        WHERE platform = ? AND channel = ? AND date <= ? AND date >= ?
        GROUP BY user
        ORDER BY message DESC
        LIMIT 10`

    return sql
}

const sumToDay = async (ctx: Context, session: Session): Promise<string> => {
    const sql = genSql();

    const params = {
        platform: 'onebot',
        channel: session.channelId,
        date: dayjs().format('YYYY-MM-DD')
    }
    const rank = await ctx.database.get('talk_statistic', params, {
        sort: { message: 'desc' },
    });

    console.log(rank);

    return '1';
}
const sumLastDay = async (ctx: Context, session: Session): Promise<string> => {
    const sql = genSql();

    const params = {
        platform: 'onebot',
        channel: session.channelId,
        date: dayjs().subtract(7, 'year').format('YYYY-MM-DD')
    }

    return '2';
}

const sum = async (ctx: Context, session: Session, duration: Duration): Promise<string> => {
    switch (duration) {
        case Duration.Today:
            return sumToDay(ctx, session);
        case Duration.Yesterday:
            return sumLastDay(ctx, session);
        default: break;
    }
    return '暂无支持的操作';
}

export function summarize(ctx: Context) {

    ctx.command('今日摸鱼榜')
        .userFields(['name'])
        .action(({ session }) => {
            return sum(ctx, session, Duration.Today);
        });

    ctx.command('昨日摸鱼榜')
        .userFields(['name'])
        .action(({ session }) => {
            return sum(ctx, session, Duration.Yesterday);
        });
}
