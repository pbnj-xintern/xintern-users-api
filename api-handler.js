'use strict';
const axios = require('axios')

const TEST_KEY = process.env.TEST_KEY

//--------------- FUNCTIONS ---------------

//Returns a success response
const sendOKResponse = (body) => {
  return {
    statusCode: 200,
    headers: { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(body)
  }
}

//Returns an error response
const sendErrorResponse = (statusCode, errorMessage) => {
  console.error('sendErrorRepsonse: console logging error msg:\n', errorMessage)
  return { 
    statusCode: statusCode, 
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ error: errorMessage })
  }
}

//--------------- LAMBDA FUNCTIONS ---------------

module.exports.hello = async (event) => {
  console.log("how tokens/secrets will be stored in serverless:", TEST_KEY)
  return sendOKResponse(`how tokens/secrets will be stored in serverless: ${TEST_KEY}`)
};
