import { Session } from 'koishi'
import dayjs from 'dayjs'

import { Game, Pool, Card, GaCha } from './base';

const r3 = ['芬', '香草', '翎羽', '玫兰莎', '卡缇', '米格鲁', '克罗丝', '炎熔', '芙蓉', '安塞尔', '史都华德', '梓兰', '空爆', '月见夜', '斑点', '泡普卡'];
const r4 = ['夜烟', '远山', '杰西卡', '流星', '白雪', '清道夫', '红豆', '杜宾', '缠丸', '霜叶', '慕斯', '砾', '暗索', '末药', '调香师', '角峰', '蛇屠箱',
    '古米', '深海色', '地灵', '阿消', '猎蜂', '格雷伊', '苏苏洛', '桃金娘', '红云', '梅', '安比尔', '宴', '刻刀', '波登可', '卡达', '孑', '酸糖',
    '芳汀', '泡泡', '杰克', '松果', '豆苗', '深靛', '罗比菈塔', '褐果'];
const r5 = ['白面鸮', '凛冬', '德克萨斯', '芙兰卡', '拉普兰德', '幽灵鲨', '蓝毒', '白金', '陨星', '天火', '梅尔', '赫默', '华法琳', '临光',
    '红', '雷蛇', '可颂', '普罗旺斯', '守林人', '崖心', '初雪', '真理', '空', '狮蝎', '食铁兽', '夜魔', '诗怀雅', '克劳克斯', '星极',
    '送葬人', '槐虎', '苇草', '布洛卡', '灰喉', '哞', '惊蛰', '慑砂', '巫恋', '极境', '石棉', '月禾', '莱恩哈特', '断崖', '蜜蜡',
    '贾维', '安哲拉', '燧石', '四月', '奥斯塔', '絮雨', '卡夫卡', '爱丽丝', '乌有', '熔泉', '赤冬', '绮良', '羽毛笔', '桑葚', '灰豪',
    '蚀清', '极光', '夜半', '夏栎', '风丸', '洛洛', '掠风', '濯尘芙蓉', '承曦格雷伊'];
const r6 = ['能天使', ' 推进之王', '伊芙利特', '艾雅法拉', '安洁莉娜', '闪灵', '夜莺', '星熊', '塞雷娅', '银灰', '斯卡蒂', '陈', '黑', '赫拉格',
    '麦哲伦', '莫斯提马', '煌', '刻俄柏', '风笛', '傀影', '温蒂', '早露', '铃兰', '棘刺', '森蚺', '史尔特尔', '瑕光', '泥岩', '山', '空弦',
    '嵯峨', '异客', '凯尔希', '卡涅利安', '帕拉斯', '水月', '琴柳', '远牙', '焰尾', '灵知', '老鲤', '澄闪', '菲亚梅塔', '号角', '艾丽妮',
    '黑键', '多萝西'];


const pickup: Pool = {
    name: '沙洲引路人',
    isFes: false,
    levels: ['3★', '4★', '5★', '6★'],
    probability: {
        '3★': 40,
        '4★': 50,
        '5★': 8,
        '6★': 2,
    },
    cards: {
        '3★': r3,
        '4★': r4,
        '5★': r5,
        '6★': r6
    },
    pickup: {
        '5★': ['白面鸮', '承曦格雷伊'],
        '6★': ['多罗西']
    }
}

const standard: Pool = {
    name: '标准寻访',
    isFes: false,
    levels: ['3★', '4★', '5★', '6★'],
    probability: {
        '3★': 40,
        '4★': 50,
        '5★': 8,
        '6★': 2,
    },
    cards: {
        '3★': r3,
        '4★': r4,
        '5★': r5,
        '6★': r6,
    },
    pickup: {
        '5★': ['白金', '夜魔', '燧石'],
        '6★': ['塞雷娅', '煌']
    }
}

const data: Game = {
    name: 'ark-night',
    currentPool: ['standard', 'pickup'],
    pools: {
        'standard': standard,
        'pickup': pickup,
    },
    getPool: function (poolName: string) {
        if (this.pools.hasOwnProperty(poolName)) {
            return this.pools[poolName];
        }
        return 'no match pool';
    },
}

export class MRFZ extends GaCha {
    readonly data: Game;
    readonly username: String;
    readonly timestamp: number;

    constructor(session: Session) {
        super();
        this.data = data;
        this.username = session.author.nickname === '' ? session.author.username : session.author.nickname;
        this.timestamp = session.timestamp;
    }
    draw(pool: Pool, minLv?: number): Card {

        let gacha: number = Math.floor(Math.random() * 100) + 1;
        let cardLv: string | null = null;
        let lvIdx = 0;

        if (minLv) {
            let min = 0;
            for (let i = 0; i < minLv; i++) {
                min += pool.probability[pool.levels[i]];
            }
            gacha = Math.max(gacha, min);
        }

        for (; lvIdx < pool.levels.length; lvIdx++) {
            const _level = pool.levels[lvIdx];
            const probability = pool.probability[_level];
            if (gacha <= probability) {
                cardLv = _level;
                break;
            } else {
                gacha -= probability;
            }
        }
        if (pool.pickup.hasOwnProperty(cardLv)) {
            let gacha: number = Math.floor(Math.random() * 100) + 1;
            if (gacha >= 50) {
                const cards = pool.pickup[cardLv];
                const len = cards.length;
                const idx = Math.floor(Math.random() * len);

                return {
                    cardLv: cardLv,
                    cardText: cards[idx],
                    cardLvIdx: lvIdx,
                    isProtect: minLv === undefined ? false : true,
                    isPickup: true
                }
            }
        }
        const cards = pool.cards[cardLv];
        const len = cards.length;
        const idx = Math.floor(Math.random() * len);

        return {
            cardLv: cardLv,
            cardText: cards[idx],
            cardLvIdx: lvIdx,
            isProtect: minLv === undefined ? false : true,
            isPickup: false
        }
    }

    single(poolName: string = 'standard'): string {

        const curPool: Pool | string = this.data.getPool(poolName);
        if (typeof curPool === 'string') {
            return curPool;
        }

        let result = `${this.username}于${dayjs(this.timestamp).format('YYYY-MM-DD HH:mm:ss')}在卡池《${curPool.name}》中抽取到：`;

        const card = this.draw(curPool);

        return result += `${card.cardText}(${card.cardLv}${card.isPickup ? ' Pick Up!' : ''})`;
    }

    consecutive(poolName: string = 'standard', count = 10, useMin = false) {

        const curPool: Pool | string = this.data.getPool(poolName);
        if (typeof curPool === 'string') {
            return curPool;
        }

        const cards = [];

        const len = curPool.levels.length

        const record: number[] = new Array(len).fill(0);
        for (let i = 0; i < count; i++) {
            // console.log(record);
            if (i === count - 1 && useMin) {
                if (record[len - 2] < 1 && record[len - 1] < 1) {
                    const card = this.draw(curPool, record.length - 1);
                    cards.push(card);
                    record[card.cardLvIdx]++;
                }
            } else {
                const card = this.draw(curPool);
                cards.push(card);
                record[card.cardLvIdx]++;
            }
        }

        let result = `${this.username}于${dayjs(this.timestamp).format('YYYY-MM-DD HH:mm:ss')}在卡池《${curPool.name}》中抽取到：`;
        cards.forEach(card => {
            if (card.isProtect) {
                result += `${card.cardText}(${card.cardLv}${card.isPickup ? ' Pick Up!' : ''} 保底)，`;
            } else {
                result += `${card.cardText}(${card.cardLv}${card.isPickup ? ' Pick Up!' : ''})，`;
            }
        })

        return result.slice(0, -1);;
    }
}
