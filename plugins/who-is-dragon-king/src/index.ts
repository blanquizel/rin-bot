import { Context, Logger } from 'koishi'
import dayjs from 'dayjs'

export const name = 'who-is-dragon-king'

const data = new Map();

const core = (ctx: Context) => {
    const log = ctx.logger('who-is-dragon-king');
    log.debug('who-is-dragon-king test');

    ctx.command('今日龙王')
        .userFields(['name'])
        .action(({ session }) => {
            const guildId = session.guildId;
            if (!data.has(guildId)) {
                return '暂无人发言';
            }

            const { record, userMap } = data.get(guildId);
            const list = [];
            let count = 0;
            for (let item of record.entries()) {
                list.push(item);
                count += item[1];
            }
            list.sort((a, b) => {
                return a[1] - b[1];
            });


            let str = '';
            str += `今日龙王榜(共${count}条消息)\n`;

            for (let i = 0; i < Math.min(list.length, 5); i++) {
                str += `${i+1} - ${userMap.get(list[i][0])} 共${list[i][1]}条\n`;
            }

            return str;
        })

    ctx.middleware(async (session, next) => {
        // console.log(session);
        const guildId = session.guildId;
        const userId = session.author.userId;
        const username = session.author.nickname === '' ? session.author.username : session.author.nickname;

        if (data.has(guildId)) {
            const { record, userMap } = data.get(guildId);
            if (!record.has(userId)) {
                record.set(userId, record.get(userId) + 1);
            } else {
                record.set(userId, 1);
            }
            if (!userMap.has(userId)) {
                userMap.set(userId, username);
            }
        } else {
            const record = new Map();
            const userMap = new Map();
            record.set(userId, 1);
            userMap.set(userId, username);
            data.set(guildId, { record, userMap });
        }

        return next();
    })
}

export function apply(ctx: Context) {
    ctx.plugin(core);
}
