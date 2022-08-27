module.exports = {
    getError(errors, prop) {
        try { //try catch in case stuff is undefined

            //errors is array, errors.mapped returns object with keys like email: ..., password: ....
            //prop.msg is message for the prop (email, password,...) that we are looking for and setting message
            //[prop] references correct subobject in object (bracket notation)
            return errors.mapped()[prop].msg
        } catch (err) {
            //if hits this, trying to look up error message that doesnt exist so empty string
            return '';
        }
    }
}