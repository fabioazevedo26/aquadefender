import { Radar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export const radarLabels = ['Zona Central', 'Zona Esquerda', 'Zona Direita'];

export const initialChartData = {
    labels: radarLabels,
    datasets: [
        {
            label: 'Distância Percebida (cm)',
            data: [0, 0, 0],
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: 'rgb(75, 192, 192)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(75,192,192,1)'
        }
    ]
};

export const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top'
        },
        title: {
            display: true,
            text: 'Radar - Monitoramento de Proximidade ESP32'
        }
    },
    scales: {
        r: {
            angleLines: {
                display: true
            },
            suggestedMin: 0,
            suggestedMax: 100
        }
    }
};

export default function RadarChart({chartData}) {
    return <Radar data={chartData} options={chartOptions} />
    
}
