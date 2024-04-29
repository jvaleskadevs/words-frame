import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import {
  init,
  validateFramesMessage,
  ValidateFramesMessageInput,
  ValidateFramesMessageOutput,
} from '@airstack/frames';
import { toHex } from 'viem';
import { URL } from '../../config';
import { Errors } from '../../errors';

init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY ?? '');

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: ValidateFramesMessageInput = await req.json();
  const { isValid, message } = await validateFramesMessage(body);
  
  if (!isValid) return new NextResponse(Errors.NoValidMessage);

  const fid: number | undefined = message?.data?.fid || undefined;
  const action = message?.data?.frameActionBody || undefined;
  
  console.log(toHex(action?.castId?.hash ?? ''));
  
  const text = action?.inputText?.[0] || '';
 
  if (action?.buttonIndex === 1) {
    console.log(fid);
  }
 
  return new NextResponse(getFrameHtmlResponse({
    buttons: [
      {
        label: 'Press me'
      },
      {
        action: 'link',
        label: 'View J. Valeska',
        target: 'https://warpcast.com/@j-valeska'
      }
    ],
    image: {
      src: `${URL}/intro.png`,
      aspectRatio: '1:1'
    },
    postUrl: `${URL}/api/frame`/*,
    state: {
      page: 0,
      time: new Date().toISOString()
    }*/
  }));
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
