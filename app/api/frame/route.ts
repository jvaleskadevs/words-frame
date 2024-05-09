import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame'; 
import { NextRequest, NextResponse } from 'next/server';
import {
  init,
  validateFramesMessage,
  ValidateFramesMessageInput,
  ValidateFramesMessageOutput,
} from '@airstack/frames';
import { fromBytes } from 'viem';
import { deserializeState } from "../../lib/utils";
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
  if (!message.liked) return new NextResponse(Errors.NoValidMessage);

  const fid: number | undefined = msg?.data?.fid || undefined;
  const action = msg?.data?.frameActionBody || undefined;
  
  //console.log(toHex(action?.castId?.hash ?? ''));
  //console.log(msg);
  const state = deserializeState((action?.state ?? []) as Uint8Array);
  console.log(state);

  let image = URL;
  let game = true;
  if (action?.buttonIndex === 2) {
    const text = fromBytes(action?.inputText, 'string');
    if (text) { 
      image += WORDS.includes(text.toLowerCase()) ? '/success.png' : '/fail.png';
      game = false;
    } else {
      image = `/game_${state?.game ?? 'last'}.jpg`
    }
  } else if (action?.buttonIndex === 1) {
    state.game--;
    image = `/game_${state?.game ?? 'last'}.jpg`
  } else if (action?.buttonIndex === 3) {
    state.game++;
    image = `/game_${state?.game ?? 'last'}.jpg`
  } else {
    image = `/game_${state?.game ?? 'last'}.jpg`
  }
 
  return new NextResponse(getFrameHtmlResponse({
    buttons: [
      {
        label: 'Previous ⏪️'
      },
      {
        label: game ? 'Check word 🔎️' : 'Back 🔙️'
      },
      {
        label: 'Next ⏩️'
      }
    ],
    image: { 
      src: image, 
      aspectRatio: '1:1' 
    },
    input: game ? { text: 'Your word...' } : undefined,
    postUrl: `${URL}/api/frame`,
    state: {
      game: state?.game ?? 0
    }
  }));
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
