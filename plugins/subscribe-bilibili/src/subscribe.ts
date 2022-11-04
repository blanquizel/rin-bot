import { Context, Session } from 'koishi';
import dayjs from 'dayjs'

import { VLISTURL } from './config';

enum SUB_ADD_STATE {
    SUCCESS = '订阅成功',
    FAILED = '订阅失败',
    DUPLICATE = '重复订阅',
}

enum SUB_DEL_STATE {
    SUCCESS = '取消订阅成功',
    FAILED = '取消订阅失败',
    NODATA = '无订阅信息',
}

enum SUB_QUERY_STATE {
    FAILED = '查询失败',
    NODATA = '无订阅信息',
}

export async function addSubscribe(ctx: Context, session: Session, mid: string, type:string): Promise<SUB_ADD_STATE> {
    return new Promise(async (resolve, reject) => {
        const platform = session.platform;
        const channel = session.channelId;
        const user = session.author.userId;

        const rows: any = [{
            platform,
            channel,
            user,
            mid,
            date: dayjs().format(''),
            type,
        }];



        try {
            const data = await ctx.database.get('subscribe_bilibili', { mid: mid });
            // console.log(data);
            if (data.length > 0) {
                return resolve(SUB_ADD_STATE.DUPLICATE);
            }
            await ctx.database.upsert('subscribe_bilibili', rows);
            return resolve(SUB_ADD_STATE.SUCCESS);
        } catch (e) {
            console.log(e);
            return reject(SUB_ADD_STATE.FAILED);
        }
    })
}


export function removeSubscribe(ctx: Context, session: Session, mid: string): Promise<SUB_DEL_STATE> {
    return new Promise(async (resolve, reject) => {
        const platform = session.platform;
        const channel = session.channelId;
        const user = session.author.userId;

        try {
            const data = await ctx.database.get('subscribe_bilibili', { platform, channel });
            if (data.length === 0) {
                return resolve(SUB_DEL_STATE.NODATA)
            }
            await ctx.database.remove('subscribe_bilibili', { platform, channel });
            return resolve(SUB_DEL_STATE.SUCCESS);
        } catch (e) {
            console.log(e);
            return reject(SUB_DEL_STATE.FAILED);
        }
    })
}

export function querySubscribe(ctx: Context, session: Session): Promise<SUB_QUERY_STATE | string> {
    return new Promise(async (resolve, reject) => {
        const platform = session.platform;
        const channel = session.channelId;
        // const user = session.author.userId;
        // console.log(await session.bot.getGuildMember(session.guildId, session.author.userId));

        try {
            const rows = await ctx.database.get('subscribe_bilibili', { platform, channel });
            // console.log(rows);
            let result = '当前频道已订阅以下内容：';
            if (rows.length === 0) {
                return resolve(SUB_QUERY_STATE.NODATA);
            }
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const user = await session.bot.getGuildMember(session.guildId, row.user);
                // console.log(user.nickname || user.username);
                result += `\n用户${user.nickname || user.username}（${row.user}）在${dayjs(row.date).format('YYYY年MM月DD日')}订阅了UP主${row.mid}`;
            }

            return resolve(result);
        } catch (e) {
            return reject(SUB_QUERY_STATE.FAILED);
        }
    })
}
