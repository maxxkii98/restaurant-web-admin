export interface MakeReport {
    _id?: string; // ใช้ "?" เพราะ `_id` จะมีค่าเมื่อมาจาก backend
    round: string;
    product: string;
    stock: number;
    saleAmount: number;
    buyAmount: number;
    addOnAmount: number;
    trialAmount: number;
    voucherAmount: number;
    account: {
        name: string;
        cashAmount: number;
    };
    client: {
        register: number;
        active: number;
    };
}
