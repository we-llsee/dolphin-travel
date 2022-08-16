const axios = require("axios");

const handler = async function (event) {
  try {

    let {large}= event.queryStringParameters;
    console.log(large);
    console.log(event.queryStringParameters)
    
    const response = await axios.get(
      `https://eu1.locationiq.com/v1/search?key=pk.925883abdd6280b4428e57337de16f23&q=hilton&addressdetails=1&countrycodes=fr&format=json`
    );
    if (response.status<200 || response.status>=300) {
      return { statusCode: response.status, body: response.statusText }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ msg: response.data }),
    }

  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ msg:"Server Error" }),
    };
  }
};

module.exports = { handler };
