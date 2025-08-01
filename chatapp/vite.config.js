import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import socketIoPlugin from "./plugins/socket.io.plugin";
import socketEvents from "./socket_event";
import fs from "fs"; // fsモジュールをインポート

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // SSL証明書の存在確認
  const sslKeyPath = "/etc/ssl/private.key";
  const sslCertPath = "/etc/ssl/certificate.crt";
  const httpsConfig = fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)
    ? {
        key: fs.readFileSync(sslKeyPath),
        cert: fs.readFileSync(sslCertPath)
      }
    : false;

  return {
    plugins: [vue(), socketIoPlugin({ socketEvents })],
    server: {
      host: true,
      port: parseInt(env.PORT) || 3000,
      strictPort: true,
      https: httpsConfig // 証明書が存在しない場合はHTTPで起動
    }
  };
});