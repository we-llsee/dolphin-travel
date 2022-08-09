const { ObjectId } = require("mongodb");

module.exports = [
  {
    tripName: "Greece Wedding",
    attending: ["will"],
    startDate: new Date(2022, 9, 3),
    endDate: new Date(2022, 9, 8),
    budgetGBP: 1000,
    country: "Greece",
    accommodation: {
      accommodationName: "Super Paradise Beach",
      latitude: 37.415,
      longitude: 25.368,
      address: { address: "Super Paradise Beach, Mikonos 846 00, Greece" },
    },
    days: [
      {
        date: new Date(2022, 9, 5),
        activities: [
          {
            _id: ObjectId(),
            activityName: "Mykonos Dive Center",
            latitude: 37.410,
            longitude: 25.356,
            address: {"name":"Mykonos Dive Center","road":"f","city":"Plintri","state":"Aegean","postcode":"84600","country":"Greece","country_code":"GR"},
            type:"sport"
          },
        ],
      },
      {
        date: new Date(2022, 9, 6),
        activities: [
          {
            _id: ObjectId(),
            activityName: "Jackie O' Beach Club",
            latitude: 37.414,
            longitude: 25.367,
            address: {address:"Jackie O' Beach Club, Μύκονος 84600, Greece"},
            type:"bar"
          },
        ],
      }
    ],
  },
  {
    tripName: "Berlin Weekend",
    attending: ["will"],
    startDate: new Date(2023, 3, 31),
    endDate: new Date(2023, 4, 3),
    budgetGBP: 1000,
    country: "Germany",
    accommodation: {
      accommodationName: "Airbnb",
      latitude: 52.502,
      longitude: 13.416,
      address: { address: "Oranienstraße 40, 10999 Berlin, Germany" },
    },
    days: [
      {
        date: new Date(2023, 4, 1),
        activities: [
          {
            _id: ObjectId(),
            activityName: "Ritter Butzke",
            latitude: 52.502,
            longitude: 13.408,
            address: {address:"Ritterstraße 24-27, 10969 Berlin, Germany"},
            type:"club"
          },
        ],
      },
      {
        date: new Date(2023, 4, 2),
        activities: [
          {
            _id: ObjectId(),
            activityName: "DDR Museum",
            latitude: 52.519,
            longitude: 13.402,
            address: {address:"Vera Britain Ufer, Karl-Liebknecht-Str. 1, 10178 Berlin, Germany"},
            type:"museum"
          },
          {
            _id: ObjectId(),
            activityName: "Großer Tiergarten",
            latitude: 52.513594,
            longitude: 13.358374,
            address: {address:"Str. des 17. Juni, 10785 Berlin, Germany"},
            type:"park"
          }
        ],
      },
      {
        date: new Date(2023, 4, 3),
        activities: [
          {
            _id: ObjectId(),
            activityName: "Shishi",
            latitude: 52.502141,
            longitude: 13.411241,
            address: {address:"Ritterstraße 12-14, 10969 Berlin, Germany"},
            type:"restaurant"
          },
        ],
      }
    ],
  },
  {
    tripName: "Team 2 Getaway",
    attending: ["willclegg", "jesskemp", "alexrong", "mohamedelrofai"],
    startDate: new Date(2022, 8, 1),
    endDate: new Date(2022, 8, 8),
    budgetGBP: 1580,
    country: "Czech Republic",
    accommodation: {
        accommodationName: "Hotel Pod Věží",
        latitude: 50.0873932,
        longitude: 14.4066676,
        address: {
            name: "Hotel Pod Věží",
            house_number: "2",
            road: "Mostecká",
            city: "Prague",
            state: "Prague",
            postcode: 11800,
            country: "Czechia",
            country_code: "CZ"
        },
    },
    days : [
        {
            date : new Date(2022, 8, 2),
            activities: [
                {
                    _id: ObjectId(),
                    activityName: "Old Town",
                    latitude: 50.0842845,
                    longitude: 14.4178391,
                    address: {
                        suburb: "Old Town",
                        city_district:"Prague",
                        city: "Prague",
                        state: "Prague",
                        country: "Czechia",
                        country_code: "cz"
                    },
                    type : "administrative"
                },
                {
                    _id: ObjectId(),
                    activityName: "Astronomical clock",
                    latitude: 50.0869939,
                    longitude: 14.4207067,
                    address: {
                        attraction: "Astronomical clock",
                        road: "Staroměstské náměstí",
                        suburb: "Old Town",
                        city_district: "Prague",
                        city: "Prague",
                        state: "Prague",
                        postcode: "110000",
                        country: "Czechia",
                        country_code: "cz"
                    },
                    type : "attraction"
                }
            ]
        },
        {
            date : new Date(2022, 8, 5),
            activities: [
                {
                    _id: ObjectId(),
                    activityName: "Charles Bridge",
                    latitude: 50.0866258,
                    longitude: 14.410148493264568,
                    address: {
                            attraction: "Charles Bridge",
                            road: "Charles Bridge",
                            suburb: "Old Town",
                            city_district: "Prague",
                            city: "Prague",
                            state: "Prague",
                            postcode: "116 93",
                            country: "Czechia",
                            country_code: "cz"
                    },
                    type : "attraction"
                }
            ]
        },
        {
            date : new Date(2022, 8, 6),
            activities: [
                {
                    _id: ObjectId(),
                    activityName: "SOVA",
                    latitude: 50.0768013,
                    longitude: 14.43389,
                    address: {
                        restaurant: "SOVA",
                        house_number: "392\/4",
                        road: "Balbínova",
                        suburb: "Vinohrady",
                        city: "Prague",
                        state: "Prague",
                        postcode: "12000",
                        country: "Czechia",
                        country_code: "cz"
                    },
                    type : "restaurant"
                }
            ]
        }
    ]
  },
  {
    tripName: "Solo Rome Trip",
    attending: ["jesskemp"],
    startDate: new Date(2023, 5, 14),
    endDate: new Date(2023, 5, 25),
    budgetGBP: 1200,
    country: "Italy",
    accommodation: {
        accommodationName: "Hotel Condotti",
        latitude: 41.906157,
        longitude: 12.4807306,
        address: {
            hotel: "Hotel Condotti",
            house_number: "37",
            road: "Via Mario de’ Fiori",
            quarter: "Campo Marzio",
            suburb: "Municipio Roma I",
            city: "Rome",
            county: "Roma Capitale",
            state: "Lazio",
            postcode: "00187",
            country: "Italy",
            country_code: "it"
        },
    },
    days : [
        {
            date : new Date(2023, 5, 15),
            activities: [
                {
                    _id: ObjectId(),
                    activityName: "Colosseum",
                    latitude: 41.8902614,
                    longitude: 12.493087103595503,
                    address: {
                        attraction: "Colosseum",
                        road: "Piazza del Colosseo",
                        quarter: "Celio",
                        suburb: "Municipio Roma I",
                        city: "Rome",
                        county: "Roma Capitale",
                        state: "Lazio",
                        postcode: "00184",
                        country: "Italy",
                        country_code: "it"
                    },
                    type : "attraction"
                },
            ]
        }
    ]
  }
];
