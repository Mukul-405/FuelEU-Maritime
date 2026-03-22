-- Fuel EU Maritime Application Setup Script

CREATE TABLE IF NOT EXISTS routes (
    id SERIAL PRIMARY KEY,
    route_id VARCHAR(50) NOT NULL UNIQUE,
    vessel_type VARCHAR(100),
    fuel_type VARCHAR(50),
    year INTEGER,
    ghg_intensity NUMERIC(10, 4),
    fuel_consumption NUMERIC(10, 2),
    distance NUMERIC(10, 2),
    total_emissions NUMERIC(10, 2),
    is_baseline BOOLEAN DEFAULT false
);

INSERT INTO routes (route_id, vessel_type, fuel_type, year, ghg_intensity, fuel_consumption, distance, total_emissions, is_baseline) VALUES 
('R001', 'Container', 'MGO', 2025, 95.1200, 1000, 5000, 305.5, false),
('R002', 'Bulk Carrier', 'HFO', 2025, 97.4500, 1200, 6000, 375.2, false),
('R003', 'Tanker', 'LNG', 2025, 82.3000, 800, 4000, 215.8, false),
('R004', 'Passenger', 'Methanol', 2025, 75.6000, 500, 2000, 105.4, false),
('R005', 'Baseline', 'MGO', 2025, 89.3368, 0, 0, 0, true)
ON CONFLICT (route_id) DO NOTHING;

CREATE TABLE IF NOT EXISTS ship_compliance (
    id SERIAL PRIMARY KEY,
    ship_id VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    cb_gco2eq NUMERIC(15, 2) NOT NULL,
    UNIQUE(ship_id, year)
);

CREATE TABLE IF NOT EXISTS bank_entries (
    id SERIAL PRIMARY KEY,
    ship_id VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    amount_gco2eq NUMERIC(15, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS pools (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pool_members (
    id SERIAL PRIMARY KEY,
    pool_id INTEGER NOT NULL REFERENCES pools(id),
    ship_id VARCHAR(50) NOT NULL,
    cb_before NUMERIC(15, 2) NOT NULL,
    cb_after NUMERIC(15, 2) NOT NULL
);
