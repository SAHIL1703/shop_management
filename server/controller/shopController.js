import Shop from "../models/Shop.js";
import User from "../models/User.js";

// Get Shop
export const getShop = async (req, res) => {
  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Login Required",
      });
    }

    const user = await User.findById(userId);

    if (!user || !user.shopId) {
      return res.status(404).json({
        success: false,
        message: "No Shop Listed",
      });
    }

    const shop = await Shop.find(user.shopId);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop Not Found",
      });
    }

    res.status(200).json({
      success: true,
      shop,
    });

  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createShop = async (req, res) => {
  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Login Required",
      });
    }

    const { shopName, shopType, address, shopImage, isActive } = req.body;

    if (!shopName) {
      return res.status(400).json({
        success: false,
        message: "Shop Name Required",
      });
    }

    // 🔍 Check if this user already owns a shop
    const existingShop = await Shop.findOne({ userId });

    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: "User already has a shop",
      });
    }

    // ✅ Create shop
    const shop = await Shop.create({
      userId,
      shopName,
      shopType,
      address,
      shopImage,
      isActive,
    });

    // optional: store shopId in user
    await User.findByIdAndUpdate(userId, {
      shopId: shop._id,
    });

    res.status(201).json({
      success: true,
      message: "Shop created successfully",
      shop,
    });

  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Shop
export const updateShop = async (req, res) => {
  try {

    // Step 1: Get userId
    const userId = req.user?.id;

    // Step 2: Get shopId
    const { shopId } = req.body;

    // Step 3: Extract update fields
    const { shopName, shopType, address, shopImage, isActive } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Login Required",
      });
    }

    if (!shopId) {
      return res.status(400).json({
        success: false,
        message: "ShopId Required",
      });
    }

    // Step 4: Check shop belongs to user
    const shop = await Shop.findOne({
      _id: shopId,
      userId: userId
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found or unauthorized",
      });
    }

    // Step 5: Update shop
    const updatedShop = await Shop.findByIdAndUpdate(
      shopId,
      { shopName, shopType, address, shopImage, isActive },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Shop updated successfully",
      shop: updatedShop
    });

  } catch (error) {

    console.log(error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
