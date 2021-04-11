const router = require('express').Router();

const {
    getAllThought,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction
} = require('../../controllers/thought-controller');

// Set up GET all thoughts
router.route('/').get(getAllThought)

// Set up POST thought
router.route('/:userId').post(createThought)

// Set up GET and update thought
router
  .route('/:id')
  .get(getThoughtById)
  .put(updateThought)

// Set up DELETE thought
router.route('/:userId/:thoughtId').delete(deleteThought)

// Set up POST and DELETE reactions
router.route('/:thoughtId/reactions').post(addReaction)
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction)


module.exports = router;