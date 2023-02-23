const isLoggedIn = (req, res, next) =>{
    const isLoggedIn = req.userAuth
    if(isLoggedIn){
        next()
    }else{
        const error = new Error('You are not logged in')
        next(error)
    }

}

module.exports = isLoggedIn