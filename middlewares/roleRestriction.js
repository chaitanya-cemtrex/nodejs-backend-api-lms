const roleRestriction = (...roles) => {
    return (req, res, next) => {
        console.log("role  ====> ", roles)
        if (!roles.includes(req.userAuth.role)) {
            throw new Error("User role access denied.")
        }
        next();
    }
}

module.exports = roleRestriction;