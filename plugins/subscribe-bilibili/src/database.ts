import { Context } from 'koishi'

declare module 'koishi' {
    interface Tables {
        subscribe_video: SubscribeVideo
        up_liver_info: UpLiverInfo
    }
}

export interface SubscribeVideo{
    mid: string
    platform: string
    channel: string
    date: string
    user: string
    last_bvid: string
}

export interface UpLiverInfo {
    mid: string
    name: string
    room_id: string
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

    ctx.model.extend('up_liver_info', {
        mid: "string",
        name: "string",
        room_id: "string"
    }, {
        primary: ['mid'],
    })
}
