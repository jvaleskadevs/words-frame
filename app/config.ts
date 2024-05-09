const LOCALHOST = 'http://localhost:3000';
const DOMAIN_URL = 'https://words-frame.vercel.app';
export const URL: string = process.env.NODE_ENV === 'development' ? LOCALHOST : DOMAIN_URL;
