const { User, Thought } = require('../models');

const thoughtController = {
    // get all thoughts
    getAllThought(req, res) {
        Thought.find({})
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => {
              console.log(err);
              res.status(500).json(err);
          });
    },


    // get a single thought by its _id
    getThoughtById({params}, res) {
        Thought.findOne({ _id: params.id })
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'No thought found!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },


    // create a thought and push the created thought's _id to the associated user's thoughts array field
    createThought({params, body}, res) {
        console.log(params);
        Thought.create(body)
          .then(({_id}) => {
              return User.findOneAndUpdate(
                  { _id: params.userId },
                  { $push: { thoughts: _id }},
                  { new: true }
              );
          })
          .then(dbUserData => {
              if(!dbUserData) {
                  res.status(404).json({ message: 'No user found!' });
                  return;
              }
              res.json(dbUserData);
          })
          .catch(err => res.status(500).json(err));
    },


    // update a thought by its _id
    updateThought({params, body}, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
          .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'No thought found!' });
                return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.status(500).json(err));
    },


    // delete a thought by its _id
    deleteThought({params}, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
          .then(deleteThought => {
              if(!deleteThought) {
                  return res.status(404).json({ message: 'No thought found!' });
              }
              return User.findOneAndUpdate(
                  { _id: params.userId },
                  { $pull: { thoughts: params.thoughtId }},
                  { new: true }
              );
          })
          .then(dbUserData => {
              if(!dbUserData) {
                res.status(404).json({ message: 'No user found!' });
                return;
              }
              res.json({ message: 'Thought is deleted!' });
          })
          .catch(err => res.status(500).json(err));          
    },


    // create a reaction stored in a single thought's reactio array field
    addReaction({params, body}, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body }},
            { new: true, runValidators: true }
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


    // pull and remove a reaction by the reaction's reactionId value
    removeReaction({params}, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId }}},
            { new: true }
        )
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.status(500).json(err)); 
    }
};


module.exports = thoughtController;