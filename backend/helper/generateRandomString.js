module.exports.generateString = (length) => {
    const characters = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890"
    let result = "";
    for (let index = 0; index < length; index++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result;
}

module.exports.generateOtp = (length) => {
    const characters = "1234567890"
    let result = "";
    for (let index = 0; index < length; index++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result;
}