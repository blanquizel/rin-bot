import { Context } from 'koishi'

declare module 'koishi' {
    interface Tables {
        talk_statistic: TalkStatisticDatabase
    }
}

export interface TalkStatisticDatabase {
    id?: number
    platform: string
    channel: string
    date: string
    user: string
    message: number
}


export function database(ctx: Context) {
    // console.log('extend model dk');
    ctx.model.extend('talk_statistic', {
        platform: 'string',
        channel: 'string',
        date: 'string',
        user: 'string',
        message: 'unsigned',
    }, {
        primary: ['channel', 'date', 'user'],
    })
}
