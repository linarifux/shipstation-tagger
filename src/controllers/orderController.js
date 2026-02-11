import { shipStationService } from '../services/shipStation.js';

export const listOrders = async (req, res) => {
  try {
    // 1. Extract query params from the request URL
    // Example: GET /api/orders?status=shipped&page=2
    const { status, page, limit } = req.query;

    // 2. Prepare params for ShipStation
    const filterOptions = {
      orderStatus: status || 'awaiting_shipment', // Default to awaiting if not specified
      page: page || 1,
      pageSize: limit || 50,
    };

    console.log(`📥 Fetching orders with filters:`, filterOptions);

    // 3. Call the service
    const data = await shipStationService.getOrders(filterOptions);

    // 4. Return the data
    res.status(200).json({
      success: true,
      count: data.shipments ? data.shipments.length : 0,
      total: data.total, // ShipStation usually returns total count in metadata
      page: data.page,
      pages: data.pages,
      shipments: data.shipments || [],
    });

  } catch (error) {
    console.error('❌ Error fetching orders:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve orders',
      details: error.message,
    });
  }
};