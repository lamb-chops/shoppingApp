const { validationResult } = require("express-validator");

module.exports = {
  handleErrors(templaceFunc, dataCallBack) {
    //middlewear gets next param, it means continue on before promises were around
    //middlewear returns a func
    return (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        
        return res.send(templaceFunc({ errors }));
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
