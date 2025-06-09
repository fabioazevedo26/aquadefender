const hostName = import.meta.env.VITE_ESP32_IP_ADRESS || "esp32-monitoramento.local";
const httpPort = import.meta.env.VITE_ESP32_HTTP_URL || 80;
const wsPort = import.meta.env.VITE_ESP32_WS_URL || 81;

const httpBaseUrl = `http://${hostName}:${httpPort}`;
const wsUrl = `ws://${hostName}:${wsPort}`;


const SensorMonitor = {
    hostName,
    httpPort,
    wsPort,
    api: {
        estado: `${httpBaseUrl}/estado`,
    },
    WebSocket: {
        url: wsUrl,
    },
}

if (!import.meta.env.VITE_ESP32_IP_ADRESS) {
    console.warn("Atenção: A variável de ambiente VITE_ESP32_HOSTNAME não está definida em seu arquivo .env. Usando 'localhost' como padrão.")
}
export default SensorMonitor;