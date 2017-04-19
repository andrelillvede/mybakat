import Document, {Head, Main, NextScript} from 'next/document';
import flush from 'styled-jsx/server'

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
