import User from "../models/User.js";
import jwt from "jsonwebtoken"
export const register = async (req, res) => {
    try {
        const { email, name, password, role } = req.body;

        //Check if the email is unquie
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const user = await User.create({ email, name, password, role });

        res.status(201).json({ success: true, message: "User Created Successfully", user : {email , name , role} })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success : false , message : error.message})
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Step 1: Find the user and explicitly select the password
        const user = await User.findOne({ email }).select("+password");

        // Step 2: If user does not exist, stop and return an error
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password" 
            }); 
        }

        // Step 3: Compare the entered password with the hashed password in the DB
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }

        // Step 4: Generate the JWT Token
        // We pack the user's ID and role into the token payload
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        // Step 5: Clean up the user object before sending it to the frontend
        user.password = undefined;

        // Step 6: Send the success response with the token
        res.status(200).json({ 
            success: true, 
            message: "Login successful!",
            token: token,
            user: user
        });

    } catch (error) {
        console.log("Login Error:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}