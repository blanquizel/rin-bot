import { Context, Session } from 'koishi';

import { USERURL } from './config';

export function saveUpLiverInfo(ctx: Context, session: Session, mid: string) {
    return new Promise(async (resolve, _) => {

        const rows = [{
            mid,
        }]

        await ctx.database.upsert('subscribe_bilibili', rows);

        resolve(true);
    })
}

export function getUpLiverInfo(ctx: Context, session: Session, mid: string) {
    return new Promise(async (resolve, _) => {
        const platform = session.platform;
        const channel = session.channelId;
        const user = session.author.userId;

        const rows: any = [{
            platform,
            channel,
            user,
            mid
        }];

        await ctx.database.remove('subscribe_bilibili', rows);

        resolve(true);
    })
}
