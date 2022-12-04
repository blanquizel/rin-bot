import { Context, Session, segment } from 'koishi'
import dayjs from 'dayjs';

import { database, DuplicateImageDatabase as DuplicateImage } from './database';
import { imageHash, checkHash, imageDuplicate } from './imageHash';

export const name = 'duplicate-image'

async function genMessage(session: Session, item: DuplicateImage): Promise<string> {

    const orginUser = await session.bot.getGuildMember(session.guildId, item.user);
    const curUser = await session.bot.getGuildMember(session.guildId, session.author.userId);
    const time = dayjs(item.date).format('');

    let str = `出警！${curUser.nickname || curUser.username}又在发火星图！此图由${orginUser.nickname || orginUser.username}于${time}在本群第一次发出，已经被发过${item.count}次。`;

    return str;
}


export function apply(ctx: Context) {
    // ctx.plugin(database);
    ctx = ctx.channel();

    ctx.middleware(async (session, next) => {
        const elements = segment.parse(session.content);
        for (const element of elements) {
            if (element.type === 'image') {
                console.log(element);
                const imageBuffer = await ctx.http.get(element.attrs.url, {
                    responseType: 'arraybuffer',
                });
                const hash = await imageHash(imageBuffer);

                const rows = await checkHash(ctx, session, hash);

                if (rows.length === 0) {
                    const newItem = {};
                } else {
                    const message = await genMessage(session, rows[0]);
                    imageDuplicate(ctx, session, rows[0]);
                    session.send(message);
                }
            }
        }

        return next();
    })

    // ctx.on('message', async (session) => {
    //     for (const element of session.elements) {
    //         if (element.type === 'image') {
    //             console.log(element);
    //         }
    //     }
    // });
}
