const router = require('express').Router();

const {
    createGoals,
    showGoals,
    updateGoals,
    deleteGoals
} = require('../../controller/weeklyGoals');

router.route('/:user_id')
    .get(showGoals)
    .post(createGoals);

router.route("/:weeklyGoalId").put(updateGoals);



module.exports = router;