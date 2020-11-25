const prodCookie = { httpOnly: true, sameSite: "none", secure: true };
const devCookie = { httpOnly: true };

module.exports = { prodCookie, devCookie };
