import { Context } from 'koishi'

import { core } from './core';

export const name = 'when-is-holiday'

export function apply(ctx: Context) {
    ctx.plugin(core);
}
