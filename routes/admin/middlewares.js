const { validationResult } = require("express-validator");

module.exports = {
  handleErrors(templaceFunc, dataCallBack) {
    //middlewear gets next param, it means continue on before promises were around
    //middlewear returns a func
    return async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        //define here for scoping, defined to empty object to prevent undefined
        let data = {};
        if (dataCallBack) {
          data = await dataCallBack(req);
        }
        return res.send(templaceFunc({ errors, ...data }));
      }
      //everything went well, move on to next call
      next();
    };
  },
  //no customization so dont return func
  requireAuth(req, res, next) {
    if (!req.session.userId) {
      return res.redirect("/signin");
    }

    next();
  },
};
