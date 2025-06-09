import { useState, useEffect, useRef } from 'react';
import SensorMonitor from './SensorMonitor';
import './Style.css'
import RadarChart, { initialChartData, radarLabels } from './Radar';

const ESP32RadarChart = () => {
    const [sensorStatus, setSensorStatus] = useState('Desligado');
    const [statusMessage, setStatusMessage] = useState('Conectando ao ESP32...');
    const [chartData, setChartData] = useState(initialChartData);
    const [alertTimestamps, setAlertTimestamps] = useState([]);
    const webSocketRef = useRef(null);

    useEffect(() => {
        if (!SensorMonitor.hostName) {
            setStatusMessage("Configuração: Endereço IP do ESP32 não definido.");
            setSensorStatus("Desligado");
            return;
        }

        const fetchStatus = async () => {
            try {
                const response = await fetch(SensorMonitor.api.estado);
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                const data = await response.json();

                if (data.mensagem === 'Alerta de Invasão de Privacidade!') {
                    setSensorStatus('Alerta');

                    if (statusMessage !== data.mensagem) {
                        setAlertTimestamps(prev => [...prev, new Date().toISOString()]);
                    }
                } else if (data.mensagem === 'Tudo limpo. Sensor em funcionamento.') {
                    setSensorStatus('Tudo limpo');
                } else {
                    setSensorStatus('Desconhecido');
                }
                setStatusMessage(data.mensagem);
            } catch (error) {
                console.error("Falha ao buscar estado do ESP32:", error);
                setStatusMessage('Erro ao conectar ao ESP32 ou dispositivo offline.');
                setSensorStatus('Desligado');
            }
        };

        fetchStatus();
        const intervalId = setInterval(fetchStatus, 5000);

        return () => clearInterval(intervalId);
    }, [statusMessage]);

    useEffect(() => {
        if (!SensorMonitor.hostName) return;

        const wsUrl = SensorMonitor.WebSocket.url;
        webSocketRef.current = new WebSocket(wsUrl);

        webSocketRef.current.onopen = () => {
            console.log("WebSocket conectado");
        };

        webSocketRef.current.onmessage = (event) => {
            console.log("WebSocket mensagem recebida:", event.data);
            if (typeof event.data === 'string' && event.data.toLowerCase().includes('alerta')) {
                setSensorStatus('Alerta');
                setStatusMessage(event.data);
                setAlertTimestamps(prev => [...prev, new Date().toISOString()]);
            }
        };

        webSocketRef.current.onerror = (error) => {
            console.error("WebSocket erro:", error);
        };

        webSocketRef.current.onclose = () => {
            console.log("WebSocket desconectado");
        };

        return () => {
            if (webSocketRef.current) {
                webSocketRef.current.close();
            }
        };
    }, []);

    useEffect(() => {
        let newDataPoints;
        const alertValue = 15;
        const safeValue = 70;
        const offlineValue = 0;

        switch (sensorStatus) {
            case 'Alerta':
                newDataPoints = radarLabels.map(() => alertValue);
                break;
            case 'Tudo limpo':
                newDataPoints = radarLabels.map(() => safeValue);
                break;
            case 'Desligado':
            default:
                newDataPoints = radarLabels.map(() => offlineValue);
                break;
        }

        setChartData(prevData => ({
            ...prevData,
            datasets: [
                {
                    ...prevData.datasets[0],
                    data: newDataPoints
                }
            ]
        }));

    }, [sensorStatus]);


    const FirstTimeSetupInstructions = () => (
        <div style={{ padding: '10px', border: '1px solid #ccc', margin: '10px 0', }}>
            <h4>Primeira vez usando o dispositivo?</h4>
            <p>Se o dispositivo não conectar automaticamente à sua rede Wi-Fi:</p>
            <ol>
                <li>Conecte-se à rede Wi-Fi chamada '<strong>AutoConnectAP</strong>' com a senha '<strong>password</strong>'</li>
                <li>Abra seu navegador e acesse <a href="http://192.168.4.1" target="_blank" rel="noopener noreferrer">http://192.168.4.1</a> para configurar a conexão Wi-Fi do ESP32 com a sua rede local. [cite: 16]</li>
            </ol>
            <p>Após a configuração, o dispositivo deverá conectar-se à sua rede e o monitoramento iniciará.</p>
        </div>
    );


    return (
        <div className='App'>

            <h2>AquaDefender</h2>
            <p><strong>Status Atual:</strong> {statusMessage}</p>
            <p><strong>Estado Interpretado:</strong> {sensorStatus}</p>

            {sensorStatus === 'Desligado' ? (
                <div>
                    <FirstTimeSetupInstructions />

                </div>
            ) : (
                <>
                    <div style={{ maxWidth: '500px', margin: 'auto' }}>
                        <RadarChart chartData={chartData} />
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <h4>Registro de Horários de Alerta:</h4>
                        {alertTimestamps.length === 0 ? (
                            <p>Nenhum alerta registrado.</p>
                        ) : (
                            <ul style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                {alertTimestamps.map((time, index) => (
                                    <li key={index}>{new Date(time).toLocaleString()}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ESP32RadarChart;