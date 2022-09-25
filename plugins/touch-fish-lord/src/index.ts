import { Context } from 'koishi'

import { database } from './database';
import { message } from './message';
import { summarize } from './summarize';

export const name = 'who-is-dragon-king'

export const using = ['database'];

export function apply(ctx: Context) {
    ctx.plugin(database);
    ctx = ctx.channel();
    ctx.plugin(message);
    ctx.plugin(summarize);
}
