<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import API_PATH from '@/config/apiPath';

// Define User Interface
interface User {
    _id: string;
    username: string;
    password: string;
    role: string;
    createdAt: string;
}

// Declare reactive variables with types
const users = ref<User[]>([]); // Array of Users
const dialog = ref(false);
const valid = ref(true);
const itemsPerPage = ref(10);
const pagination = ref(1);
const search = ref('');

const editedIndex = ref(-1);
const editedItem = ref<User>({
    _id: '',
    username: '',
    password: '',
    role: '',
    createdAt: '',
});
const defaultItem: User = {
    _id: '',
    username: '',
    password: '',
    role: '',
    createdAt: '',
};

// Fetch all users
const fetchUsers = async () => {
    try {
        const response = await axios.get<User[]>(API_PATH.GETALL_USER); // Specify response type
        users.value = response.data; // Assign fetched data
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

// Save user (Create or Update)
const saveUser = async () => {
    try {
        const currentRole = localStorage.getItem('role');

        if (!currentRole) {
            console.error('No role data found in localStorage.');
            alert('Session expired or invalid role data. Please login again.');
            return;
        }

        // ตรวจสอบสิทธิ์ Role
        if (!['SuperUser', 'Administrator'].includes(currentRole)) {
            console.error('Permission Denied: You do not have sufficient role to perform this action.');
            alert('You do not have sufficient permission.');
            return;
        }

        // Prevent Administrator from changing their role to SuperUser
        if (
            currentRole === 'Administrator' &&
            editedItem.value.role === 'SuperUser'
        ) {
            console.error('Permission Denied: Administrators cannot assign themselves to SuperUser.');
            alert('Administrators cannot change their role to SuperUser.');
            return;
        }

        // สร้างหรืออัปเดตผู้ใช้
        if (editedIndex.value > -1) {
            // Update user
            await axios.put<User>(
                API_PATH.USER_UPDATE.replace(':id', editedItem.value._id),
                editedItem.value
            );
            Object.assign(users.value[editedIndex.value], editedItem.value);
        } else {
            // Create user
            if (!editedItem.value.role) {
                console.error('Role is required to create a user.');
                alert('Please select a role for the user.');
                return;
            }

            const response = await axios.post<User>(API_PATH.USER_CREATE, {
                ...editedItem.value,
                creatorRole: currentRole,
            });
            users.value.push(response.data);
        }
        close();
    } catch (error) {
        console.error('Error saving user:', error);
    }
};

// Delete user
const deleteUser = async (item: User) => {
    const index = users.value.findIndex(user => user._id === item._id); // Find index using _id
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            await axios.delete(API_PATH.USER_DELETE.replace(':id', item._id));
            users.value.splice(index, 1); // Remove user from array
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }
};

// Add User Function
const addUser = () => {
    editedItem.value = { ...defaultItem }; // Reset editedItem
    editedIndex.value = -1; // Reset editedIndex
    dialog.value = true; // Open dialog
};

// Dialog controls
const close = () => {
    dialog.value = false;
    setTimeout(() => {
        editedItem.value = { ...defaultItem };
        editedIndex.value = -1;
    }, 300);
};

// Editing user
const editUser = (item: User) => {
    // ดึง Role ปัจจุบันจาก localStorage
    const currentRole = localStorage.getItem('role');

    if (!currentRole) {
        console.error('No role data found in localStorage.');
        alert('Session expired or invalid role data. Please login again.');
        return;
    }

    // เงื่อนไขเพิ่มเติมสำหรับการแก้ไข Role
    if (currentRole !== 'SuperUser' && item.role === 'SuperUser') {
        console.error('Permission Denied: You cannot edit a SuperUser if you are not a SuperUser.');
        alert('You do not have permission to edit a SuperUser.');
        return;
    }

    // Administrator และ Role อื่น ไม่สามารถแก้ไขตัวเองเป็น SuperUser ได้
    if (currentRole === 'Administrator' && item.role !== 'SuperUser' && editedItem.value.role === 'SuperUser') {
        console.error('Permission Denied: Administrators cannot modify their role to SuperUser.');
        alert('Administrators cannot modify their role to SuperUser.');
        return;
    }

    editedIndex.value = users.value.findIndex(user => user._id === item._id);
    editedItem.value = { ...item };
    dialog.value = true;
};


// Computed properties
const paginatedUsers = computed(() => {
    const start = (pagination.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return users.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(users.value.length / itemsPerPage.value));

// Fetch users on mount
onMounted(fetchUsers);

</script>

<template>
    <v-row>
        <v-col cols="12" lg="4" md="6">
            <!-- <v-text-field v-model="search" label="Search Username" density="compact" hide-details
                variant="outlined"></v-text-field> -->
        </v-col>
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props" rounded="pill" class="ml-auto" @click="addUser">
            <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>Add User
        </v-btn>
    </template>
    <v-card>
        <v-card-title class="px-4 pt-6 justify-space-between d-flex align-center">
            <span class="text-h5">{{ editedIndex === -1 ? 'New User' : 'Edit User' }}</span>
            <v-btn @click="dialog = false" :ripple="false" density="compact" icon="mdi-close"></v-btn>
        </v-card-title>
        <v-card-text class="px-4">
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="editedItem.username" label="Username" variant="outlined" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="editedItem.password" label="Password" type="password" variant="outlined" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-select v-model="editedItem.role" :items="['Viewer', 'User', 'Administrator', 'SuperUser']" label="Role" variant="outlined" hide-details></v-select>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="close" class="bg-error px-3 rounded-pill">Cancel</v-btn>
            <v-btn color="primary" :disabled="editedItem.username === '' || editedItem.password === '' || editedItem.role === ''" @click="saveUser" class="px-3 rounded-pill">
                Save
            </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
        </v-col>
    </v-row>

    <perfect-scrollbar>
        <v-table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in paginatedUsers" :key="user._id">
                    <td>{{ user.username }}</td>
                    <td>{{ user.role }}</td>
                    <td>{{ new Date(user.createdAt).toLocaleString() }}</td>
                    <td>
                        <div class="d-flex align-center">
                            <!-- ปุ่ม Edit -->
                            <v-tooltip text="Edit">
                                <template v-slot:activator="{ props }">
                                    <v-btn icon flat @click="editUser(user)" v-bind="props">
                                        <v-icon color="primary">mdi-pencil</v-icon>
                                    </v-btn>
                                </template>
                            </v-tooltip>

                            <!-- ปุ่ม Delete -->
                            <v-tooltip text="Delete">
                                <template v-slot:activator="{ props }">
                                    <v-btn icon flat @click="deleteUser(user)" v-bind="props">
                                        <v-icon color="error">mdi-delete</v-icon>
                                    </v-btn>
                                </template>
                            </v-tooltip>
                        </div>
                    </td>
                </tr>
            </tbody>
        </v-table>
        <v-pagination v-model="pagination" :length="totalPages"></v-pagination>
    </perfect-scrollbar>
</template>

<style>
/* Add custom styles as needed */
</style>
