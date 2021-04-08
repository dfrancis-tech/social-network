const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: [true, "Please enter a username"],
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'User email address required'],
            match: [/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/]
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

// get total count of friends in the friend's list
UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

// create user model using the UserSchema
const User = model('User', UserSchema);

// export the User model
module.exports = User;