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
import { GAMES, TOTAL_GAMES } from '../../words';

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
  
  let game = state?.game ?? 'last';
  let words = state?.words ?? [];

  let image = '';
  let isResolving = true;
  if (action?.buttonIndex === 2) {
    const text = fromBytes(action?.inputText, 'string').toLowerCase();
    if (text) { 
      if (GAMES[game].includes(text)) {
        words.push(text);
        image = words.length === GAMES[game].length ? '/solved.png' : '/success.png'; 
      } else {
        image = '/fail.png';
      }
      isResolving = false;
    } else {
      image = `/game_${game}.jpg`;
    }
  } else if (action?.buttonIndex === 1) {
    game = game === 0 ? 0 : game - 1;
    words = [];
    image = `/game_${game}.jpg`;
  } else if (action?.buttonIndex === 3) {
    game = game === TOTAL_GAMES ? TOTAL_GAMES : game + 1;
    words = [];
    image = `/game_${game}.jpg`;
  } else {
    image = `/game_${game}.jpg`;
  }
 
  return new NextResponse(getFrameHtmlResponse({
    buttons: [
      {
        label: 'Previous ⏪️'
      },
      {
        label: !isResolving ? 'Check word 🔎️' : 'Back 🔙️'
      },
      {
        label: 'Next ⏩️'
      }
    ],
    image: { 
      src: URL + image, 
      aspectRatio: '1:1' 
    },
    input: !isResolving ? { text: 'Your word...' } : undefined,
    postUrl: `${URL}/api/frame`,
    state: {
      game,
      words
    }
  }));
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
