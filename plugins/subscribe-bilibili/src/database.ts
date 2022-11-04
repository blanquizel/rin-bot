import { Context } from 'koishi'

declare module 'koishi' {
    interface Tables {
        subscribe_bilibili: SubscribeBilibili
        // up_liver_info: UpLiverInfo
    }
}

interface SubscribeBilibili {
    mid: string
    platform: string
    channel: string
    date: string
    user: string
    last_bvid: string
    type: string
}

interface UpLiverInfo {
    mid: string
    name: string
    room_mid: string
}

export function database(ctx: Context) {
    ctx.model.extend('subscribe_bilibili', {
        mid: 'string',
        platform: 'string',
        channel: 'string',
        date: 'string',
        user: 'string',
        last_bvid: 'string',
        type: 'string',
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
