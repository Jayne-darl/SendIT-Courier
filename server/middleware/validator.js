// import helper from "../helpers/helper";

class Validator {
    static async mail(req, res, next) {
        if (!req.body.email || !req.body.message || !req.body.name) {
            res.status(400).json({

                status: res.statusCode,
                message: 'Please, supply all the required information',

            });
        }
        return next();
    }
}
export default Validator
