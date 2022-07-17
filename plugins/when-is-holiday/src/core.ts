import { Context } from 'koishi';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
dayjs.extend(dayOfYear);

type Holiday = {
    name: string;
    start: string;
    end: string;
}

const weekDay = ['一', '二', '三', '四', '五', '六', '日']

const year2022: Holiday[] = [
    {
        name: '元旦',
        start: '2022-01-01',
        end: '2022-01-03',
    },
    {
        name: '春节',
        start: '2022-01-31',
        end: '2022-02-06',
    },
    {
        name: '清明节',
        start: '2022-04-03',
        end: '2022-04-05',
    },
    {
        name: '劳动节',
        start: '2022-04-30',
        end: '2022-05-04',
    },
    {
        name: '端午节',
        start: '2022-06-03',
        end: '2022-06-05',
    },
    {
        name: '中秋节',
        start: '2022-09-10',
        end: '2022-09-12',
    },
    {
        name: '国庆节',
        start: '2022-10-01',
        end: '2022-10-07',
    }
];

const data = {
    "year-2022": year2022
}

export function core(ctx: Context) {

    ctx.command('剩余假期')
        .userFields(['name'])
        .action(() => {
            const cur = new Date();
            const year = dayjs(cur).year();

            let str = `今天是${dayjs(cur).format('YYYY年MM月DD日')}，星期${weekDay[dayjs(cur).day()]}。`;
            const holidays = data['year-' + year];
            holidays.forEach((holiday: Holiday) => {
                if (dayjs(cur).isBefore(dayjs(holiday.start))) {
                    const duration = dayjs(holiday.start).dayOfYear() - dayjs(cur).dayOfYear();

                    str += `距离${holiday.name}（${dayjs(holiday.start).format('YYYY年MM月DD日')}）还有${duration}天,`;
                }
            })
            str += '享受剩余的假日吧！';
            return str;
        })
}
