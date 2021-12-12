"use strict";

const mongoose = require("mongoose"),
  { Schema } = require("mongoose");

var culinaryVacationsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      default:"None specified",
      required: true
    },
    heroImage: {
      type: String,
      default:"cuisine2.jpg",
    },
    cuisine: {
      type: [String],
      default:["", "Continental", "Traditional", "Haute-cuisine", "Nouvelle-cuisine", "Fusion", "Vegan", "Vegetarian", "Asian", "Indian", "Middle-Eastern", "African", "Central American", "South American"],
      required: true
    },
    cost: {
      type: Number,
      default:0,
      min: [0, "Vacation packages cannot have a negative cost"]
    },
    maxTravelers: {
      type: Number,
      default:0,
      min: [0, "Vacation packages cannot have a negative number of travelers"],
      max:[25,"Vacation packages cannot have more than 25 travelers"]
    },
    destination: {
      type: String,
      default:"None specified",
      required: true
    },
    departureLocation: {
      type: [String],
      default: ["", "New York (JFK)", "Boston (BOS)", "Chicago (ORD)", "Miami (MIA)", "St. Louis (STL)", "Dallas (DFW)", "Seattle (SEA)", "San Francisco (SFO)"],
      required: true
    },
    destination: {
      type: String,
      default:"None specified",
      required: true
    },
    departureDate: {
      type: Date,
      default: Date.now,
      required: true
    },
    returnDate: {
      type: Date,
      default: Date.now,
      required: true
    }
  },
);
module.exports = mongoose.model("CulinaryVacations", culinaryVacationsSchema);




/* 
title	String; must be unique; minimum length of 3; trim off the extra spaces at the front and end; required
description	String; required; trim spaces; default value of "None specified"
heroImage	String; required; defaults to "HeroImage.jpg"
cuisine	String; required; value can only be one of the following: "", "Continental", "Traditional", "Haute-cuisine", "Nouvelle-cuisine", "Fusion", "Vegan", "Vegetarian", "Asian", "Indian", "Middle-Eastern", "African", "Central American", "South American"
cost	Numeric; default of 0; minimum value of 0 with error string of "Vacation packages cannot have a negative cost"
maxTravelers	Numeric; defaults to 0; maximum value of 25 with error string of "Vacation packages cannot have more than 25 travelers"; minimum value of 0 with error string of "Vacation packages cannot have a negative number of travelers"
destination	String; defaults to "None specified"; required

departureLocation	String; required; value can only be one of the following: "", "New York (JFK)", "Boston (BOS)", "Chicago (ORD)", "Miami (MIA)", "St. Louis (STL)", "Dallas (DFW)", "Seattle (SEA)", "San Francisco (SFO)"
departureDate	Date; required; defaults to Date.now
returnDate	Date; required; defaults to Date.now
*/