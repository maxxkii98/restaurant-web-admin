<script setup lang="ts">
import { ref } from 'vue';
import { computed } from 'vue';
import { getPrimary, getLightborder,getTextGrey100 } from '@/utils/UpdateColors';
const select = ref('March 2023');
const items = ref(['March 2023', 'April 2023', 'May 2023']);

/* Chart */
const chartOptions = computed(() => {
    return {
        series: [
    {
        name: "ธนาคารไทยพาณิชย์ (SCB)",
        data: [1000000, 1200000, 1500000, 1300000, 1600000, 1400000, 1700000, 1800000, 1750000, 1900000, 2000000]
    },
    {
        name: "ธนาคารกสิกรไทย (KBank)",
        data: [900000, 1100000, 1300000, 1250000, 1500000, 1350000, 1450000, 1550000, 1500000, 1700000, 1800000]
    },
    {
        name: "ธนาคารกรุงไทย (KTB)",
        data: [800000, 950000, 1000000, 1100000, 1050000, 1150000, 1200000, 1250000, 1350000, 1450000, 1500000]
    },
],


        chart: {
            fontFamily: `inherit`,
            foreColor: "#adb0bb",
            height: 250,
            type: "line",
            toolbar: {
                show: false,
            },
            offsetX: -5,
            stacked: true
        },

        legend: {
            show: false,
        },
        stroke: {
            width: 2,
        },
        
        grid: {
            borderColor: getLightborder.value, 
            
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: false,
                    
                }
                
            },
            padding: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
                
            },
        },
        colors: [getPrimary.value, "#5AC8FA"],
        fill: {
            type: "gradient",
            gradient: {
                shade: "dark",
                gradientToColors: ["#6993ff"],
                shadeIntensity: 1,
                type: "horizontal",
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100, 100, 100],
                
            },
        },
        markers: {
            size: 0,
        },
        xaxis: {
            labels: {
                show: true,
                style: {
                    colors: getTextGrey100.value,
                }
            },
            type: 'category',
            
            categories: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov"
            ],
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
            
        },
        
        yaxis: {
            labels: {
                show: false,
            },
            formatter: (value: number) => {
                    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                },
            
        },
        tooltip: {
            theme: "dark",
            y: {
                formatter: (value: number) => {
                    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                },
            },
        },
    };
});
</script>

<template>
    <v-card elevation="10">
        <v-card-text class="position-relative pb-3">
            <div class="d-sm-flex justify-space-between d-block align-center">
                <div>
                    <h5 class="text-h4 mb-1 font-weight-semibold">
                        This Month Revenue
                    </h5>
                    <div class="text-subtitle-1 text-grey100 pb-1 font-weight-medium">Payment received across all channels
                    </div>
                </div>
                <div class="my-sm-0 my-3">
                    <v-select v-model="select" :items="items" variant="outlined" density="compact" hide-details></v-select>
                </div>
            </div>
            <div>
                <apexchart type="line" class="netsell" height="250" :options="chartOptions" :series="chartOptions.series"> </apexchart>
            </div>

        </v-card-text>
    </v-card>
</template>

