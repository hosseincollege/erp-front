// Path: frontend/src/lib/inventory-api.ts
// Frontend - API client helpers for inventory module

import { apiClient } from '@/lib/api-client';
import type {
  InventoryBalance,
  InventoryMovement,
  InventoryProduct,
  InventorySummary,
  InventoryWarehouse,
} from '@/types/inventory';

export const inventoryApi = {
  getSummary: async (): Promise<InventorySummary> => {
    return apiClient.get<InventorySummary>(
      '/inventory/summary',
    );
  },

  getProducts: async (): Promise<InventoryProduct[]> => {
    return apiClient.get<InventoryProduct[]>(
      '/inventory/products',
    );
  },

  getWarehouses: async (): Promise<InventoryWarehouse[]> => {
    return apiClient.get<InventoryWarehouse[]>(
      '/inventory/warehouses',
    );
  },

  getBalances: async (): Promise<InventoryBalance[]> => {
    return apiClient.get<InventoryBalance[]>(
      '/inventory/balances',
    );
  },

  getMovements: async (): Promise<InventoryMovement[]> => {
    return apiClient.get<InventoryMovement[]>(
      '/inventory/movements',
    );
  },
};
