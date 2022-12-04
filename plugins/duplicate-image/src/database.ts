import { Context } from 'koishi'

declare module 'koishi' {
    interface Tables {
        duplicate_image: DuplicateImageDatabase
    }
}

export interface DuplicateImageDatabase {
    platform: string
    channel: string
    user: string
    date: number
    hash: string
    count: number
}

export function database(ctx: Context) {
    ctx.model.extend('duplicate_image', {
        platform: 'string',
        channel: 'string',
        user: 'string',
        date: 'unsigned',
        hash: 'string',
        count: 'unsigned'
    }, {
        primary: ['hash'],
    })
}
