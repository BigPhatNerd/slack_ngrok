const addRepsToGoals = (trigger_id) => {
    const repsModal = {
        "trigger_id": trigger_id,
        "view": {
            "type": "modal",
            "callback_id": "add_reps_to_goals",
            "title": {
                "type": "plain_text",
                "text": "Add Reps",
                "emoji": true
            },
            "submit": {
                "type": "plain_text",
                "text": "Submit",
                "emoji": true
            },
            "close": {
                "type": "plain_text",
                "text": "Cancel",
                "emoji": true
            },
            "blocks": [{
                    "type": "input",
                    "optional": true,
                    "block_id": "pushups",
                    "element": {
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Pushups completed",
                            "emoji": true
                        },
                        "type": "plain_text_input",
                        "action_id": "pushups"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Pushups",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "optional": true,
                    "block_id": "situps",
                    "element": {
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Situps completed",
                            "emoji": true
                        },
                        "type": "plain_text_input",
                        "action_id": "situps"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Situps",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "optional": true,
                    "block_id": "squats",
                    "element": {
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Squats completed",
                            "emoji": true
                        },
                        "type": "plain_text_input",
                        "action_id": "squats"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Squats",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "optional": true,
                    "block_id": "miles",
                    "element": {
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Miles completed",
                            "emoji": true
                        },
                        "type": "plain_text_input",
                        "action_id": "miles"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Miles",
                        "emoji": true
                    }
                }

            ]
        }
    }
    return repsModal

}

module.exports = addRepsToGoals;