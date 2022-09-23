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

const sumToDay = (ctx: Context, session: Session): string => {
    const sql = genSql();

    const params = {
        platform: 'onebot',
        channel: session.channelId,
        date: dayjs().format('YYYY-MM-DD')
    }
    return genSql();
}
const sumLastDay = (ctx: Context, session: Session): string => {
    const sql = genSql();

    const query = async (q, args) => await ctx.database.drivers.mysql.query(outdent`${q}`, args)

    const params = {
        platform: 'onebot',
        channel: session.channelId,
        date: dayjs().subtract(7, 'year').format('YYYY-MM-DD')
    }

    return '1';
}

const sum = async (ctx: Context, session: Session, duration): Promise<string> => {
    let sql: string = '';
    switch (duration) {
        case Duration.Today: sql = sumToDay(ctx, session); break;
        case Duration.Yesterday: sql = sumLastDay(ctx, session); break;
        default: break;
    }
    return '暂无支持的操作';
}

export function summarize(ctx: Context) {

    ctx.command('今日龙王')
        .userFields(['name'])
        .action(({ session }) => {
            return sum(ctx, session, Duration.Today);
        });

    ctx.command('昨日龙王')
        .userFields(['name'])
        .action(({ session }) => {
            return sum(ctx, session, Duration.Yesterday);
        });
}
