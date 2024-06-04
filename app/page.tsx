import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { URL } from './config';

const title = 'Words Game';
const description = 'Words Game by J.';
const image = `${URL}/game_22.jpg`;

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Previous ⏪️'
    },
    {
      label: 'Check word 🔎️'
    },
    {
      label: 'Next ⏩️'
    }
  ],
  image: { 
    src: image, 
    aspectRatio: '1:1' 
  },
  postUrl: `${URL}/api/frame`,
  input: { 
    text: 'Your word...' 
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
