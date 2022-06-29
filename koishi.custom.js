const { sleep } = require('koishi')
console.log(process.env)
/**
 * @param {import('koishi').Context} ctx
 */
module.exports = ctx => {
  ctx.on('command-added', async (command) => {
    switch (command.name) {
      // Modify commands.
      case 'teach':
        await sleep(0)
        ctx.command('teach', { hidden: true })
          .usage('指令速查： https://s.idl.ist/teach-v4')
        break
      case 'teach.status':
        ctx.command('teach.status', { hidden: true })
        break
      case 'dialogue':
        ctx.command('dialogue', { hidden: true })
        break
      case 'channel':
        ctx.command('admin/channel')
        break
      case 'echo':
        ctx.command('admin/echo')
        break
      case 'recall':
        ctx.command('admin/recall')
        break
      case 'user':
        ctx.command('admin/user')
        break
      case 'usage':
        ctx.command('admin/user/usage')
        break
      case 'timer':
        ctx.command('admin/user/timer')
        break
    }
  })
}
