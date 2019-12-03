const mongoose 	 = require("mongoose");
const findOrCreate = require("mongoose-find-or-create");

const UserSchema = mongoose.Schema({
    googleId: {
        type: String,
        unique: true
    },
	name: {
		type: String,
		required: true,
	},
	surname: {
		type: String,
    },
    profilePhotoUrl: {
        type: String
    },
    locale:{
        type: String
    }
});

UserSchema.plugin(findOrCreate);
module.exports = mongoose.model("user", UserSchema);