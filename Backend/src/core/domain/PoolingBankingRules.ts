export interface ShipPoolMember {
    id: string;
    cb: number;
    initialCb?: number;
}

export interface PoolResult {
    pool: ShipPoolMember[];
    valid: boolean;
}

/**
 * Determines if a ship's Compliance Balance is a surplus and thus bankable.
 * @param cb The ship's Compliance Balance
 * @returns True if bankable (positive), false otherwise.
 */
export function BankSurplus(cb: number): boolean {
    return cb > 0;
}

/**
 * Creates a pool and applies Greta allocation logic to transfer surplus to deficit ships.
 * Validates that the total pool sum is >= 0 and no deficit ship exits worse.
 * @param ships An array of ships with their Compliance Balances.
 * @returns The resulting pool and whether it's valid.
 */
export function CreatePool(ships: ShipPoolMember[]): PoolResult {
    // Record initial CBs if not provided natively
    const initialShips = ships.map(ship => ({
        ...ship,
        initialCb: ship.initialCb !== undefined ? ship.initialCb : ship.cb
    }));

    // Calculate total pool sum
    const totalCbSum = initialShips.reduce((sum, ship) => sum + ship.cb, 0);

    // Deep copy to mutate during pooling
    const currentPool = initialShips.map(ship => ({ ...ship }));

    // Greedy allocation strategy
    // Sort all ships by CB in descending order
    currentPool.sort((a, b) => b.cb - a.cb);

    // Only process transfers if total pool sum is valid, but we simulate anyway 
    // to check individual deficits
    let i = 0;           // surplus provider
    let j = currentPool.length - 1; // deficit receiver

    while (i < j && currentPool[i].cb > 0 && currentPool[j].cb < 0) {
        const surplus = currentPool[i].cb;
        const deficit = Math.abs(currentPool[j].cb);
        const transfer = Math.min(surplus, deficit);

        currentPool[i].cb -= transfer;
        currentPool[j].cb += transfer;

        if (currentPool[i].cb === 0) i++;
        if (currentPool[j].cb === 0) j--;
    }

    // Validation
    let valid = true;

    // 1. Total pool sum must be >= 0
    if (totalCbSum < 0) {
        valid = false;
    }

    // 2. Ships in deficit must not exit worse than they started
    for (const ship of currentPool) {
        // Find initial state
        const initial = initialShips.find(s => s.id === ship.id);
        if (!initial) continue;

        if (initial.initialCb! < 0) {
            if (ship.cb < initial.initialCb!) {
                valid = false;
            }
        } else if (initial.initialCb! > 0) {
            // 3. Surplus ships must not exit with a negative balance
            if (ship.cb < 0) {
                valid = false;
            }
        }
    }

    return { pool: currentPool, valid };
}
