import { Context } from 'koishi'

declare module 'koishi' {
    interface Tables {
        subscribe_video: SubscribeVideo
        // up_liver_info: UpLiverInfo
    }
}

interface SubscribeVideo{
    mid: string
    platform: string
    channel: string
    date: string
    user: string
    last_bvid: string
}

interface UpLiverInfo {
    mid: string
    name: string
    room_mid: string
}

export function database(ctx: Context) {
    ctx.model.extend('subscribe_video', {
        mid: 'string',
        platform: 'string',
        channel: 'string',
        date: 'string',
        user: 'string',
        last_bvid: 'string',
    }, {
        primary: ['mid']
    })

    // ctx.model.extend('up_liver_info', {
    //     mid: "unsigned",
    //     name: "string",
    //     room_mid: "unsigned"
    // }, {
    //     primary: ['mid'],
    // })
}
