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


router.route('/').get(getAllThought)

router.route('/:userId').post(createThought)


router
  .route('/:id')
  .get(getThoughtById)
  .put(updateThought)


router.route('/:userId/:thoughtId').delete(deleteThought)


router.route('/:thoughtId/reactions').post(addReaction)
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction)


module.exports = router;