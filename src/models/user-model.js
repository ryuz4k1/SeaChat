const mongoose 	 = require("mongoose");

const UserSchema = mongoose.Schema({
    googleId: {
        type: String,
        unique: true
    },
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		minlength: 5,
    },
    profilePictureUrl: {
        type: String
    }
});

module.exports = mongoose.model("user", UserSchema);