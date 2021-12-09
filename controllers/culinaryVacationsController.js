"use strict";

const CulinaryVacations = require("../models/culinaryVacations"),
  httpStatus = require("http-status-codes"),
  User = require("../models/user"),
  getCourseParams = body => {
    return {
      title: body.title,
      description: body.description,
      maxStudents: body.maxStudents,
      cost: body.cost
    };
  };

module.exports = {
  index: (req, res, next) => {
        next();
  },
  indexView: (req, res) => {
    res.render("culinaryVacations/index");
  },

  new: (req, res) => {
    res.render("culinaryVacations/new");
  },

  create: (req, res, next) => {
    let courseParams = getCourseParams(req.body);
    CulinaryVacations.create(courseParams)
      .then(course => {
        res.locals.redirect = "/culinaryVacations";
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error saving course: ${error.message}`);
        next(error);
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    let courseId = req.params.id;
    CulinaryVacations.findById(courseId)
      .then(course => {
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("culinaryVacations/show");
  },

  edit: (req, res, next) => {
    let courseId = req.params.id;
    CulinaryVacations.findById(courseId)
      .then(course => {
        res.render("culinaryVacations/edit", {
          course: course
        });
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let courseId = req.params.id,
      courseParams = getCourseParams(req.body);

      CulinaryVacations.findByIdAndUpdate(courseId, {
      $set: courseParams
    })
      .then(course => {
        res.locals.redirect = `/culinaryVacations/${courseId}`;
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error updating course by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let courseId = req.params.id;
    CulinaryVacations.findByIdAndRemove(courseId)
      .then(() => {
        res.locals.redirect = "/culinaryVacations";
        next();
      })
      .catch(error => {
        console.log(`Error deleting course by ID: ${error.message}`);
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
  filterUserCourses: (req, res, next) => {
    let currentUser = res.locals.currentUser;
    if (currentUser) {
      let mappedCourses = res.locals.courses.map(course => {
        let userJoined = currentUser.courses.some(userCourse => {
          return userCourse.equals(course._id);
        });
        return Object.assign(course.toObject(), { joined: userJoined });
      });
      res.locals.courses = mappedCourses;
      next();
    } else {
      next();
    }
  },
  join: (req, res, next) => {
    let courseId = req.params.id,
      currentUser = req.user;
    if (currentUser) {
      User.findByIdAndUpdate(currentUser, {
        $addToSet: {
          courses: courseId
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
