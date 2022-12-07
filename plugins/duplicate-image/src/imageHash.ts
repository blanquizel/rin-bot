import { Context, Session } from 'koishi'
import { phash } from './sharpPhash';


import { DuplicateImageDatabase as DuplicateImage } from './database';


export async function checkHash(ctx: Context, session: Session, hash: string) {
    const platform = session.platform;
    const channel = session.channelId;
    return await ctx.database.get('duplicate_image', { platform, channel, hash });
}

export async function imageHash(imageBuffer: Buffer): Promise<string> {
    const hash = phash(imageBuffer, 16);
    return hash;
}

export async function imageDuplicate(ctx: Context, session: Session, row: DuplicateImage): Promise<void> {
    row.count += 1;
    if(row.id){
        await ctx.database.upsert('duplicate_image', [row]);
    }else{
        await ctx.database.create('duplicate_image', row);
    }
}
