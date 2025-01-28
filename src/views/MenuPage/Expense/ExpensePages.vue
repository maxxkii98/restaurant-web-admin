<template>
    <v-row>
        <!-- Button Alignment -->
        <v-col cols="12" class="d-flex justify-end">
            <v-dialog v-model="dialog" max-width="500">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props" rounded="pill">
                        <v-icon class="mr-2">mdi-plus</v-icon>Add Expense
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
                                <v-col cols="12" sm="6">
                                    <div class="select-wrapper">
                                        <select id="expense-type-select" v-model="editedItem.expenseType"
                                            class="form-control">
                                            <option value="" disabled selected>Select Expense Type</option>
                                            <option v-for="expense in formattedExpenseList" :key="expense.value"
                                                :value="expense.value">
                                                {{ expense.text }}
                                            </option>
                                        </select>
                                        <svg class="select-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                            width="24" height="24">
                                            <path fill="currentColor" d="M6 9l6 6 6-6z"></path>
                                        </svg>
                                    </div>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field variant="outlined" hide-details v-model="editedItem.amount"
                                        label="Amount" type="number"
                                        @input="removeLeadingZero('amount')"></v-text-field>
                                </v-col>
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
                        <v-btn color="primary" :disabled="!editedItem.expenseType || editedItem.amount <= 0"
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
                                <th class="text-subtitle-1 font-weight-semibold">Expense Type</th>
                                <th class="text-subtitle-1 font-weight-semibold">Amount</th>
                                <th class="text-subtitle-1 font-weight-semibold">Remark</th>
                            </tr>
                        </thead>
                        <tbody class="font-prompt font-normal">
                            <tr v-for="item in paginatedItems" :key="item._id">
                                <td class="text-subtitle-1">
                                    {{ typeof item.expenseType === "object" ? item.expenseType.name : "N/A" }}
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

// Interfaces
interface Expense {
    _id: string;
    expenseType: { _id: string; name: string } | string; // Allow string for binding to <select>
    amount: number;
    remark: string;
}


interface ExpenseList {
    _id: string;
    name: string;
    remark: string;
}

// Data references
const expenses = ref<Expense[]>([]);
const expenseList = ref<ExpenseList[]>([]);
const valid = ref(true);
const dialog = ref(false);
const itemsPerPage = ref(10);
const pagination = ref(1);
const editedIndex = ref(-1);

const editedItem = ref<Expense>({
    _id: "",
    expenseType: "", // Use an empty string as the default value
    amount: 0,
    remark: "",
});

// Fetch Expense List and Expenses
const fetchExpenseList = async () => {
    try {
        const response = await axiosInstance.get<ExpenseList[]>(API_PATH.GET_EXPENSE_LIST);
        expenseList.value = response.data;
    } catch (error) {
        console.error("Error fetching expense list:", error);
    }
};

const fetchExpenses = async () => {
    try {
        const response = await axiosInstance.get<Expense[]>(API_PATH.GET_EXPENSE);

        // Log the raw response data
        // console.log("Fetched expenses data (raw):", response.data);

        expenses.value = response.data.map((expense) => ({
            ...expense,
            expenseType: expense.expenseType || { _id: "", name: "Unknown" },
        }));

        // Log the processed expenses
        // console.log("Processed expenses data:", expenses.value);
    } catch (error) {
        // console.error("Error fetching expenses:", error);
    }
};

// Computed properties
const formattedExpenseList = computed(() =>
    expenseList.value.map((item) => ({
        text: item.name,
        value: item._id,
    }))
);

const paginatedItems = computed(() => {
    const start = (pagination.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return expenses.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(expenses.value.length / itemsPerPage.value);
});

function removeLeadingZero(fieldPath: string) {
    const fields = fieldPath.split('.');
    let target: Record<string, any> = editedItem.value; // Use a generic Record

    // Traverse the path to get the target field
    for (let i = 0; i < fields.length - 1; i++) {
        if (target[fields[i]] !== undefined) {
            target = target[fields[i]];
        }
    }

    const lastField = fields[fields.length - 1];
    if (target[lastField] !== undefined) {
        // Handle string or number types
        if (typeof target[lastField] === 'string') {
            target[lastField] = target[lastField].replace(/^0+/, ''); // Remove leading zeros
        } else if (typeof target[lastField] === 'number') {
            target[lastField] = parseInt(target[lastField].toString(), 10) || 0; // Ensure a valid number
        }
    }
}
const save = async () => {
    try {
        if (!editedItem.value.expenseType || editedItem.value.amount <= 0) {
            throw new Error("Invalid input: Expense type and amount are required.");
        }

        // Ensure expenseType is an ObjectId string
        const selectedExpenseType =
            typeof editedItem.value.expenseType === "string"
                ? editedItem.value.expenseType // If it's already an ObjectId, use it
                : editedItem.value.expenseType._id; // Otherwise, extract the _id

        const payload = {
            expenseType: selectedExpenseType, // Send only the ObjectId of expenseType
            amount: Number(editedItem.value.amount), // Ensure 'amount' is a number
            remark: editedItem.value.remark.trim(), // Trim whitespace from remark
        };

        // console.log("Payload being sent to the backend:", payload); // Debugging log

        if (editedIndex.value > -1) {
            // Update existing expense
            const response = await axiosInstance.put(
                `${API_PATH.ADD_EXPENSE}/${editedItem.value._id}`,
                payload
            );
            Object.assign(expenses.value[editedIndex.value], response.data);
        } else {
            // Add new expense
            const response = await axiosInstance.post(API_PATH.ADD_EXPENSE, payload);
            expenses.value.push(response.data);
        }
        close();
    } catch (error) {
        // console.error("Error saving expense:", error.response?.data || error.message);
    }
};

// Reset and close form
const close = () => {
    dialog.value = false;
    setTimeout(() => {
        editedItem.value = {
            _id: "",
            expenseType: { _id: "", name: "" },
            amount: 0,
            remark: "",
        };
        editedIndex.value = -1;
    }, 300);
};

const formTitle = computed(() => {
    return editedIndex.value === -1 ? "Add Expense" : "Edit Expense";
});

// Fetch data on mounted
onMounted(async () => {
    await fetchExpenseList();
    await fetchExpenses();
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
