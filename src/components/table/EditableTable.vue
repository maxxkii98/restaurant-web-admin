<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useContactStore } from '@/stores/apps/contact';

const store = useContactStore();

onMounted(() => {
    store.fetchContacts();
});

const getContacts: any = computed(() => {
    return store.contacts;
});

const valid = ref(true);
const dialog = ref(false);
const search = ref('');
const itemsPerPage = ref(10); // Items per page
const currentPage = ref(1); // Current page
const pagination = ref(1); // Added for v-model
const pageCount = computed(() => Math.ceil(desserts.value.length / itemsPerPage.value)); // Added pageCount
const desserts = ref([
    {
        joinDate: "January 1st, 2025",
        company: "Alpha Corp",
        balance: "500,000",
        feePackage: "Standard",
        status: "Active",
    },
    {
        joinDate: "January 1st, 2025",
        company: "Alpha Corp",
        balance: "500,000",
        feePackage: "Standard",
        status: "Active",
    },
    {
        joinDate: "January 1st, 2025",
        company: "Alpha Corp",
        balance: "500,000",
        feePackage: "Standard",
        status: "Active",
    },
    {
        joinDate: "January 1st, 2025",
        company: "Alpha Corp",
        balance: "500,000",
        feePackage: "Standard",
        status: "Active",
    },
    {
        joinDate: "January 1st, 2025",
        company: "Alpha Corp",
        balance: "500,000",
        feePackage: "Standard",
        status: "Active",
    },
    {
        joinDate: "January 1st, 2025",
        company: "Alpha Corp",
        balance: "500,000",
        feePackage: "Standard",
        status: "Active",
    },
    {
        joinDate: "January 1st, 2025",
        company: "Alpha Corp",
        balance: "500,000",
        feePackage: "Standard",
        status: "Active",
    },

    {
        joinDate: "February 15th, 2025",
        company: "Beta Ltd.",
        balance: "300,000",
        feePackage: "Premium",
        status: "Inactive",
    },
    {
        joinDate: "March 10th, 2025",
        company: "Gamma Enterprises",
        balance: "750,000",
        feePackage: "Standard",
        status: "Active",
    },
    {
        joinDate: "April 5th, 2025",
        company: "Delta Inc.",
        balance: "400,000",
        feePackage: "Basic",
        status: "Inactive",
    },
    {
        joinDate: "April 5th, 2025",
        company: "Delta Inc.",
        balance: "400,000",
        feePackage: "Basic",
        status: "Inactive",
    },
    {
        joinDate: "April 5th, 2025",
        company: "Delta Inc.",
        balance: "400,000",
        feePackage: "Basic",
        status: "Inactive",
    },
    {
        joinDate: "April 5th, 2025",
        company: "Delta Inc.",
        balance: "400,000",
        feePackage: "Basic",
        status: "Inactive",
    },
    {
        joinDate: "April 5th, 2025",
        company: "Delta Inc.",
        balance: "400,000",
        feePackage: "Basic",
        status: "Inactive",
    },
    {
        joinDate: "April 5th, 2025",
        company: "Delta Inc.",
        balance: "400,000",
        feePackage: "Basic",
        status: "Inactive",
    },
    {
        joinDate: "April 5th, 2025",
        company: "Delta Inc.",
        balance: "400,000",
        feePackage: "Basic",
        status: "Inactive",
    },
    {
        joinDate: "April 5th, 2025",
        company: "Delta Inc.",
        balance: "400,000",
        feePackage: "Basic",
        status: "Inactive",
    },
    {
        joinDate: "May 20th, 2025",
        company: "Epsilon Solutions",
        balance: "1,000,000",
        feePackage: "Premium",
        status: "Active",
    },
    // Add additional entries here
]);

const editedIndex = ref(-1);
const editedItem = ref({
    joinDate: '',
    company: '',
    balance: '',
    feePackage: '',
    status: '',
});
const defaultItem = ref({
    joinDate: '',
    company: '',
    balance: '',
    feePackage: '',
    status: '',
});

// Status color mapping
const statusColorMap: Record<string, string> = {
    Active: "success", // green
    Inactive: "warning", // yellow
};

// Pagination logic
const paginatedDesserts = computed(() => {
    const start = (pagination.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return desserts.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(desserts.value.length / itemsPerPage.value);
});

// Methods
const filteredList = computed(() => {
    return desserts.value.filter((item: any) => {
        return item.company.toLowerCase().includes(search.value.toLowerCase());
    });
});

function editItem(item: any) {
    editedIndex.value = desserts.value.indexOf(item);
    editedItem.value = Object.assign({}, item);
    dialog.value = true;
}
function deleteItem(item: any) {
    const index = desserts.value.indexOf(item);
    confirm('Are you sure you want to delete this item?') && desserts.value.splice(index, 1);
}

function close() {
    dialog.value = false;
    setTimeout(() => {
        editedItem.value = Object.assign({}, defaultItem.value);
        editedIndex.value = -1;
    }, 300);
}
function save() {
    if (editedIndex.value > -1) {
        Object.assign(desserts.value[editedIndex.value], editedItem.value);
    } else {
        desserts.value.push(editedItem.value);
    }
    close();
}

// Computed Property
const formTitle = computed(() => {
    return editedIndex.value === -1 ? 'New Company' : 'Edit Company';
});
</script>

<template>
    <v-row>
        <v-col cols="12" lg="4" md="6">
            <v-text-field density="compact" v-model="search" label="Search Company" hide-details
                variant="outlined"></v-text-field>
        </v-col>
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="500">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props" rounded="pill" class="ml-auto">
                        <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>Add Company
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title class="px-4 pt-6 justify-space-between d-flex align-center">
                        <span class="text-h5">{{ formTitle }}</span>
                        <v-btn @click="dialog = false" :ripple="false" density="compact" icon="mdi-close"></v-btn>
                    </v-card-title>
                    <v-card-text class="px-4">
                        <v-form class="dialog_form" ref="form" v-model="valid" lazy-validation>
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-text-field variant="outlined" hide-details v-model="editedItem.joinDate"
                                        label="Join Date"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field variant="outlined" hide-details v-model="editedItem.company"
                                        label="Company"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field variant="outlined" hide-details v-model="editedItem.balance"
                                        label="Balance"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field variant="outlined" hide-details v-model="editedItem.feePackage"
                                        label="Fee Package"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field variant="outlined" hide-details v-model="editedItem.status"
                                        label="Status"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>

                    <div class="pa-4 d-flex justify-end gap-2">
                        <v-spacer></v-spacer>
                        <v-btn @click="close" class="bg-error px-3 rounded-pill">Cancel</v-btn>
                        <v-btn color="primary" :disabled="editedItem.company == '' || editedItem.balance == ''"
                            class="px-3 rounded-pill" @click="save">
                            Save
                        </v-btn>
                    </div>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
    <perfect-scrollbar>
        <div class="border-table">
            <v-table class="mt-10">
                <thead class="font-prompt font-bold">
                    <tr>
                        <th class="text-subtitle-1 font-weight-semibold">Join</th>
                        <th class="text-subtitle-1 font-weight-semibold">Company</th>
                        <th class="text-subtitle-1 font-weight-semibold">Balance</th>
                        <th class="text-subtitle-1 font-weight-semibold">Fee Package</th>
                        <th class="text-subtitle-1 font-weight-semibold">Status</th>
                        <th class="text-subtitle-1 font-weight-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody class="font-prompt font-normal">
                    <tr v-for="item in paginatedDesserts" :key="item.company">
                        <td class="text-subtitle-1">{{ item.joinDate }}</td>
                        <td class="text-subtitle-1">{{ item.company }}</td>
                        <td class="text-subtitle-1">{{ item.balance }}</td>
                        <td class="text-subtitle-1">{{ item.feePackage }}</td>
                        <td>
                            <v-chip rounded="pill" :color="statusColorMap[item.status]" size="small" label>
                                {{ item.status }}
                            </v-chip>
                        </td>
                        <td>
                            <div class="d-flex align-center">
                                <v-tooltip text="Edit">
                                    <template v-slot:activator="{ props }">
                                        <v-btn icon flat @click="editItem(item)" v-bind="props">
                                            <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                                        </v-btn>
                                    </template>
                                </v-tooltip>
                                <v-tooltip text="Delete">
                                    <template v-slot:activator="{ props }">
                                        <v-btn icon flat @click="deleteItem(item)" v-bind="props">
                                            <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                                        </v-btn>
                                    </template>
                                </v-tooltip>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </v-table>
            <div class="text-center pt-2 mb-3 px-3">
                <v-pagination v-model="pagination" :length="pageCount"></v-pagination>
                <v-text-field :model-value="itemsPerPage" class="pa-2" label="Items per page" type="number" min="1"
                    max="15" hide-details @update:model-value="itemsPerPage = parseInt($event, 10)"></v-text-field>
            </div>

        </div>
    </perfect-scrollbar>
</template>


<style>
/* Import Google Font */
@import url("https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;700&display=swap");

.font-prompt {
    font-family: "Prompt", sans-serif;
}
</style>
