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
            <h1>Welcome to Next.js!</h1>
            <div id="root"></div>
        </div>
    );
};

export default HomePage;
