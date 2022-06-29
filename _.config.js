// 使用js配置替代默认的yml
const { defineConfig } = require('koishi');

require('dotenv').config();

module.exports = defineConfig({
  prefix: '-',
  nickname: ['rin-bot'],
  port: 5140,
  maxPort: 5149,
  logger: {
    levels: { command: 3 },
    showTime: 'YYYY-MM-dd hh:mm:ss',
    showDiff: false,
  },
  help: { hidden: true, shortcut: false }, autoAssign: true,
  // autoAuthorize: session => {
  //   if (secret.admin.includes(session.uid)) return 5
  //   else return 1
  // },
  plugins: {
    './koishi.custom': {},

    'adapter-onebot': {
      bots: [
        {
          selfId: process.env.BOT_SELFID,
          password: process.env.BOT_PASSWORD,
          token: process.env.BOT_TOKEN,
          endpoint: process.env.BOT_ENDPOINT,
          timeout: 5,
          protocol: 'ws',
          disabled: false,
        }
      ],
      path: process.env.BOT_PATH,
      secret: process.env.BOT_SECRET
    },
    'database-mysql': {
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },

    'admin': {},
    'manager': {},
    'status': {},
    'echo': {},
    'chat': {},
    'sandbox': {},
    'locales': {},
    'rate-limit': {},
    'dataview': {},
    'repeater': {},
    'console': {}
    // 'schedule': {},
    // 'teach': { prefix: '->' },

    // Web console.
  }
});
