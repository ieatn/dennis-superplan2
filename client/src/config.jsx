import { createClient } from 'contentful';

export const API_URL = 'http://localhost:5000'
// export const API_URL = 'https://superplandevdb.mysql.database.azure.com'
export const domain = 'dev-ttxzeczaiblwyk42.us.auth0.com'
export const clientId = 'Qma6e7qUouKDBoBCpWz18aIB4xJ5nk37'

const client = createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
  accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
});

export { client };