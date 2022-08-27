const layout = require('../layout')
const { getError } = require('../../helpers')

module.exports = ({ errors }) => {
    //enctype is content type, default is turn everything to strings for query params
    return layout({
        content: `
        <form method="POST" enctype="multipart/form-data">
            <input placeholder="Title" name="title" />
            <input placeholder="Price" name="price" />
            <input type="file" name="image" />
            <button>Submit</button>
        </form>
        `
    })
}