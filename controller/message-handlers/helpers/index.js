module.exports = {
    createGoalsMessage: (movement, movementValue) => {
        if(typeof movement === "undefined" || movementValue === null) {
            return ''
        }
        return movementValue + " " + movement + "\n"

    },

    addRepsMessage: (movement, movementValue) => {
        if(typeof movement === 'undefined') {
            return ''
        }
        return "Test later"
    },
    //intValidation is currently not being used.
    intValidation: (value, blockId) => {
        
        if(!value) {
            
            return Promise.resolve({
                response_action: "errors",
                errors: {
                    minutes: "Must enter an integer"
                }
            })
        }
    }

}