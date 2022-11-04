import { Context, Session } from 'koishi';
import axios from 'axios';
import { UpLiverInfo } from './database';

import { USERURL } from './config';

export function saveUpLiverInfo(ctx: Context, mid: string) {
    return new Promise(async (resolve, reject) => {
        try {
            // const mUser= await getUpLiverInfo(ctx, mid);
            // if (mUser) {
            //     resolve(mUser);
            // }
            const result = await axios.get(USERURL, {
                params: {
                    mid,
                },
                headers: {
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
                }
            })
            // console.log(result);
            if (result.data.code == 0) {
                const user = result.data.data;
                const rows = [{
                    mid: user.mid,
                    name: user.name,
                    room_id: user.live_room.roomid,
                }];
                // console.log(rows);
                await ctx.database.upsert('up_liver_info', rows);

                resolve(rows[0]);
            } else {
                reject();
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
