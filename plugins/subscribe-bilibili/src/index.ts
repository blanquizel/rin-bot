import { Context, Logger } from 'koishi';
import { setInterval as setIntervalPromiseBased } from 'timers/promises';

import { database } from './database';
import { videoSubscribe } from './subscribe';
import { saveUpLiverInfo } from './info';
import { generateTask } from './tasks';

export const name = 'subscribe-bilibili';
export const using = ['database'];

const INTERVAL = 60 * 1 * 1000;

export function apply(ctx: Context) {

    const logger = new Logger('subscribe-bilibili');

    ctx.plugin(database);

    // ctx = ctx.guild();
    // ctx = ctx.channel();

    ctx.command('bvideo')
        .action(() => {
            return 'bilibli video';
        })

    ctx.command('bvideo.add <mid>', '添加订阅')
        .action(async ({ session }, mid) => {
            const user = saveUpLiverInfo(ctx, mid);
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
        // logger.info('subscribe task ready');
        for await (const _ of setIntervalPromiseBased(INTERVAL, Date.now())) {
            const subs = await videoSubscribe.getSubscriptionList(ctx);
            const taskList: Promise<any>[] = [];
            subs.forEach(async (sub) => {
                const task = generateTask(ctx, sub);
                taskList.push(task);
            })
            Promise.all(taskList);
            // logger.success('subscribe interval task start');
        }
    })
}
