const axios = require("axios");

const handler = async function (event) {
  try {
    const { q } = event.queryStringParameters;
    const { countrycodes } = event.queryStringParameters;
    let { viewbox } = event.queryStringParameters;
    const key = process.env.LOCATIONIQ_KEY;

    if (viewbox === undefined) {
      viewbox = "";
    } else {
      viewbox = "&viewbox=" + viewbox + "&bounded=1";
    }

    const response = await axios.get(
      `https://eu1.locationiq.com/v1/search?key=${key}&q=${q}&addressdetails=1&countrycodes=${countrycodes}&format=json&normalizeaddress=1${viewbox}`
    );
    if (response.status < 200 || response.status >= 300) {
      return { statusCode: response.status, body: response.statusText };
    }

    return {
      statusCode: 200,
      headers: {
        /* Required for CORS support to work */
        "Access-Control-Allow-Origin": "*",
        /* Required for cookies, authorization headers with HTTPS */
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ msg: response.data }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: "Server Error" }),
    };
  }
};

module.exports = { handler };
