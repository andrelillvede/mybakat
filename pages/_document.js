import Document, {Head, Main, NextScript} from 'next/document';
import flush from 'styled-jsx-postcss/server'

export default class MyDocument extends Document {
  static getInitialProps({renderPage}) {
    const {html, head} = renderPage();
    const styles = flush();
    return {html, head, styles};
  }

  render() {
    const lang = this.props.__NEXT_DATA__.query.lang;
    const location = this.props.__NEXT_DATA__.props.location;

    return (
      <html lang={lang ? lang : 'sv'}>

        <Head>
          <link href="https://fonts.googleapis.com/css?family=Abhaya+Libre|Playfair+Display:400,700i" rel="stylesheet" />
          <link rel="apple-touch-icon" sizes="180x180" href="/static/favicons/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon-16x16.png" />
          <link rel="manifest" href="/static/favicons/manifest.json" />
          <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#5bbad5" />
          <link rel="shortcut icon" href="/static/favicons/favicon.ico" />
          <meta name="msapplication-config" content="/static/favicons/browserconfig.xml" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* {location.indexOf('https://staging.mybakat.se') > -1 ? <meta name="robots" content="noindex,nofollow" /> : ''} */}
          <style>
            {
              `
             * {
               box-sizing: border-box;
             }
             html {
               font-family: Abhaya Libre, sans-serif;
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

             /* Make clicks pass-through */
             #nprogress {
               pointer-events: none;
             }

             #nprogress .bar {
               background: #29d;

               position: fixed;
               z-index: 1031;
               top: 0;
               left: 0;

               width: 100%;
               height: 2px;
             }

             /* Fancy blur effect */
             #nprogress .peg {
               display: block;
               position: absolute;
               right: 0px;
               width: 100px;
               height: 100%;
               box-shadow: 0 0 10px #29d, 0 0 5px #29d;
               opacity: 1.0;

               -webkit-transform: rotate(3deg) translate(0px, -4px);
                   -ms-transform: rotate(3deg) translate(0px, -4px);
                       transform: rotate(3deg) translate(0px, -4px);
             }

             /* Remove these to get rid of the spinner */
             #nprogress .spinner {
               display: block;
               position: fixed;
               z-index: 1031;
               top: 15px;
               right: 15px;
             }

             #nprogress .spinner-icon {
               width: 18px;
               height: 18px;
               box-sizing: border-box;

               border: solid 2px transparent;
               border-top-color: #29d;
               border-left-color: #29d;
               border-radius: 50%;

               -webkit-animation: nprogress-spinner 400ms linear infinite;
                       animation: nprogress-spinner 400ms linear infinite;
             }

             .nprogress-custom-parent {
               overflow: hidden;
               position: relative;
             }

             .nprogress-custom-parent #nprogress .spinner,
             .nprogress-custom-parent #nprogress .bar {
               position: absolute;
             }

             @-webkit-keyframes nprogress-spinner {
               0%   { -webkit-transform: rotate(0deg); }
               100% { -webkit-transform: rotate(360deg); }
             }
             @keyframes nprogress-spinner {
               0%   { transform: rotate(0deg); }
               100% { transform: rotate(360deg); }
             }

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
