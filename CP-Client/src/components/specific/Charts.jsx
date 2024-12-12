import React from 'react'
import {Line,Doughnut} from 'react-chartjs-2'
import {Tooltip,Filler,CategoryScale,LinearScale,PointElement,LineElement,ArcElement,Legend,Chart as ChartJS, plugins, scales} from 'chart.js'
import { getLast7Days } from '../../lib/features'

ChartJS.register(Tooltip,Filler,CategoryScale,LinearScale,PointElement,LineElement,ArcElement,Legend )

    const labels=getLast7Days()

const lineChartOptions={
    responsive:true,
    plugins:{
        legend:{display:false},
        title:{display:false},
    },
    scales:{
        x:{
        // display:false
        grid:{display:false}
        },
        y:{
        // display:false
        beginAtZero:true,
        grid:{display:false}
        },
    }
}

const LineChart = ({value=[]}) => {

const data={
    labels,
    datasets:[{
        data:value,
        label:'Messages',
        fill:true,
        backgroundColor:'grey',
        borderColor:'white'
    }]
}

  return  <Line  data={data} />
}

const doughnutChartOptions={
    responsive:true,
    plugins:{
        legend:{
            display:false,
        },
        title:{
            display:false,
        },
    },
    cutout:120
};

const DoughnutChart = ({value=[],labels=[]}) => {

    const data={
        labels,
        datasets:[{
            data:value,
            borderColor:['grey','grey'],
            backgroundColor  :['#570041','#005717'],
            hoverBackgroundColor:['#9d0074','#009D29'],
            offset:20
        }]
    }

    return (
     <Doughnut  style={{zIndex:10 }} data={data} options={doughnutChartOptions} />
    )
  }

export {LineChart,DoughnutChart}
