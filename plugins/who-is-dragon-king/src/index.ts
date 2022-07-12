import { Context, Logger } from 'koishi'

export const name = 'who-is-dragon-king'

const record : Map<string, number> = new Map();

const core = (ctx: Context) => {
    const log = ctx.logger('who-is-dragon-king');
    log.debug('who-is-dragon-king test');
}

export function apply(ctx: Context) {
    ctx.plugin(core);
}
