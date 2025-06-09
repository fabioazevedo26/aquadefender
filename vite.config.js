import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


const ESP32_IP_ADDRESS = 'esp32-monitoramento.local';
const ESP32_HTTP_URL = `http://${ESP32_IP_ADDRESS}`; 
const ESP32_WS_URL = `ws://${ESP32_IP_ADDRESS}:81`;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
