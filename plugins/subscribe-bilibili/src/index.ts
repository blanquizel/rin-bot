import { Context } from 'koishi';

import { database } from './database';

import { videoSubscribe } from './subscribe';
import { saveUpLiverInfo } from './info';

export const name = 'subscribe-bilibili';
export const using = ['database'];

export function apply(ctx: Context) {
    ctx.plugin(database);

    // ctx = ctx.guild();
    // ctx = ctx.channel();

    ctx.command('bvideo')
        .action(() => {
            return 'b video';
        })

    ctx.command('bvideo.add <mid>', '添加订阅')
        .action(async ({ session }, mid) => {
            saveUpLiverInfo(ctx, mid);
            return videoSubscribe.add(ctx, session, mid).then((res) => {
                return res;
            }).catch((e) => {
                return e;
            });
        });

    ctx.command('bvideo.remove <mid>', '取消订阅')
        .action(async ({ session }, mid) => {
            return videoSubscribe.remove(ctx, session, mid).then((res) => {
                return res;
            }).catch((e) => {
                return e;
            });
        });


    ctx.command('bvideo.query', '查询订阅')
        .action(async ({ session }) => {
            return videoSubscribe.query(ctx, session).then((res) => {
                return res;
            }).catch((e) => {
                return e;
            });
        });
}
