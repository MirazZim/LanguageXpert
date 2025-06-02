import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    bio: {
        type: String,
        default: ""    //default bio will be empty string
    },
    profilePic: {
        type: String,
        default: "" //default profile pic will be empty string
    },
    nativeLanguage: {
        type: String,
        default: ""
    },
    learningLanguage: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    isOnboarded: {
        type: Boolean,
        default: false
    },
    


    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
    
}, {
    timestamps: true //createdAt and updatedAt
})

const User = mongoose.model("User", userSchema);

//pre hook to hash password. hash password before saving to database. hash means encrypting the password
userSchema.pre("save", async function (next) {
    //if password is not modified, do not hash
    if (!this.isModified("password")) return next();
    
    try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);

        next();
    } catch (error) {
        next(error);
    }
})

export default User;
