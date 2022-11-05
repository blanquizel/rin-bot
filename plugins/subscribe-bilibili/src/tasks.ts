import { Context, Channel, segment } from 'koishi';
import dayjs from 'dayjs'


import { SubscribeVideo, UpLiverInfo } from './database';

import { videoSubscribe } from './subscribe'

type Video = {
    pic: string
    description: string
    title: string
    mid: number
    author: string
    bvid: string
    created: number
}


export function generateTask(ctx: Context, sub: SubscribeVideo) {
    return new Promise(async (reslove, reject) => {
        const data: any = await videoSubscribe.getLastVideo(ctx, sub);

        const vlist: Video[] = data.list.vlist;

        // no valid video
        if (!vlist || vlist.length < 1) { return reslove(false); }

        const lastVideo = vlist[0];

        // check if video has ready record
        if (lastVideo.bvid === sub.last_bvid) { return reslove(false) };
        // check if video has update over 1 day
        const diff = dayjs(sub.date).diff(dayjs(lastVideo.created * 1000), 'day');
        // console.log(sub.date, dayjs(lastVideo.created * 1000));
        // console.log('diff:', diff);
        if (diff >= 1) {
            const rows = [Object.assign(sub, {
                date: dayjs().format(''),
                last_bvid: lastVideo.bvid,
            })]
            await videoSubscribe.updateVideoSubscription(ctx, rows);
            return reslove(false);
        }

        // get bot
        const channels: Channel[] = await ctx.database.get('channel', { guildId: sub.channel });
        if (channels.length < 1) { return reslove(false) };
        const channel = channels[0]; // id, platform, assignee, guildId, name,
        const bot = ctx.bots.find(bot => { return bot.selfId === channel.assignee });

        // generate message
        let message = segment('image', { url: `${lastVideo.pic}` }) + `${lastVideo.author}上传了新视频：${lastVideo.title}\nhttps://www.bilibili.com/video/${lastVideo.bvid}`;

        // push message
        // bot.broadcast([sub.channel], message);
        bot.sendMessage(sub.channel, message)

        // update last video info to table subscribe_video
        const rows = [Object.assign(sub, {
            date: dayjs().format(''),
            last_bvid: lastVideo.bvid,
        })]
        await videoSubscribe.updateVideoSubscription(ctx, rows);

        return reslove(true);
    });
}
