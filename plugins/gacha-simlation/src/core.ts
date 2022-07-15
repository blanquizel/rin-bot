import { Context } from 'koishi'

import { MRFZ } from './ark-knights';

export type Config = {
    /**
     * 是否将结果持久化
     *
     * @default false
     */
    useDatabase?: boolean
}


export function core(ctx: Context, config: Config) {
    const log = ctx.logger('gacha-simlation');

    log.debug('gacha-simlation test');

    ctx.command('mrfz-1')
        .userFields(['name'])
        .action(({ session }) => {
            const gacha = new MRFZ(session);

            // const renderResult = comment => {
            //     return ctx.i18n.render(comment);
            // }

            return gacha.single();
        })



    ctx.command('mrfz-10')
        .userFields(['name'])
        .action(({ session }) => {
            // console.log(session);
            const gacha = new MRFZ(session);

            return gacha.consecutive();
        })
};
