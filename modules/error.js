// returns an error doc with given input
const APIError = (name, message, verbose, errors) => {
    return {
        name: name,
        _message: message,
        message: verbose,
        errors: errors
    }
}

module.exports = {APIError}