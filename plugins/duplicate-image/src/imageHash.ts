import { Context, Session } from 'koishi'
import { imageSize } from 'image-size';

import { DuplicateImageDatabase as DuplicateImage } from './database';


export async function checkHash(ctx: Context, session: Session, hash: string) {
    const platform = session.platform;
    const channel = session.channelId;
    return ctx.database.get('duplicate_image', { platform, channel, hash });
}

export async function imageHash(input: Buffer): Promise<string> {
    const { width, height, type } = await imageSize(input);
    return '';
}

export async function imageDuplicate(ctx: Context, session: Session, row: DuplicateImage): Promise<void> {
    row.count += 1;
    await ctx.database.upsert('duplicate_image', [row]);
}
