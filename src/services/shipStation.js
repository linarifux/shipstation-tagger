import axios from 'axios';
import { config } from '../config/env.js';

// V2 Authentication: Uses 'API-Key' header, NOT Basic Auth
const ssClient = axios.create({
  baseURL: config.shipStation.baseUrl,
  headers: { 
    'Content-Type': 'application/json',
    'API-Key': config.shipStation.apiKey 
  },
});

export const shipStationService = {
  /**
   * Fetch a list of orders with optional filters.
   * Supports pagination, status filtering, etc.
   * @param {Object} params - { page, pageSize, orderStatus, sortBy, sortDir }
   */
  getOrders: async (params = {}) => {
    try {
      // Default to "awaiting_shipment" if no status is provided, 
      // but allow overriding it (e.g. passing null or 'shipped' will override this)
      const requestParams = {
        orderStatus: 'awaiting_shipment', 
        page: 1,
        pageSize: 100,
        sortBy: 'orderDate',
        sortDir: 'DESC',
        ...params, // Merge user-provided params (allows overriding defaults)
      };

      const response = await ssClient.get('/orders', { params: requestParams });
      
      // Return the full object so we have access to 'total', 'page', etc.
      return response.data; 
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      throw new Error(`ShipStation API Error (getOrders): ${errorMsg}`);
    }
  },

  /**
   * Fetch all existing tags to avoid duplicates.
   */
  getAllTags: async () => {
    try {
      const response = await ssClient.get('/tags');
      return response.data.tags || response.data;
    } catch (error) {
      throw new Error(`Failed to fetch tags: ${error.message}`);
    }
  },

  /**
   * Create a new tag in ShipStation V2
   */
  createTag: async (tagName) => {
    try {
      const response = await ssClient.post('/tags', {
        name: tagName,
        color: '#757575',
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create tag "${tagName}": ${error.message}`);
    }
  },

  /**
   * Apply a tag to an order.
   */
  addTagToOrder: async (orderId, tagId) => {
    try {
      const response = await ssClient.post('/orders/addtag', {
        orderId: orderId,
        tagId: tagId,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to add tag to order ${orderId}: ${error.message}`);
    }
  },
};