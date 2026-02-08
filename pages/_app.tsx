import { PrivyProvider } from '@privy-io/react-auth';
import type { AppProps } from 'next/app'; // добавляем тип
import '../styles/globals.css';


export default function MyApp({ Component, pageProps }: AppProps) {
  return (

    <PrivyProvider appId="cmkn4ut3u00kijp0cvfbqbk6l"
    config={{
      loginMethods: ['wallet'],
      embeddedWallets: { 
      },
    }}>
      <Component {...pageProps} />
    </PrivyProvider>
  );
}
