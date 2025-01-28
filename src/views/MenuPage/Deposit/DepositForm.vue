<script setup lang="ts">
import { ref } from 'vue';
const select = ref('select');
const gender = ref(['Company1', 'Company2']);
const inline = ref(null);
const country = ref(['USA', 'United Kingdom', 'India', 'Srilanka']);
</script>
<template>
    <v-row>
        <v-col cols="12" lg="12">
    <v-alert variant="tonal" type="warning" color="primary" class="mb-6"> Manual transaction</v-alert>

    <v-row>
        <v-col cols="12" md="6">
            <v-label class="mb-2 font-weight-medium" for="sg">Select Company</v-label>
            <v-select 
                :items="gender" 
                item-title="company" 
                id="sg" 
                item-value="abbr" 
                return-object 
                single-line 
                variant="outlined" 
                placeholder="Choose a company">
            </v-select>
        </v-col>
        <v-col cols="12" md="6">
            <v-label class="mb-2 font-weight-medium" for="ln">Fee (percentage)</v-label>
            <v-text-field 
                variant="outlined" 
                color="primary" 
                id="ln" 
                placeholder="Enter fee percentage">
            </v-text-field>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12" md="6">
            <v-label class="mb-2 font-weight-medium" for="ct">Amount</v-label>
            <v-text-field 
                variant="outlined" 
                color="primary" 
                id="ct" 
                placeholder="Enter transaction amount">
            </v-text-field>
        </v-col>
    </v-row>

    <v-btn color="error" class="mr-3" rounded="pill">Cancel</v-btn>
    <v-btn color="primary" rounded="pill">Submit</v-btn>
</v-col>
    </v-row>
</template>
