import { Context, Session } from 'koishi'
import dayjs from 'dayjs'

import { Duration } from './duration';

const LIMIT = 10;

const getRankUser = async (rankItem, session: Session) : Promise<string> =>  {
    const user = await session.bot.getGuildMember(session.guildId, rankItem.user);
    return user ? (user.nickname || user.username) : '[找不到该用户]';
}

const sumToDay = async (ctx: Context, session: Session): Promise<string> => {
    const params = {
        platform: 'onebot',
        channel: session.channelId,
        date: dayjs().format('YYYY-MM-DD')
    }
    const rank = await ctx.database.get('talk_statistic', params, {
        sort: { message: 'desc' },
    });

    let sum = 0;
    rank.forEach(item => {
        sum += item.message;
    })

    let ans = `今日摸鱼榜（共${sum}条消息 ）`;

    const limit = Math.min(LIMIT, rank.length);

    const userMap = new Map();

    for (let i = 0; i < limit; i++) {
        const item = rank[i];

        const user = await getRankUser(item, session);
        userMap.set(item.user, user);

        ans += `\n ${i + 1} - ${user} - ${item.message}条（${(item.message * 100 / sum).toFixed(2)}%）`
    }

    ans += `\n ${userMap.get(rank[0].user)}是摸鱼王`;

    return ans;
}
const sumLastDay = async (ctx: Context, session: Session): Promise<string> => {
    const params = {
        platform: 'onebot',
        channel: session.channelId,
        date: dayjs().subtract(7, 'year').format('YYYY-MM-DD')
    }
    const rank = await ctx.database.get('talk_statistic', params, {
        sort: { message: 'desc' },
    });


    let sum = 0;
    rank.forEach(item => {
        sum += item.message;
    })


    let ans = `昨日摸鱼榜（共${sum}条消息 ）`;

    const limit = Math.min(LIMIT, rank.length);
    const userMap = new Map();

    for (let i = 0; i < limit; i++) {
        const item = rank[i];
        const user = await getRankUser(item, session);
        userMap.set(item.user, user);

        ans += `\n ${i + 1} - ${await getRankUser(item, session)} - ${item.message}条（${(item.message * 100 / sum).toFixed(2)}%）`
    }

    ans += `\n ${userMap.get(rank[0].user)}是摸鱼王`;

    return ans;
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
