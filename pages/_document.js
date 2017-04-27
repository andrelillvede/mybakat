import Document, {Head, Main, NextScript} from 'next/document';
import flush from 'styled-jsx-postcss/server'

export default class MyDocument extends Document {
  static getInitialProps({renderPage}) {
    const {html, head} = renderPage();
    const styles = flush();
    return {html, head, styles};
  }

  render() {
    return (
      <html>
        <Head>
          <link href="https://fonts.googleapis.com/css?family=Montserrat|Raleway" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css?family=Playfair+Display|Noto+Serif" rel="stylesheet" />

          <link rel="apple-touch-icon" sizes="180x180" href="/static/favicons/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon-16x16.png" />
          <link rel="manifest" href="/static/favicons/manifest.json" />
          <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#5bbad5" />
          <link rel="shortcut icon" href="/static/favicons/favicon.ico" />
          <meta name="msapplication-config" content="/static/favicons/browserconfig.xml" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            {
              `
             * {
               box-sizing: border-box;
             }
             html {
               font-family: Raleway, sans-serif;
               font-size: calc(12px + 9 * ( (100vw - 420px) / 860));
             }

             @media screen and (max-width: 420px) {
               html {
                 font-size: 12px;
               }
             }

             @media screen and (min-width: 1280px) {
               html {
                 font-size: 21px;
               }
             }
             body { margin: 0 } /* custom! */
           `
            }
          </style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
