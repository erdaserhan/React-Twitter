import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getUserProfile = async (req, res) => {
    const { username } = req.params;   

    try {
        const user = await User.findOne({ username }).select('-password'); //We can get the user profile which comes from req.params
        if(!user) return res.status(404).json({ error: "User not found"});            
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in getUserProfile : ", error.message);
    }
};

export const followUnfollowUser = async (req, res) => {
      

    try {
        const { id } = req.params; // It should be id because we called it id on "router.post("/follow/:id", protectRoute, followUnfollowUser)" in user.routes.js

        const userToModify = await User.findById(id); //The user we can follow or unfollow      
        const currentUser = await User.findById(req.user._id);
        
        if(id === req.user._id.toString()) {
            return res.status(404).json({ error: "You can't follow/unfollow yourself"});
        }

        if(!userToModify || !currentUser) return res.status(404).json({ error: "User not found"}); //If there's no user
        
        const isFollowing = currentUser.following.includes(id); // currentUser(me) following array includes user id(const { id } = req.params;) 
        
        if(isFollowing) {
            //Unfollow the user
            await User.findByIdAndUpdate(id, { $pull: {followers: req.user._id}}); //pull from the followers array. Because we unfollow them.
            await User.findByIdAndUpdate(req.user._id, { $pull: {following: id}}); //pull from the following array of the current user.
            //TODO: return the id of the user as a response
            res.status(200).json({ error: "User unfollowed successfully"});
        }else {
            //follow the user
            await User.findByIdAndUpdate(id, { $push: {followers: req.user._id}}); //User that we would like to follow. we update the followers array. we push id of the currentUser
            await User.findByIdAndUpdate(req.user._id, { $push: {following: id}}); //we add in the following array the id of the user that we followed.
            //Send notification to the user
            //Model imported from notification.model.js
            const newNotification = new Notification({ 
                type: "follow",
                from: req.user._id,
                to: userToModify._id,
            });

            await newNotification.save(); //We save in our database

            //TODO: return the id of the user as a response
            res.status(200).json({ error: "User followed successfully"});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in followUnfollowUser : ", error.message);
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        const usersFollowedByMe = await User.findById(userId).select('following');


        //We want to get 10 different users and not the authenticated user which is "$ne: userId"
        const users = await User.aggregate([
            {
                $match: {
                    _id: {$ne: userId} //$ne = not equal to userId
                }
            },
            {$sample:{size:10}} //We get 10 different values
        ])
        
        const filteredUsers = users.filter(user=>!usersFollowedByMe.following.includes(user._id)); //Exclude the usersFollowedByMe. The users that I have in my following array will be out.
        const suggestedUsers = filteredUsers.slice(0,4) //We get 4 different values

        suggestedUsers.forEach(user=>user.password=null) //suggestedUsers will have the passwords. We put it as null.

        res.status(200).json(suggestedUsers)
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in getSuggestedUsers : ", error.message);
    }
};

export const updateUser = async (res, req) => {
    const { fullName, email, username, currentPassword, newPassword,bio, link} = req.body;
    let {profileImg, coverImg} =  req.body;

    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if(!user) res.status(404).json({ error: "User not found"});

        if((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            res.status(400).json({ error: "Please provide both current password and new password"});
        }

        if(currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password); //We compare if the current password matches with the one we have in our database
            if(!isMatch) res.status(400).json({ error: "Current password is incorrect"});
            if(newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 caracters long"});
            }

            //We hash the new password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if(profileImg) {
            if(user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]); //To get the id of the profileImg image at the and of the URL. Ex => https://res.cloudinary.com/<cloud_name>/<asset_type>/<delivery_type>/<transformations>/<version>/<public_id_full_path>.<extension>. To get the <public_id_full_path>
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImg) //We update it in the cloudinary account
            profileImg = uploadedResponse.secure_url;
        }

        if(coverImg) {
            await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            const uploadedResponse = await cloudinary.uploader.upload(coverImg)
            profileImg = uploadedResponse.secure_url;
        }

        user.fullName = fullName || user.fullName; //We update the user fullName with the new value of "fullName" if it doesn't change "||" we use the current name ""user.fullName
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save(); //We send the values to our database

        //password should be null in response
        user.password = null;// We don't wanna see the password. We change it to null after saving to our database so it's not gonna change. This is gonna update in the response not DB
        return res.status(200).json(user);

    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in followUnfollowUser : ", error.message);
    }
}