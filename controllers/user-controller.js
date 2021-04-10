const { User, Thought } = require('../models');

const userController = {
    // get all users
    getAllUser(req, res) {
        User.find({})
          .select('-__v')
          .then(dbUserData => res.json(dbUserData))
          .catch(err => {
              console.log(err);
              res.status(500).json(err);
          });
    },


    // get a single user by its _id and populated though and friend data
    getUserById({params}, res) {
        User.findOne({ _id: params.id })
          .populate({
              path: 'thoughts'
          })
          .populate({
            path: 'friends'
          })
          .select('-__v')
          .then(dbUserData => {
              if(!dbUserData) {
                  res.status(404).json({ message: 'No user found!' });
                  return;
              }
              res.json(dbUserData);
          })
          .catch(err => {
              console.log(err);
              res.status(500).json(err);
          });
    },


    // create a new user
    createUser({body}, res) {
        User.create(body)
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.status(500).json(err));
    },


    // update a user by its _id
    updateUser({params, body}, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
          .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user found!' });
                return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.status(500).json(err));
    },


    // delete a user by its _id
    deleteUser({params}, res) {
        User.findOneAndDelete({ _id: params.id })
          .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user found!' });
                return;
            }
            // remove the user from friend list
            User.updateMany(
              {_id: { $in: dbUserData.friends }},
              {$pull: { friends: params.id }},
              { new: true }
            )
            .then(() => {
              // remove a user's associated thoughts
              Thought.deleteMany({ username: dbUserData.username })
              .then(() => {
                res.json({ message: 'User and associated thoughts are deleted!' });
              })
              .catch(err => res.status(500).json(err));
            })
            .catch(err => res.status(500).json(err));
          })
          .catch(err => res.status(500).json(err));
    },

    
    // add a new friend to user's friend list
    addFriend({params}, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            { $push: { friends: params.friendId }},
            { new: true }
        )
          .then(dbUserData => {
            if(!dbUserData) {
              res.status(404).json({ message: 'No user found!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.status(500).json(err));
    },


    // remove a friend from a user's friend list
    removeFriend({params}, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            { $pull: { friends: params.friendId }},
            { new: true }
        )
          .then(dbUserData => {
            if(!dbUserData) {
              res.status(404).json({ message: 'No user found!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.status(500).json(err));
    }
};


module.exports = userController;