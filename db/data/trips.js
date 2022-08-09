const { ObjectId } = require("mongodb");

module.exports = [
  {
    tripName: "Bahamas",
    attending: ["will"],
    startDate: new Date(2022, 08, 08),
    endDate: new Date(2022, 09, 09),
    budgetGBP: 10000,
    country: "Bahamas",
    accomodation: {
      accomodationName: "Beach Shack",
      latitude: 10.5,
      longitude: 10.5,
      address: { address: "test address" },
    },
    days: [
      {
        date: new Date(2022, 12, 08),
        activities: [
          {
            _id:ObjectId(),
            activityName:"Rum Bar",
            latitude:10.5,
            longitude:10.5,
            address: { address: "test address" }
          },
        ],
      }
    ]
  },
  {
    tripName: "Paris",
    attending: ["will", "jess"],
    startDate: new Date(2022, 08, 08),
    endDate: new Date(2022, 09, 09),
    budgetGBP: 100000,
    country: "France",
    accomodation: { 
        accomodationName: "Eiffel Tower",
        latitude:10.77778,
        longitude:11.88787,
        address:{address:'EIFFEL TOWERRRR'}
    },
    days:[
        {
            date:new Date(2022,10,10),
            activities:[]
        }
    ]
  },
];
