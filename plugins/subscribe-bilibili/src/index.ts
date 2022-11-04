import { Context } from 'koishi';

import { database } from './database';

import { videoSubscribe } from './subscribe';
import { saveUpLiverInfo } from './info';
import { setInterval as setIntervalPromiseBased } from 'timers/promises';

export const name = 'subscribe-bilibili';
export const using = ['database'];

const INTERVAL = 5 * 1000;

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

    ctx.on('ready', async () => {
        for await (const startAt of setIntervalPromiseBased(INTERVAL, Date.now())) {
            console.log(Date.now() - startAt);
            const subs = await videoSubscribe.getSubscriptionList(ctx);
            const taskList: Promise<any>[] = [];
            subs.forEach(async (sub) => {
                const task = new Promise(async (reslove, reject) => {
                    const lastVideo = await videoSubscribe.getLastVideo(ctx, sub);
                })
                taskList.push(task);
            })
            Promise.all(taskList)
            // console.log(subs);
            if ((Date.now() - startAt) > INTERVAL)
                break;
        }
    })
}
