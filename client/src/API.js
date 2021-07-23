/**
 * All the API calls
 */

const BASEURL = '/api';

function getJson(httpResponsePromise) {
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

          response.json()
            .then(json => resolve(json))
            .catch(err => reject({ error: "Cannot parse server response" }))

        } else {
          // analyze the cause of error
          response.json()
            .then(obj => reject(obj)) // error msg in the response body
            .catch(err => reject({ error: "Cannot parse server response" })) // something else
        }
      })
      .catch(err => reject({ error: "Cannot communicate" })) // connection error
  });
}

async function getFantaTeams() {
  // call: GET /api/fantaTeams
  return getJson(
    fetch(BASEURL + '/fantaTeams')
  ).then(json => {
    return json.map((e) => ({ id: e.id, name: e.name, credits: e.credits, p: e.p, d: e.d, c: e.c, a: e.a }));
  })
}

async function getFantaTeam(id) {
  // call: GET /api/fantaTeams
  return getJson(
    fetch(BASEURL + '/fantaTeams/' + id)
  ).then(json => {
    return json.map((e) => ({ ...e }));
  })
}

async function getPlayers(role) {
  // call: GET /api/players
  return getJson(
    fetch(BASEURL + '/players?role=' + role)
  ).then(json => {
    return json.map((e) => ({ ...e }));
  })
}

async function addPurchase(purchase) {
  // call: POST /api/purchase
  return getJson(
    fetch(BASEURL + "/purchase", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(purchase)
    })
  )
}

async function deletePurchase(id, role) {
  // call: DELETE /api/purchase/<id>
  return getJson(
    fetch(BASEURL + '/purchase/' + id, {
      method: 'DELETE'
    })
  )
}

async function logIn(credentials) {
  let response = await fetch('/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    }
    catch (err) {
      throw err;
    }
  }
}

async function logOut() {
  await fetch('/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
  const response = await fetch(BASEURL + '/sessions/current');
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server, mostly unauthenticated user
  }
}

const API = { getFantaTeams, getFantaTeam, getPlayers, addPurchase, deletePurchase, logIn, logOut, getUserInfo };
export default API;