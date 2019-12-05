const mongoose 	 = require("mongoose");
const Schema = mongoose.Schema;
const findOrCreate = require("mongoose-find-or-create");

const UserSchema = new Schema({
    googleId: {
        type: String,
        unique: true
    },
	name: {
		type: String,
	},
	surname: {
		type: String,
    },
    profilePhotoUrl: {
        type: String
    }
});

UserSchema.plugin(findOrCreate);
module.exports = mongoose.model("user", UserSchema);