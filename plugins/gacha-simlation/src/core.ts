import { Context, Logger } from 'koishi'
import { resourceUsage } from 'process';

import { data as mrfz } from './ark-knights';

export type Game = {
    /**
     * 游戏名称
     *
     * @default ''
     */
    name: string;

    /**
     * 当前卡池
     *
     * @default []
     */
    currentPool: string[];

    /**
     * 卡池一览
     *
     * @default []
     */
    pools: Record<string, Pool>

    getPool: (name: string) => Pool | string
}

export type Pool = {
    /**
     * 卡池名称
     *
     * @default ''
     */
    name: string;

    /**
     * 是否是Fes卡池
     *
     * @default false
     */
    isFes?: boolean
    /**
     * 卡池内容分级
     *
     * @default []
     */
    levels: string[]
    /**
     * 卡池内容概率
     *
     * @default {}
     */
    probability: Record<string, number>
    /**
     * 卡池内容
     *
     * @default {}
     */
    cards: Record<string, string[]>
    /**
     * 卡池内容
     *
     * @default {}
     */
    pickup: Record<string, string[]>
}


export type Config = {
    /**
     * 是否将结果持久化
     *
     * @default false
     */
    useDatabase?: boolean
}

export type Card = {
    cardText: string;
    cardLv: string;
    cardLvIdx: number;
    isProtect: boolean;
    isPickup: boolean;
}

export class Gacha {
    readonly data: Game;
    readonly log: Logger;
    readonly username: String;

    constructor(log: Logger, game: Game, username) {
        this.data = game;
        this.log = log;
        this.username = username;
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

    single(poolName: string = 'pickup'): string {

        const curPool: Pool | string = this.data.getPool(poolName);
        if (typeof curPool === 'string') {
            return curPool;
        }

        let result = `${this.username}在卡池《${curPool.name}》中抽取到：`;

        const card = this.draw(curPool);

        return result += `${card.cardText}(${card.cardLv}${card.isPickup ? ' Pick Up!' : ''})`;
    }

    consecutive(poolName: string = 'pickup', count = 10) {

        const curPool: Pool | string = this.data.getPool(poolName);
        if (typeof curPool === 'string') {
            return curPool;
        }

        const cards = [];

        const len = curPool.levels.length

        const record: number[] = new Array(len).fill(0);
        for (let i = 0; i < count; i++) {
            // console.log(record);
            if (i === count - 1) {
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

        let result = `${this.username}在卡池《${curPool.name}》中抽取到：`;
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

export function core(ctx: Context, config: Config) {
    const log = ctx.logger('gacha-simlation');

    log.debug('gacha-simlation test');

    ctx.command('mrfz-1')
        .userFields(['name'])
        .action(({ session }) => {
            const username = session.author.nickname === '' ? session.author.username : session.author.nickname;
            const gacha = new Gacha(log, mrfz, username);

            // const renderResult = comment => {
            //     return ctx.i18n.render(comment);
            // }

            return gacha.single();
        })



    ctx.command('mrfz-10')
        .userFields(['name'])
        .action(({ session }) => {
            // console.log(session);s
            const username = session.author.nickname === '' ? session.author.username : session.author.nickname;
            const gacha = new Gacha(log, mrfz, username);

            return gacha.consecutive();
        })
};
