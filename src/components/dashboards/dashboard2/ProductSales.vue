
<script setup lang="ts">
import { ref } from 'vue';
import { computed } from 'vue';
import { getPrimary, getLightborder,getTextGrey100 } from '@/utils/UpdateColors';
import { DotsVerticalIcon } from 'vue-tabler-icons';
import { Icon } from '@iconify/vue';
const items = ref([
    { title: "Action" },
    { title: "Another action" },
    { title: "Something else here" },
]);

/* Chart */
const chartOptions = computed(() => {
    return {
        series: [
            {
                name: "Test Results",
                data: [13, 15, 14, 17, 16, 19, 17],
            },
        ],
        chart: {
            height: 240,
            type: "area",
            fontFamily: `inherit`,
            foreColor: "#626b81",
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        grid: {
            borderColor: getLightborder.value,
            strokeDashArray: 4,
            strokeWidth: 1,
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
        },
        colors: [getPrimary.value],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity:0,
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [20,180],
            },
        },
        stroke: {
            curve: "smooth",
            width: "2",
        },
        xaxis: {
            categories: ["18:00", "19:00", "20:00", "21:00", "21:00", "23:00"],
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                show: false,
                style: {
                    colors: getTextGrey100.value,
                }
            },
        },
        tooltip: {
            theme: "dark",
        },
    };
});

</script>
<template>
    <v-card elevation="10">
        <v-card-item>
            <div class="d-flex align-center justify-space-between">
                <div>
                    <h5 class="text-h5 mb-1 font-weight-semibold">Product Sales</h5>
                </div>
                <div>
                    <v-menu bottom left>
                        <template v-slot:activator="{ props }">
                            <v-btn icon color="inherit" v-bind="props" flat>
                                <DotsVerticalIcon stroke-width="1.5" size="24" class="text-grey100" />
                            </v-btn>
                        </template>
                        <v-list density="compact">
                            <v-list-item v-for="(item, i) in items" :key="i" :value="i">
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>
            </div>
            <div>
                <apexchart type="area" height="240" :options="chartOptions" :series="chartOptions.series"> </apexchart>
                <div class="d-flex align-center mt-2 gap-4">
                    <div class="d-flex align-center">
                        <v-avatar class="bg-lightprimary me-4">
                            <Icon icon="solar:user-circle-linear" class="text-primary" width="24" height="24"/>
                        </v-avatar>
                        <div>
                            <h6 class="text-h6 font-weight-semibold d-flex align-center">20202020<v-chip color="success" class="bg-lightsuccess ml-1" variant="outlined" size="x-small">+12%</v-chip></h6>
                            <p class="text-subtitle-1 text-grey100 font-weight-medium">รายรับทังหมด</p>
                        </div>
                    </div>
                </div>
            </div>
        </v-card-item>
    </v-card>
</template>