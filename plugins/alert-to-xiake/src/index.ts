import { Context } from 'koishi'

export const name = 'alert-to-xiake'

export function apply(ctx: Context) {
  // write your plugin here
  // write your plugin here
  ctx.middleware((session, next) => {
    if (session.content === '天王盖地虎') {
      return '宝塔镇河妖'
    }
    return next()
  })
}
