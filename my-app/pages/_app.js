import "../styles/index.css"; // 기존 글로벌 CSS 파일
import "../styles/App.css"; // 이동된 App.css 파일

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

export default MyApp;
