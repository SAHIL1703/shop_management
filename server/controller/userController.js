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

export const updateUser = async (req,res)=>{
    try {

        //Extract the data
        const {email , name , role} = req.body;
        console.log({email , name , role})

        const userId = req.user?.id; // The '?' safely checks if req.user exists
        if (!userId) {
            return res.status(401).json({ success: false, message: "Login Needed" }); 
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({success : false , message : "User don't Exist"})
        }
        
        //Check that the provided email address dont already exists
        if (email) {
            const existingUser = await User.findOne({ email });
            
            // If we found a user with this email, and their ID doesn't match the logged-in user's ID
            if (existingUser && existingUser._id.toString() !== userId.toString()) {
                return res.status(409).json({ success: false, message: "Email is already in use by another account" }); // 409 Conflict is better here
            }
        }

        //Update the user object
        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;

        await user.save();
        user.password = undefined;

        res.status(200).json({ success: true, message: "User updated successfully", user });

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const deleteUser = async (req, res) => {
    try {
        // 1. Extract UserId
        const userId = req.user?.id; 
        if (!userId) {
            return res.status(401).json({ success: false, message: "Login Needed" });
        }

        // 2. Attempt to delete the user and store the result
        const deletedUser = await User.findByIdAndDelete(userId);

        // 3. Check if the user actually existed in the database
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found or already deleted" });
        }

        // 4. Send success with a valid 200 status code
        res.status(200).json({ success: true, message: "User successfully deleted" });

    } catch (error) {
        console.log("Delete Error:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}