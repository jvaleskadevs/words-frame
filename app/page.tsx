import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { URL } from './config';

const title = 'Words Game';
const description = 'Words Game by J.';
const image = `${URL}/game_last.jpg`;

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Start 🔎️'
    }
  ],
  image: { 
    src: image, 
    aspectRatio: '1:1' 
  },
  postUrl: `${URL}/api/frame`,
  state: {
    game: 1
  }
});

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [image]
  },
  other: { ...frameMetadata }
}

export default function Page() {
  return <><h1>GM, Words Game is a Farcaster frame! J.</h1></>
}
