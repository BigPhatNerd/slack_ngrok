const calendarReps = (payload, workout, slashOrHome) => {
    const { trigger_id } = payload;
    const { type, name, description, reps, notes } = workout;
    console.log("payload: ", payload);
    const metadata = JSON.parse(payload.view.private_metadata);
    const { calendar_date} = metadata;
    const repsView = {
        "trigger_id": trigger_id,
        view: {
            "type": "modal",
            "callback_id": "calendar_workout",
            "private_metadata": JSON.stringify({
                "score_type": "Reps",
                "type": type,
                "name": name,
                "description": description,
                "home_or_slash": slashOrHome,
                "homeModal_view_id": payload.view.root_view_id,
                "action": payload.actions[0].value,
                 "calendar_date": calendar_date


            }),
            "title": {
                "type": "plain_text",
                "text": "Complete Workout",
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
                    "block_id": "radio",
                    "element": {
                        "type": "radio_buttons",
                         "initial_option": {
                       "text": {
                            "type": "plain_text",
                            "text": "Share with channel 🔊",
                            "emoji":true
                        },
                        "value": "public"
                    },
                        "options": [{
                                "text": {
                                    "type": "plain_text",
                            "text": "Keep this private. 🤫",
                            "emoji": true
                                },
                                "value": "private"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                            "text": "Share with channel 🔊",
                            "emoji":true
                                },
                                "value": "public"
                            }
                        ],
                        "action_id": "radio_buttons-action"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Privacy Settings:",
                        "emoji": true
                    }
                }, {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "*Type:* " + type,

                    }
                }, {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "*Name:* " + name,

                    }
                }, {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "*Description:* " + description,

                    }
                },



                {
                    "type": "input",
                    "optional": true,
                    "block_id": "reps",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "reps"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Reps",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "optional": true,
                    "block_id": "notes",
                    "element": {
                        "type": "plain_text_input",
                        "multiline": true,
                        "action_id": "notes"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Notes",
                        "emoji": true
                    }
                },


            ]
        }
    }
    return repsView
}

module.exports = calendarReps;