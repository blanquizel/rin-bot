import { Context } from 'koishi'

declare module 'koishi' {
    interface Tables {
        subscribe: Subscribe
        up_liver_info: UpLiverInfo
    }
}

export interface Subscribe{
    id:number
    mid: string
    platform: string
    channel: string
    date: string
    user: string
    last_bvid: string
    type: string
    state: number
}

export interface UpLiverInfo {
    mid: string
    name: string
    room_id: string
}

export function database(ctx: Context) {
    ctx.model.extend('subscribe', {
        id: 'unsigned',
        mid: 'string',
        platform: 'string',
        channel: 'string',
        date: 'string',
        user: 'string',
        last_bvid: 'string',
        type: 'string',
        state: 'integer',
    }, {
        autoInc: true,
    })

    ctx.model.extend('up_liver_info', {
        mid: "string",
        name: "string",
        room_id: "string"
    }, {
        primary: ['mid'],
    })
}
