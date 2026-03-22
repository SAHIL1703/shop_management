import Product from "../models/Product.js";
import SaleEntry from "../models/SaleEntry.js";

export const addSales = async (req, res) => {
    try {
        const userId = req.user.id;
        // Notice we do NOT extract grandTotal from req.body. We calculate it ourselves securely!
        const { shopId, salespersonId, items } = req.body;

        // Safe Check: Did they send an empty cart?
        if (!items || items.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Shopping cart is empty." 
            });
        }

        // Step 1: Extract unique Product IDs to query the database efficiently
        const uniqueProductIds = [...new Set(items.map(item => item.productId))];

        // Step 2: Fetch all involved products in ONE database trip (Best Practice!)
        const dbProducts = await Product.find({ _id: { $in: uniqueProductIds } });

        // Arrays and variables to hold our final validated data
        const finalSaleItems = [];
        let actualGrandTotal = 0;
        const productsToSave = new Set(); // Using a Set prevents saving the same product twice if a user buys 2 variants of the same product

        // Step 3: Validate, Calculate, and Update Stock locally
        for (const item of items) {
            
            // 1. Find the specific product we fetched from the DB
            const dbProduct = dbProducts.find(p => p._id.toString() === item.productId);
            if (!dbProduct) {
                return res.status(404).json({ 
                    success: false, 
                    message: `Product with ID ${item.productId} not found in database.` 
                });
            }

            // 2. Find the specific variant inside that product
            const variant = dbProduct.variants.find(v => v._id.toString() === item.variantId);
            if (!variant) {
                return res.status(404).json({ 
                    success: false, 
                    message: `Variant not found for product ${dbProduct.name}.` 
                });
            }

            // 3. Stock Check! (Crucial to do this before any math)
            if (variant.stockQuantity < item.quantity) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Out of stock! Only ${variant.stockQuantity} left for ${dbProduct.name} - ${variant.size || ''} ${variant.color || ''}.` 
                });
            }

            // 4. Secure Math: Calculate subtotal using the DB price, NOT the frontend price
            const realPrice = variant.sellingPrice;
            const subTotal = realPrice * item.quantity;
            actualGrandTotal += subTotal;

            // 5. Deduct the stock in our local memory
            variant.stockQuantity -= item.quantity;
            productsToSave.add(dbProduct); // Mark this product document as needing a save

            // 6. Build the exact object required by your SaleEntry schema
            finalSaleItems.push({
                productId: dbProduct._id,
                variantId: variant._id,
                variantName: `${dbProduct.name} - ${variant.size || ''} ${variant.color || ''}`.trim(),
                quantity: item.quantity,
                pricePerUnit: realPrice,
                subTotal: subTotal
            });
        }

        // Step 4: Save everything to the Database
        
        // 1. Save all the updated Products (with their new, lower stock quantities)
        // We turn the Set back into an array and save them all concurrently for speed
        const saveProductPromises = Array.from(productsToSave).map(product => product.save());
        await Promise.all(saveProductPromises);

        // 2. Create the brand new Sale Entry record
        const newSale = new SaleEntry({
            shopId: shopId,
            items: finalSaleItems,
            grandTotal: actualGrandTotal,
            salespersonId: salespersonId || null // Optional field handled safely
        });

        // 3. Save the Sale Entry
        await newSale.save();

        // Step 5: Triumphant Return!
        return res.status(201).json({ 
            success: true, 
            message: "Sale completed successfully!",
            sale: newSale 
        });

    } catch (error) {
        console.error("Add Sales Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error: " + error.message 
        });
    }
};