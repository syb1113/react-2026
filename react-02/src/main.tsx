import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 引入 BrowserRouter 用于路由
import "./index.css";
import App from "./App.tsx";
import zhCN from "antd/locale/zh_CN";
import "dayjs/locale/zh-cn";
import { ConfigProvider } from 'antd';
/**
 * 应用入口文件
 * 使用 BrowserRouter 包裹整个应用，启用路由功能
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>
);
