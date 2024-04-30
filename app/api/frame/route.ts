import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame'; 
import { NextRequest, NextResponse } from 'next/server';
import {
  init,
  validateFramesMessage,
  ValidateFramesMessageInput,
  ValidateFramesMessageOutput,
} from '@airstack/frames';
import { fromBytes } from 'viem';
import { URL } from '../../config';
import { Errors } from '../../errors';
import { WORDS } from '../../words';

init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY ?? '');

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: ValidateFramesMessageInput = await req.json();
  const { isValid: _, message: msg } = await validateFramesMessage(body);
  
  const { isValid, message } = await getFrameMessage(body as FrameRequest, {
    neynarApiKey: process.env.NEXT_PUBLIC_NEYNAR_API_KEY 
  }); 
  
  if (!isValid) return new NextResponse(Errors.NoValidMessage);
  //if (!message.following || !message.liked) return new NextResponse(Errors.NoValidMessage);

  const fid: number | undefined = msg?.data?.fid || undefined;
  const action = msg?.data?.frameActionBody || undefined;
  
  //console.log(toHex(action?.castId?.hash ?? ''));
  console.log(msg);

  let image = URL;
  let game = true;
  if (action?.buttonIndex === 1) {
    const text = fromBytes(action?.inputText, 'string');
    if (text) { 
      console.log(text);  
      console.log(WORDS.includes(text));
      image += WORDS.includes(text) ? '/success.png' : '/fail.png';
      game = false;
    } else {
      image += '/game.jpg';
    }
  } else {
    image += '/game.jpg';
  }
  console.log(image);
 
  return new NextResponse(getFrameHtmlResponse({
    buttons: [
      {
        label: game ? 'Check word' : 'Back'
      }
    ],
    image: { 
      src: image, 
      aspectRatio: '1:1' 
    },
    input: game ? { text: 'Your word...' } : undefined,
    postUrl: `${URL}/api/frame`
  }));
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
