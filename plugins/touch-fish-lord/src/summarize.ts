import { Context, Session } from 'koishi'
import dayjs from 'dayjs'

import { Duration } from './duration';

const LIMIT = 10;

type SUMPARAMS = {
    duration: Duration,
    date: string,
    limit: number,
}

const getRankUser = async (rankItem, session: Session): Promise<string> => {
    const user = await session.bot.getGuildMember(session.guildId, rankItem.user);
    return user ? (user.nickname || user.username) : '[找不到该用户]';
}

const sumToDay = (): SUMPARAMS => {
    return {
        duration: Duration.Yesterday,
        date: dayjs().format('YYYY-MM-DD'),
        limit: LIMIT,
    };
}
const sumLastDay = (): SUMPARAMS => {
    return {
        duration: Duration.Yesterday,
        date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        limit: LIMIT,
    };
}

const doSum = async (ctx: Context, session: Session, params: SUMPARAMS) => {
    const query = {
        platform: 'onebot',
        channel: session.channelId,
        date: params.date
    }
    const rank = await ctx.database.get('talk_statistic', query, {
        sort: { message: 'desc' },
    });

    let sum = 0;
    rank.forEach(item => {
        sum += item.message;
    })

    let ans = `${params.duration}摸鱼榜（共${sum}条消息 ）`;

    const _limit = Math.min(params.limit, rank.length);

    const userMap = new Map();

    for (let i = 0; i < _limit; i++) {
        const item = rank[i];

        const user = await getRankUser(item, session);
        userMap.set(item.user, user);

        ans += `\n ${i + 1} - ${user} - ${item.message}条（${(item.message * 100 / sum).toFixed(2)}%）`
    }

    ans += `\n ${userMap.get(rank[0].user)}是摸皇帝`;

    return ans;
}

const sum = async (ctx: Context, session: Session, duration: Duration): Promise<string> => {
    switch (duration) {
        case Duration.Today: {
            const params: SUMPARAMS = sumToDay();
            return doSum(ctx, session, params);
        }
        case Duration.Yesterday: {
            const params: SUMPARAMS = sumLastDay();
            return doSum(ctx, session, params);
        }
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
