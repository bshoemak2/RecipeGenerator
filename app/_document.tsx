// app/_document.tsx
import { Head, Main, Html } from 'expo-router/server';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/assets/favicon.ico" type="image/x-icon" />
      </Head>
      <body>
        <Main />
      </body>
    </Html>
  );
}