import { Global, css } from "@emotion/react";

const GlobalStyle = () => (
  <Global
    styles={css`
      *, *::before, *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      @font-face {
        font-family: 'Pretendard';
        src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
        font-weight: 100;
        font-display: swap;
     }

      html,
      body,
      * {
        font-family: "Pretendard", sans-serif;
        color: #4B4B4B;
        // 임시 스크롤 방지
        /* overflow: hidden; */
      }

      a {
      text-decoration: none;
      color: inherit;
      }

      #nprogress .bar {
        background: #364155 !important;
        height: 3px !important;
      }

      #nprogress .peg {
        box-shadow: 0 0 10px rgba(54, 65, 85, 0.6), 0 0 5px rgba(54, 65, 85, 0.6) !important;
      }
    
    `}
  />
);

export default GlobalStyle;