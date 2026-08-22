// Path: frontend/src/lib/inventory-api.ts
// Frontend - API client helpers for inventory module

import { apiClient } from "@/lib/api-client";
import type {
  InventoryBalance,
  InventoryMovement,
  InventoryProduct,
  InventorySummary,
  InventoryWarehouse,
} from "@/types/inventory";

export const inventoryApi = {
  getSummary: async () => {
    const { data } = await apiClient<InventorySummary>("/inventory/summary");
    return data;
  },

  getProducts: async () => {
    const { data } = await apiClient<InventoryProduct[]>("/inventory/products");
    return data;
  },

  getWarehouses: async () => {
    const { data } = await apiClient<InventoryWarehouse[]>("/inventory/warehouses");
    return data;
  },

  getBalances: async () => {
    const { data } = await apiClient<InventoryBalance[]>("/inventory/balances");
    return data;
  },

  getMovements: async () => {
    const { data } = await apiClient<InventoryMovement[]>("/inventory/movements");
    return data;
  },
};
