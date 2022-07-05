const bcrypt = require('bcrypt');

const saltRounds = 4;

// const myPass = "test@123";

hashing = async (myPass) => {
    // console.log(myPass);
    const hashedPass = await bcrypt.hash(myPass, saltRounds);
    // console.log(hashedPass);

    return hashedPass;
}

comparing = async (myPass, dbPass) => {
    // console.log(myPass);
    // console.log(dbPass);
    const compared = await bcrypt.compare(myPass, dbPass);
    // console.log(compared);

    return compared;
}

module.exports ={hashing, comparing}