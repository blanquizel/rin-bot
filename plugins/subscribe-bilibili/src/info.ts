import { Context, Session } from 'koishi';
import { Utils } from './utils';
import { UpLiverInfo } from './database';

import { USERURL } from './config';

export function saveUpLiverInfo(ctx: Context, mid: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const data: any = await Utils.get(USERURL, {
                mid,
            })
            // console.log(data);
            if (data.code == 0) {
                const user = data.data;
                const rows = [{
                    mid: user.mid,
                    name: user.name,
                    room_id: user.live_room.roomid,
                }];
                // console.log(rows);
                await ctx.database.upsert('up_liver_info', rows);

                resolve(rows[0]);
            } else {
                console.log(data);
                reject(data);
            }
        } catch (e) {
            reject(e);
        }
    })
}

export function getUpLiverInfo(ctx: Context, mid: string): Promise<UpLiverInfo | undefined> {
    return new Promise(async (resolve, _) => {
        const data = await ctx.database.get('up_liver_info', { mid });
        resolve(data && data.length > 0 ? data[0] : undefined);
    })
}
