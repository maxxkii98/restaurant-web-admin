<template>
    <v-row>
        <!-- Button Alignment -->
        <v-col cols="12" class="d-flex justify-end">
            <v-dialog v-model="dialog" max-width="500">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props" rounded="pill">
                        <v-icon class="mr-2">mdi-plus</v-icon>Add Expense List
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
                                <v-col cols="12">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.name"
                                        label="Expense List Name"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                        variant="outlined"
                                        hide-details
                                        v-model="editedItem.remark"
                                        label="Remark"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <div class="pa-4 d-flex justify-end gap-2">
                        <v-spacer></v-spacer>
                        <v-btn @click="close" class="bg-error px-3 rounded-pill">Cancel</v-btn>
                        <v-btn color="primary" :disabled="!editedItem.name.trim()" class="px-3 rounded-pill" @click="save">
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
                                <th class="text-subtitle-1 font-weight-semibold">Name</th>
                                <th class="text-subtitle-1 font-weight-semibold">Remark</th>
                            </tr>
                        </thead>
                        <tbody class="font-prompt font-normal">
                            <tr v-for="item in paginatedItems" :key="item._id">
                                <td class="text-subtitle-1">{{ item.name }}</td>
                                <td class="text-subtitle-1">{{ item.remark }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                    <div class="text-center pt-2 mb-3 px-3">
                        <v-pagination v-model="pagination" :length="totalPages"></v-pagination>
                        <v-text-field
                            :model-value="itemsPerPage"
                            class="pa-2"
                            label="Items per page"
                            type="number"
                            min="1"
                            max="15"
                            hide-details
                            @update:model-value="itemsPerPage = parseInt($event, 10)"
                        ></v-text-field>
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

// Interfaces
interface ExpenseList {
    _id: string;
    name: string;
    remark: string;
}

// Data references
const expenseLists = ref<ExpenseList[]>([]);
const valid = ref(true);
const dialog = ref(false);
const itemsPerPage = ref(10);
const pagination = ref(1);
const editedIndex = ref(-1);

const editedItem = ref<ExpenseList>({
    _id: "",
    name: "",
    remark: "",
});

// Fetch Expense Lists
const fetchExpenseLists = async () => {
    try {
        const response = await axiosInstance.get<ExpenseList[]>(API_PATH.GET_EXPENSE_LIST);
        expenseLists.value = response.data;
    } catch (error) {
        console.error("Error fetching expense lists:", error);
    }
};

// Computed properties
const paginatedItems = computed(() => {
    const start = (pagination.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return expenseLists.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(expenseLists.value.length / itemsPerPage.value);
});

// Save Expense List
const save = async () => {
    try {
        if (!editedItem.value.name.trim()) {
            throw new Error("Invalid input: Expense list name is required.");
        }

        const payload = {
            name: editedItem.value.name.trim(),
            remark: editedItem.value.remark.trim(),
        };

        if (editedIndex.value > -1) {
            const response = await axiosInstance.put(
                `${API_PATH.ADD_EXPENSE_LIST}/${editedItem.value._id}`,
                payload
            );
            Object.assign(expenseLists.value[editedIndex.value], response.data);
        } else {
            const response = await axiosInstance.post(API_PATH.ADD_EXPENSE_LIST, payload);
            expenseLists.value.push(response.data);
        }
        close();
    } catch (error) {
        // console.error("Error saving expense list:", error.response?.data || error.message);
    }
};

// Reset and close form
const close = () => {
    dialog.value = false;
    setTimeout(() => {
        editedItem.value = {
            _id: "",
            name: "",
            remark: "",
        };
        editedIndex.value = -1;
    }, 300);
};

const formTitle = computed(() => {
    return editedIndex.value === -1 ? "Add Expense List" : "Edit Expense List";
});

// Fetch data on mounted
onMounted(fetchExpenseLists);
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
