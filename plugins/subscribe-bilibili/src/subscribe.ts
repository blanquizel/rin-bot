import { Context, Session } from 'koishi';
import dayjs from 'dayjs'
import { SubscribeVideo } from './database';
import { getUpLiverInfo } from './info';
import { Utils } from './utils';

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

const addVideoSubscription = function (ctx: Context, session: Session, mid: string): Promise<SUB_ADD_STATE> {
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
        }];

        try {
            const data = await ctx.database.get('subscribe_video', { mid: mid });
            // console.log(data);
            if (data.length > 0) {
                return resolve(SUB_ADD_STATE.DUPLICATE);
            }
            await ctx.database.upsert('subscribe_video', rows);
            return resolve(SUB_ADD_STATE.SUCCESS);
        } catch (e) {
            console.log(e);
            return reject(SUB_ADD_STATE.FAILED);
        }
    })
}

const updateVideoSubscription = function (ctx: Context, rows) {
    return new Promise(async (resolve, reject) => {
        try {
            await ctx.database.upsert('subscribe_video', rows);
            resolve(true);
        } catch (e) {
            console.log(e);
            return reject(e);
        }
    })
}


const removeVideoSubscription = function (ctx: Context, session: Session, mid: string): Promise<SUB_DEL_STATE> {
    return new Promise(async (resolve, reject) => {
        const platform = session.platform;
        const channel = session.channelId;

        try {
            const data = await ctx.database.get('subscribe_video', { platform, channel });
            if (data.length === 0) {
                return resolve(SUB_DEL_STATE.NODATA)
            }
            await ctx.database.remove('subscribe_video', { platform, channel });
            return resolve(SUB_DEL_STATE.SUCCESS);
        } catch (e) {
            console.log(e);
            return reject(SUB_DEL_STATE.FAILED);
        }
    })
}

const queryVideoSubscription = function (ctx: Context, session: Session): Promise<SUB_QUERY_STATE | string> {
    return new Promise(async (resolve, reject) => {
        const platform = session.platform;
        const channel = session.channelId;
        // const user = session.author.userId;
        // console.log(await session.bot.getGuildMember(session.guildId, session.author.userId));

        try {
            const rows = await ctx.database.get('subscribe_video', { platform, channel });
            // console.log(rows);
            let result = '当前频道已订阅以下内容：';
            if (rows.length === 0) {
                return resolve(SUB_QUERY_STATE.NODATA);
            }
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const user = await session.bot.getGuildMember(session.guildId, row.user);
                const mUser = await getUpLiverInfo(ctx, row.mid);
                // console.log(user.nickname || user.username);
                result += `\n用户${user.nickname || user.username}（${row.user}）已订阅UP主【${mUser ? mUser.name : ''}】（${row.mid}）`;
            }

            return resolve(result);
        } catch (e) {
            return reject(SUB_QUERY_STATE.FAILED);
        }
    })
}


const getVideoSubscriptionList = function (ctx: Context) {
    return ctx.database.get('subscribe_video', {});
    // return new Promise(async (resolve, _) => {
    //     return resolve(await ctx.database.get('subscribe_video', {}));
    // })
}

const getLastVideo = function (ctx: Context, sub: SubscribeVideo) {
    return new Promise(async (resolve, reject) => {
        const params = {
            mid: sub.mid,
            ps: 30,
            pn: 1,
            keyword: '',
            order: 'pubdate',
            order_avoided: true,
        }
        // console.log(params);
        await Utils.get(VLISTURL, params).then((data: any) => {
            if (data.code === 0) {
                // console.log(data.data);
                resolve(data.data);
            } else {
                console.log(data);
                reject(data);
            }
        }).catch(e => {
            reject(e);
        })

    });
}



export const videoSubscribe = {
    add: addVideoSubscription,
    remove: removeVideoSubscription,
    query: queryVideoSubscription,
    getSubscriptionList: getVideoSubscriptionList,
    getLastVideo: getLastVideo,
    updateVideoSubscription: updateVideoSubscription,
}
