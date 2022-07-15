import { Logger } from 'koishi'

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



export type Card = {
    cardText: string;
    cardLv: string;
    cardLvIdx: number;
    isProtect: boolean;
    isPickup: boolean;
}

export abstract class GaCha {
    readonly data: Game;
    readonly log: Logger;
    readonly username: String;
    readonly timestamp: number;

    abstract single(poolName: string) :string ;
    abstract consecutive(poolName: string, count: number, useMin: boolean) :string ;
}
