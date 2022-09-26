import { Context } from 'koishi'

import { database } from './database';

export const name = 'duplicate-image'

export function apply(ctx: Context) {
    // ctx.plugin(database);
    ctx = ctx.channel();
}
