import { AsyncHandler } from "../utils/Asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/users.model.js";



const generateTokens = async (user_id) => {

    const user = await User.findById(user_id);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save();

    return { accessToken, refreshToken };
}

const signup = AsyncHandler(async (req, res) => {
    const { Y_id, password } = req.body;

    if ([Y_id, password].some((d) => d === "")) {
        throw new ApiError(400, "Y_id and password required");
    }

    const existingUser = await User.findOne({ Y_id });
    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    const newUser = new User({ Y_id, password });

    await newUser.save();

    res.status(201).json(
        new ApiResponse(201, "User created successfully", {
            id: newUser._id,
            Y_id: newUser.Y_id,
        })
    );
});

const loginuser = AsyncHandler(async (req, res) => {
    const { Y_id, password } = req.body;

    if (!Y_id || !password) {
        throw new ApiError(400, "Y_id and Password are required");
    }

    const user = await User.findOne({ Y_id });

    if (!user) {
        throw new ApiError(400, "Invalid credentials");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
            user: loggedInUser,
            accessToken,
            refreshToken,
        },
    });
});


const logoutuser = AsyncHandler(async (req, res) => {
    const user_id = req.user._id;

   
    await User.findByIdAndUpdate(
        user_id,
        { $unset: { refreshToken: 1 } },
        { new: true }
    );

    return res
        .status(200)
        .json({ message: "User logged out successfully" });
});



const changepassword = AsyncHandler(async (req, res) => {

    const user_id = req.user._id;
    const { oldpassword, newpassword, confirmpassword } = req.body;

    if (!(newpassword === confirmpassword)) {
        throw new ApiError(400, "Password and Confirm Password should be same");
    }
    console.log(oldpassword, newpassword, confirmpassword);
    
    const user = await User.findById(user_id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldpassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Old Password incorrect");
    }

    user.password = newpassword;
    await user.save();

    res.status(200).json(
        new ApiResponse(200, "Password changed successfully")
    );
});




export { signup, loginuser, logoutuser, changepassword };
