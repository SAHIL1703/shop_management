import Product from "../models/Product.js";

// Create Product
export const createProduct = async (req, res) => {
    try {
        // Step 1: Extract specific fields from the request body
        const {
            shopId,
            name,
            brand,
            category,
            productImage,
            variants, // Remember, this is an Array of objects
            specifications
        } = req.body;

        // Safe Exit: Fixed the logic to use OR (||) and removed the undefined userId
        if (!shopId || !name) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide a valid shopId and product name." 
            });
        }

        // Quick check to ensure they sent at least one variant
        if (!variants || variants.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "At least one variant is required." 
            });
        }

        // Step 2: Case-insensitive search for the product
        const searchRegex = new RegExp(`^${name}$`, 'i');
        const existingProduct = await Product.findOne({ shopId, name: searchRegex });

        // Step 3: If the product ALREADY exists (Update Logic)
        if (existingProduct) {
            
            // Loop through each variant coming from the frontend array
            variants.forEach(incomingVariant => {
                
                // Try to find if this exact variant already exists in the database
                const existingVariantIndex = existingProduct.variants.findIndex(v => 
                    v.size === incomingVariant.size && 
                    v.color === incomingVariant.color && 
                    v.purchasePrice === incomingVariant.purchasePrice && 
                    v.sellingPrice === incomingVariant.sellingPrice
                );

                if (existingVariantIndex > -1) {
                    // It exists! Add the new stock to the old stock
                    existingProduct.variants[existingVariantIndex].stockQuantity += incomingVariant.stockQuantity;
                } else {
                    // It's a new variant for an existing product (e.g., adding 100ml to an existing Perfume)
                    existingProduct.variants.push(incomingVariant);
                }
            });

            // Save the updated product back to the database
            await existingProduct.save();
            
            return res.status(200).json({ 
                success: true, 
                message: "Existing product updated successfully with new stock/variants.",
                product : existingProduct
            });
        }

        // Step 4: If the product DOES NOT exist (Creation Logic)
        const newProduct = new Product({
            shopId,
            name,
            brand,
            category,
            productImage,
            variants,
            specifications
        });

        // Save the brand new product
        await newProduct.save();

        return res.status(201).json({ 
            success: true, 
            message: "New product created successfully.",
            product: newProduct 
        });

    } catch (error) {
        console.error("Create Product Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error: " + error.message,
        });
    }
};

// Get Single Product
export const getProduct = async (req, res) => {
    try {
        // Trick: Extract from req.params (or req.query), NOT req.body for GET requests!
        // This assumes your route is setup like: /api/products/:shopId/:productId
        const { shopId, productId } = req.params; 
        
        // Safe Exit 
        if (!shopId || !productId) {
            // Added 400 Bad Request status
            return res.status(400).json({ 
                success: false, 
                message: "Please provide valid Shop and Product IDs." 
            });
        }

        // Security Fix: Find the product by its ID AND ensure it belongs to this specific shop
        const product = await Product.findOne({ 
            _id: productId, 
            shopId: shopId 
        });

        if (!product) {
            // Added 404 Not Found status
            return res.status(404).json({ 
                success: false, 
                message: "Product not found or does not belong to this shop." 
            });
        }

        return res.status(200).json({ 
            success: true, 
            product: product 
        });

    } catch (error) {
        // Fixed the copy-paste typo in the console log!
        console.error("Get Product Error:", error.message); 
        return res.status(500).json({
            success: false,
            message: "Internal Server Error: " + error.message,
        });
    }
};

// Update Product
export const updateProduct = async (req, res) => {
    try {
        // Step 1: Extract IDs from params
        const { shopId, productId } = req.params;

        // Step 2: Safe Exit for missing IDs
        if (!shopId || !productId) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide valid Shop and Product IDs." 
            });
        }

        // Step 3: Grab whatever the frontend sent us to update
        // We don't need to destructure every single item if we use $set
        const updateData = req.body; 

        // Step 4: The Magic One-Liner (Search + Update + Save)
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: productId, shopId: shopId }, // The Query: Securely find the exact product
            { $set: updateData },               // The Update: $set ONLY overwrites the fields the frontend sent
            { new: true, runValidators: true }  // The Options: Return the updated document & run schema rules
        );

        // Step 5: Check if it actually found anything
        if (!updatedProduct) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found or does not belong to this shop." 
            });
        }

        // Step 6: Success!
        return res.status(200).json({ 
            success: true, 
            message: "Product updated successfully.",
            product: updatedProduct
        });

    } catch (error) {
        // Step 7: The Catch Block (No longer silent!)
        console.error("Update Product Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error: " + error.message,
        });
    }
};

// Delete Product
export const deleteProduct = async (req, res) => {
    try {
        // Step 1: Extract IDs from params
        const { shopId, productId } = req.params;

        // Step 2: Safe Exit for missing IDs
        if (!shopId || !productId) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide valid Shop and Product IDs." 
            });
        }

        // Step 3: Delete and store the result
        const deletedProduct = await Product.findOneAndDelete({ _id: productId, shopId: shopId });

        // Step 4: Check if it actually existed
        if (!deletedProduct) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found or already deleted." 
            });
        }

        // Step 5: Success
        return res.status(200).json({ 
            success: true,
            message: "Product deleted successfully." 
        });

    } catch (error) {
        // Step 6: Fixed the typo here!
        console.error("Delete Product Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error: " + error.message,
        });
    }
}


//We need to add the getAllproduct with the pagination 
export const getAllProduct =async(req,res)=>{
    try {
        const {shopId} = req.params;
        const userId = req.user.id;

        if(!shopId){
            return res.status(404).json({success : false , message : "Shop Id not provided"})
        }
        if(!userId){
            return res.status(404).json({success : false , message : "User Id not provided"})
        }

        const products = await Product.find({shopId})
        console.log(products)

        if(!products){
            return res.status(404).josn({success : false , message : "Products Not Present"})
        }

        res.status(200).json({success : true , message : "Product Fetched" , products})
        
    } catch (error) {
        console.error("Delete Product Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error: " + error.message,
        });
    }
}