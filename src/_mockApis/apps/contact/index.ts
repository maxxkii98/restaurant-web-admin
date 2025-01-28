import mock from '../../mockAdapter';

// types
export type KeyedObject = {
    [key: string]: string | number | KeyedObject | any;
};

const contacts: KeyedObject[] = [
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
        joinDate: "May 20th, 2025",
        company: "Epsilon Solutions",
        balance: "1,000,000",
        feePackage: "Premium",
        status: "Active",
    }
];

// ==============================|| MOCK SERVICES ||============================== //
mock.onGet('/api/contacts').reply(() => {
    return [200, contacts];
});

export default contacts;
