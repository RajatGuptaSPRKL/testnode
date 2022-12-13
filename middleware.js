module.exports = {
    isLoggedIn: (req, res, next) =>{
        let evenNum = 9;
        let headers = req.headers.authorization;
        if(headers == 'Rajat'){
            req.username = "Rajat";
            req.evenNum = evenNum + req.body.num;
            next();
        }else{
            res.json({
                status: 401,
                message:'Unauthorized Access'
            });
        }
    }
}