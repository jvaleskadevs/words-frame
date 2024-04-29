import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { URL } from './config';

const title = 'JFrame';
const description = 'JFrame by J.';
const image = `${URL}/intro.png`;

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Press me'
    },
    {
      action: 'link',
      label: 'View J. Valeska',
      target: 'https://warpcast.com/@j-valeska'
    }/*,
    {
      action: 'post_redirect',
      label: 'View J. Valeska'
    }*/
  ],
  image: { 
    src: image, 
    aspectRatio: '1:1' 
  },
  //input: { text: 'Some text' },
  postUrl: `${URL}/api/frame`
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
  return <><h1>GM, JFrame is a Farcaster frame! J.</h1></>
}
