import { Context } from 'koishi'

declare module 'koishi' {
    interface Tables {
        duplicate_image: DuplicateImageDatabase
    }
}

export interface DuplicateImageDatabase {
    id?: number
    platform: string
    channel: string
    user: string
    date: number
    hash: string
    count: number
}

export function database(ctx: Context) {
    ctx.model.extend('duplicate_image', {
        id: 'unsigned',
        platform: 'string',
        channel: 'string',
        user: 'string',
        date: 'unsigned',
        hash: 'text',
        count: 'unsigned'
    },{
        autoInc: true,
    })
}
