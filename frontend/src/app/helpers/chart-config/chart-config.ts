import { ChartData, ChartOptions } from 'chart.js';

// Chart-class for presenting the delay statistics
export const chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
        {
            label: 'Pünktlich (%)',
            data: [],
            backgroundColor: 'green',
        },
        {
            label: 'Leicht verspätet (%)',
            data: [],
            backgroundColor: 'yellow',
        },
        {
            label: 'Verspätet (%)',
            data: [],
            backgroundColor: 'orange',
        },
        {
            label: 'Deutlich verspätet (%)',
            data: [],
            backgroundColor: 'red',
        },
    ],
};

export const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        tooltip: {
            enabled: true,
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Route',
            },
        },
        y: {
            title: {
                display: true,
                text: 'Prozent (%)',
            },
            beginAtZero: true,
        },
    },
};
