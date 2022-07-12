import { Context, Logger } from 'koishi'

import { core, Config } from './core';

export const name = 'koishi-plugin-gacha-simlation'

export function apply(ctx: Context, config: Config): void {

  const log: Logger = ctx.logger('gacha-simlation');

  config = {
    ...config
  }


  ctx.plugin(core, config)
}
