"use strict";

const CulinaryVacations = require("../models/culinaryVacations"),
  httpStatus = require("http-status-codes"),
  User = require("../models/user"),
  getCulinaryVacationsParams = body => {
    return {
      title: body.title,
      description: body.description,
      heroImage:body.heroImage,
      cuisine:body.cuisine,
      cost: body.cost,
      maxTravelers:body.maxTravelers,
      destination:body.destination,
      departureLocation:body.departureLocation,
      departureDate:body.departureDate,
      returnDate:body.returnDate
    };
  };

module.exports = {
  index: (req, res, next) => {
    CulinaryVacations.find()
    .then(culinaryVacation => {
      res.locals.culinaryVacation = culinaryVacation;
      next();
    })
    .catch(error => {
      console.log(`Error fetching culinaryVacation: ${error.message}`);
      next(error);
    });
  },
  indexView: (req, res) => {
    res.render("culinaryVacations/index");
  },

  new: (req, res) => {
    res.render("culinaryVacations/new");
  },

  create: (req, res, next) => {
    let culinaryVacationsParams = getCulinaryVacationsParams(req.body);
    console.log(culinaryVacationsParams.departureDate +"======="+culinaryVacationsParams.returnDate);
    CulinaryVacations.create(culinaryVacationsParams)
      .then(culinaryVacation => {
        res.locals.redirect = "/culinaryVacations";
        res.locals.culinaryVacation = culinaryVacation;
        next();
      })
      .catch(error => {
        console.log(`Error saving culinaryVacation: ${error.message}`);
        next(error);
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    let culinaryVacationId = req.params.id;
    CulinaryVacations.findById(culinaryVacationId)
      .then(culinaryVacation => {
        res.locals.culinaryVacation = culinaryVacation;
        next();
      })
      .catch(error => {
        console.log(`Error fetching culinaryVacation by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("culinaryVacations/show");
  },

  edit: (req, res, next) => {
    let culinaryVacationId = req.params.id;
    CulinaryVacations.findById(culinaryVacationId)
      .then(culinaryVacation => {
        res.render("culinaryVacations/edit", {
          culinaryVacation: culinaryVacation
        });
      })
      .catch(error => {
        console.log(`Error fetching culinaryVacation by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let culinaryVacationId = req.params.id,
    culinaryVacationsParams = getCulinaryVacationsParams(req.body);

      CulinaryVacations.findByIdAndUpdate(culinaryVacationId, {
      $set: culinaryVacationsParams
    })
      .then(CulinaryVacation => {
        res.locals.redirect = `/culinaryVacations/${culinaryVacationId}`;
        res.locals.CulinaryVacation = CulinaryVacation;
        next();
      })
      .catch(error => {
        console.log(`Error updating CulinaryVacation by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let culinaryVacationId = req.params.id;
    CulinaryVacations.findByIdAndRemove(culinaryVacationId)
      .then(() => {
        res.locals.redirect = "/culinaryVacations";
        next();
      })
      .catch(error => {
        console.log(`Error deleting culinaryVacationId by ID: ${error.message}`);
        next();
      });
  },
  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK,
      data: res.locals
    });
  },
  errorJSON: (error, req, res, next) => {
    let errorObject;
    if (error) {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      };
    } else {
      errorObject = {
        status: httpStatus.OK,
        message: "Unknown Error."
      };
    }
    res.json(errorObject);
  },
  filterUserCulinaryVacation: (req, res, next) => {
    let currentUser = res.locals.currentUser;
    if (currentUser) {
      let mappedCulinaryVacationId = res.locals.culinaryVacation.map(culinaryVacations => {
        let userJoined = currentUser.culinaryVacations.some(userCulinaryVacation => {
          return userCulinaryVacation.equals(culinaryVacations._id);
        });
        return Object.assign(culinaryVacations.toObject(), { joined: userJoined });
      });
      res.locals.culinaryVacation = mappedCulinaryVacationId;
      next();
    } else {
      next();
    }
  },
  join: (req, res, next) => {
    let culinaryVacationId = req.params.id,
      currentUser = req.user;
    if (currentUser) {
      User.findByIdAndUpdate(currentUser, {
        $addToSet: {
          CulinaryVacations: culinaryVacationId
        }
      })
        .then(() => {
          res.locals.success = true;
          next();
        })
        .catch(error => {
          next(error);
        });
    } else {
      next(new Error("User must log in."));
    }
  }
};
