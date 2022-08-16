// const fetch = require("node-fetch");
const axios = require("axios");

const handler = async function () {
  try {
    const response = await axios.get(
      `https://eu1.locationiq.com/v1/search?key=pk.925883abdd6280b4428e57337de16f23&q=hilton&addressdetails=1&countrycodes=fr&format=json`
    );
    // if (!response.ok) {
    //   // NOT res.status >= 200 && res.status < 300
    //   return { statusCode: response.status, body: response.statusText };
    // }
    // const data = await response.json();
    console.log(response);

    // return {
    //   statusCode: 200,
    //   body: JSON.stringify({ msg: data.joke }),
    // };
  } catch (error) {
    // output to netlify function log
    console.log(error);
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ msg: error.message }),
    };
  }
};

module.exports = { handler };
