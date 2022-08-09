const client = require("../../db/connection");

function getUsers() {
  return client.connect().then(() => {
    const db = client.db("test");
    const trips = db.collection("trips");

    const query = {
      attending: { $in: ["willclegg"] },
    };

    trips
      .find(query)
      .toArray()
      .then((arr) => {
        console.log(arr);
      })
      .then(() => {
        return client.close();
      });
  });
}

getUsers();
