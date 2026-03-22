import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoutesTable } from './RoutesTable';
import type { Route } from '../../../core/domain/Route';

vi.mock('../../infrastructure/RouteApiClient', () => ({
  routeApiClient: {
    setBaseline: vi.fn().mockResolvedValue(undefined),
  },
}));

const mockRoutes: Route[] = [
  { id: 1, route_id: 'R-001', vessel_type: 'Container', fuel_type: 'MGO', year: 2025, ghg_intensity: 85.0, fuel_consumption: 1200, distance: 500, total_emissions: 4200, is_baseline: false },
  { id: 2, route_id: 'R-002', vessel_type: 'Tanker', fuel_type: 'HFO', year: 2025, ghg_intensity: 95.0, fuel_consumption: 1800, distance: 800, total_emissions: 6100, is_baseline: true },
];

describe('RoutesTable', () => {
  it('renders all routes', () => {
    render(<RoutesTable routes={mockRoutes} onBaselineSet={() => {}} />);
    expect(screen.getByText('R-001')).toBeTruthy();
    expect(screen.getByText('R-002')).toBeTruthy();
  });

  it('filters by vessel type', () => {
    render(<RoutesTable routes={mockRoutes} onBaselineSet={() => {}} />);
    const input = screen.getByPlaceholderText('e.g. Container');
    fireEvent.change(input, { target: { value: 'container' } });
    expect(screen.getByText('R-001')).toBeTruthy();
    expect(screen.queryByText('R-002')).toBeNull();
  });

  it('shows Set Baseline button for non-baseline routes and Baseline badge for baseline routes', () => {
    render(<RoutesTable routes={mockRoutes} onBaselineSet={() => {}} />);
    // Non-baseline route R-001 should have a "Set Baseline" button
    const buttons = screen.getAllByRole('button');
    const setBaselineBtn = buttons.find(b => b.textContent?.includes('Set Baseline'));
    expect(setBaselineBtn).toBeTruthy();

    // Baseline route R-002 should NOT have a Set Baseline button for it
    // Total Set Baseline buttons should be 1 (only for R-001)
    const setBaselineButtons = buttons.filter(b => b.textContent?.includes('Set Baseline'));
    expect(setBaselineButtons).toHaveLength(1);
  });
});
