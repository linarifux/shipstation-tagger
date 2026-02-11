import { shipStationService } from '../services/shipStation.js';
import { truncateToWords } from '../utils/formatters.js';

export const processOrderTags = async (req, res) => {
  try {
    console.log('🔄 Starting Tag Sync Process (V2 API)...');

    // 1. Fetch Data
    const [orders, existingTags] = await Promise.all([
      shipStationService.getAwaitingOrders(),
      shipStationService.getAllTags(),
    ]);

    // Validation for V2 response structure
    if (!Array.isArray(orders)) {
      console.error('❌ Unexpected Order Data Structure:', orders);
      return res.status(500).json({ error: 'Received invalid order data from ShipStation V2' });
    }

    if (orders.length === 0) {
      return res.status(200).json({ message: 'No orders awaiting shipment.' });
    }

    console.log(`📦 Found ${orders.length} orders. Processing...`);

    // Map existing tags: "Tag Name" => TagID
    const tagMap = new Map();
    if (Array.isArray(existingTags)) {
      existingTags.forEach(t => tagMap.set(t.name.toLowerCase(), t.tagId));
    }

    const results = { processed: 0, tagsCreated: 0, tagsApplied: 0, errors: [] };

    // 2. Process Each Order
    for (const order of orders) {
      // Safety check for items array
      if (!order.items || !Array.isArray(order.items)) continue;

      for (const item of order.items) {
        if (!item.name) continue;

        const tagName = truncateToWords(item.name, 5);
        const tagNameLower = tagName.toLowerCase();
        let tagId;

        try {
          if (tagMap.has(tagNameLower)) {
            tagId = tagMap.get(tagNameLower);
          } else {
            console.log(`✨ Creating new tag: "${tagName}"`);
            const newTag = await shipStationService.createTag(tagName);
            tagId = newTag.tagId;
            tagMap.set(tagNameLower, tagId);
            results.tagsCreated++;
          }

          // Check if tag is already on order
          const currentTagIds = order.tagIds || [];
          if (!currentTagIds.includes(tagId)) {
            await shipStationService.addTagToOrder(order.orderId, tagId);
            console.log(`✅ Tagged Order #${order.orderNumber} with "${tagName}"`);
            results.tagsApplied++;
          }
        } catch (innerError) {
          // console.error(innerError); // Uncomment for deep debugging
          results.errors.push({ order: order.orderNumber, error: innerError.message });
        }
      }
      results.processed++;
    }

    res.status(200).json({
      success: true,
      message: 'Tagging complete',
      data: results,
    });

  } catch (error) {
    console.error('🔥 Critical Error:', error.message);
    if (error.message.includes('404')) {
        res.status(404).json({ 
            error: 'Endpoint Not Found', 
            suggestion: 'The V2 API might not support the /orders endpoint yet. Please check if you can generate V1 keys in ShipStation Settings.' 
        });
    } else {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }
};