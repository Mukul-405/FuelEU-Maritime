const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
    // Routes
    async getRoutes() {
        const res = await fetch(`${API_BASE_URL}/routes`);
        return res.json();
    },
    async createRoute(data: any) {
        const res = await fetch(`${API_BASE_URL}/routes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    // Banking
    async getBankBalance(vesselName: string) {
        const res = await fetch(`${API_BASE_URL}/banking/${vesselName}`);
        return res.json();
    },
    async bankValue(vesselName: string, amount: number) {
        const res = await fetch(`${API_BASE_URL}/banking/bank`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vesselName, amount }),
        });
        return res.json();
    },

    // Pools
    async getPools() {
        const res = await fetch(`${API_BASE_URL}/pools`);
        return res.json();
    },
    async createPool(name: string, vessels: string[]) {
        const res = await fetch(`${API_BASE_URL}/pools`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, vessels }),
        });
        return res.json();
    }
};
