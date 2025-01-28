<template>
    <v-row>
        <!-- Button Alignment -->
        <v-col cols="12" class="d-flex justify-end">
            <v-dialog v-model="dialog" max-width="500">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props" rounded="pill">
                        <v-icon class="mr-2">mdi-plus</v-icon>Make Sending
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title class="px-4 pt-6 justify-space-between d-flex align-center">
                        <span class="text-h5">{{ formTitle }}</span>
                        <v-btn @click="close" :ripple="false" density="compact" icon="mdi-close"></v-btn>
                    </v-card-title>
                    <v-card-text class="px-4">
                        <v-form class="dialog_form" ref="form" v-model="valid" lazy-validation>
                            <v-row>
                                <!-- Select Destination -->
                                <v-col cols="12" sm="6">
                                    <div class="select-wrapper">
                                        <select id="destination-select" v-model="editedItem.destination"
                                            class="form-control">
                                            <option value="" disabled selected>Select Destination</option>
                                            <option v-for="account in formattedAccountList" :key="account.value"
                                                :value="account.value">
                                                {{ account.text }}
                                            </option>
                                        </select>
                                        <svg class="select-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                            width="24" height="24">
                                            <path fill="currentColor" d="M6 9l6 6 6-6z"></path>
                                        </svg>
                                    </div>
                                </v-col>
                                <!-- Amount -->
                                <v-col cols="12" sm="6">
                                    <v-text-field variant="outlined" hide-details v-model="editedItem.amount"
                                        label="Amount" type="number"
                                        @input="removeLeadingZero('amount')"></v-text-field>
                                </v-col>
                                <!-- Remark -->
                                <v-col cols="12">
                                    <v-text-field variant="outlined" hide-details v-model="editedItem.remark"
                                        label="Remark"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <div class="pa-4 d-flex justify-end gap-2">
                        <v-spacer></v-spacer>
                        <v-btn @click="close" class="bg-error px-3 rounded-pill">Cancel</v-btn>
                        <v-btn color="primary" :disabled="!editedItem.destination || editedItem.amount <= 0"
                            class="px-3 rounded-pill" @click="save">
                            Save
                        </v-btn>
                    </div>
                </v-card>
            </v-dialog>
        </v-col>

        <!-- Table Content -->
        <v-col cols="12">
            <perfect-scrollbar>
                <div class="border-table">
                    <v-table class="mt-2">
                        <thead class="font-prompt font-bold">
                            <tr>
                                <th class="text-subtitle-1 font-weight-semibold">Destination</th>
                                <th class="text-subtitle-1 font-weight-semibold">Amount</th>
                                <th class="text-subtitle-1 font-weight-semibold">Remark</th>
                            </tr>
                        </thead>
                        <tbody class="font-prompt font-normal">
                            <tr v-for="item in paginatedItems" :key="item._id">
                                <td class="text-subtitle-1">
                                    {{ typeof item.destination === 'object' && item.destination.accountName ?
                                        item.destination.accountName : 'N/A' }}
                                </td>
                                <td class="text-subtitle-1">{{ item.amount }}</td>
                                <td class="text-subtitle-1">{{ item.remark }}</td>
                            </tr>
                        </tbody>

                    </v-table>
                    <div class="text-center pt-2 mb-3 px-3">
                        <v-pagination v-model="pagination" :length="totalPages"></v-pagination>
                        <v-text-field :model-value="itemsPerPage" class="pa-2" label="Items per page" type="number"
                            min="1" max="15" hide-details
                            @update:model-value="itemsPerPage = parseInt($event, 10)"></v-text-field>
                    </div>
                </div>
            </perfect-scrollbar>
        </v-col>
    </v-row>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axiosInstance from "@/config/axios";
import API_PATH from "@/config/apiPath";
import type { AxiosResponse } from "axios";


// Interfaces
interface Sending {
    _id: string;
    destination: { _id: string; accountName: string } | string;
    amount: number;
    remark: string;
}

interface Account {
    _id: string;
    accountName: string; // Updated to include accountName
    information: string;
}

// Data references
const sendings = ref<Sending[]>([]);
const accounts = ref<Account[]>([]);
const valid = ref(true);
const dialog = ref(false);
const itemsPerPage = ref(10);
const pagination = ref(1);
const editedIndex = ref(-1);

const editedItem = ref<Sending>({
    _id: "",
    destination: "",
    amount: 0,
    remark: "",
});

// Fetch Accounts and Sendings
const fetchAccounts = async () => {
    try {
        const response = await axiosInstance.get<Account[]>(API_PATH.ACCOUNTS);

        // Log the response data to verify the accounts are fetched
        // console.log("Fetched accounts data:", response.data);

        accounts.value = response.data;
    } catch (error) {
        console.error("Error fetching accounts:", error);
    }
};


const fetchSendings = async () => {
    try {
        const response = await axiosInstance.get<Sending[]>(API_PATH.GET_SENDINGS);
        sendings.value = response.data.map((sending) => ({
            ...sending,
            destination: typeof sending.destination === 'object'
                ? sending.destination
                : { _id: '', accountName: 'Unknown' }, // Handle missing or incorrect data
        }));
    } catch (error) {
        // console.error('Error fetching sendings:', error);
    }
};

// Computed properties
// Computed properties
const formattedAccountList = computed(() =>
    accounts.value.map((account) => ({
        text: account.accountName, // Use accountName for display
        value: account._id,
    }))
);
const paginatedItems = computed(() => {
    const start = (pagination.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return sendings.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(sendings.value.length / itemsPerPage.value);
});

function removeLeadingZero(fieldPath: string) {
    const fields = fieldPath.split(".");
    let target: Record<string, any> = editedItem.value;

    for (let i = 0; i < fields.length - 1; i++) {
        if (target[fields[i]] !== undefined) {
            target = target[fields[i]];
        }
    }

    const lastField = fields[fields.length - 1];
    if (target[lastField] !== undefined) {
        if (typeof target[lastField] === "string") {
            target[lastField] = target[lastField].replace(/^0+/, "");
        } else if (typeof target[lastField] === "number") {
            target[lastField] = parseInt(target[lastField].toString(), 10) || 0;
        }
    }
}

const save = async () => {
    try {
        if (!editedItem.value.destination || editedItem.value.amount <= 0) {
            throw new Error("Invalid input: Destination and amount are required.");
        }

        const payload = {
            destination:
                typeof editedItem.value.destination === "string"
                    ? editedItem.value.destination
                    : editedItem.value.destination._id,
            amount: Number(editedItem.value.amount),
            remark: editedItem.value.remark.trim(),
        };

        let response: AxiosResponse<Sending>; // Correctly type the Axios response

        if (editedIndex.value > -1) {
            // Update existing sending
            response = await axiosInstance.put<Sending>(
                `${API_PATH.ADD_SENDINGS}/${editedItem.value._id}`,
                payload
            );
            Object.assign(sendings.value[editedIndex.value], response.data);
        } else {
            // Add new sending
            response = await axiosInstance.post<Sending>(
                API_PATH.ADD_SENDINGS,
                payload
            );
            sendings.value.push(response.data);
        }

        // Ensure response contains the populated destination
        sendings.value = sendings.value.map((sending) =>
            sending._id === response.data._id ? response.data : sending
        );

        close();
    } catch (error) {
        console.error("Error saving sending:", error);
    }
};
const close = () => {
    dialog.value = false;
    setTimeout(() => {
        editedItem.value = {
            _id: "",
            destination: "",
            amount: 0,
            remark: "",
        };
        editedIndex.value = -1;
    }, 300);
};

const formTitle = computed(() => {
    return editedIndex.value === -1 ? "Make Sending" : "Edit Sending";
});

// Fetch data on mounted
onMounted(async () => {
    await fetchAccounts();
    await fetchSendings();
});
</script>


<style>
.form-control {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #f0eeee;
    border-radius: 5px;
}

.form-control:focus {
    outline: none;
    border-color: #3f51b5;
}

.select-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
}

.select-wrapper .form-control {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    padding-right: 2.5rem;
    width: 100%;
}

.select-wrapper .select-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #6c757d;
}
</style>