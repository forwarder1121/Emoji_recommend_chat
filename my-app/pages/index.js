import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import App from "../src/App";

const HomePage = () => {
    useEffect(() => {
        if (typeof document !== "undefined") {
            const root = document.getElementById("root");
            if (root) {
                ReactDOM.createRoot(root).render(
                    <React.StrictMode>
                        <App />
                    </React.StrictMode>
                );
            }
        }
    }, []);

    return (
        <div>
            <h1>영어 문장을 치고 1초 기다리면 이모지를 추천하는 채팅 서비스</h1>
            <div id="root"></div>
        </div>
    );
};

export default HomePage;
