const { customAlphabet } = require('nanoid');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const getOrderId = () => {
    const nanoid = customAlphabet(alphabet, 12);
    return  nanoid()
}

module.exports = {getOrderId}
