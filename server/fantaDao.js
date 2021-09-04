'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const db = require('./db');

// get all fantateams and all informations
exports.getFantaTeams = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM fantateams';
    db.query(sql, (err, rows) => {
      if (err) {
        console.log(err)
        reject(err);
        return;
      }
      const fantateams = rows.rows.map((e) => ({ id: e.id, name: e.name, credits: e.credits, p: e.p, d: e.d, c: e.c, a: e.a }));
      resolve(fantateams);
    });
  });  
};

// get players with role = role
exports.getPlayers = (role) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM player WHERE role= $1';
    db.query(sql, [role], (err, rows) => {
      if (err) {
        console.log(err)
        reject(err);
        return;
      }
      const players = rows.rows.map((e) => ({ ...e }));
      resolve(players);
    });
  });
};

// get team with id = id
exports.getFantaTeam = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT pl.id id, pl.name, pl.role, pl.team team, p.price price FROM fantateams t, purchase p, player pl WHERE t.id = $1 AND t.id = p.fantateams AND pl.id = p.id';
    db.query(sql, [id], (err, rows) => {
      if (err) {
        console.log(err)
        reject(err);
        return;
      }
      const team = rows.rows.map((e) => ({ ...e }));
      resolve(team);
    });
  });
};

// get team with id = id
exports.getPurchased = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM purchase WHERE id=$1 ';
    db.query(sql, [id], (err, rows) => {
      if (err) {
        console.log(err)
        reject(err);
        return;
      }
      const player = rows.rows.map((e) => ({ ...e }));
      resolve(player);
    });
  });
};

// get team with id = id
exports.getNumberRole = (fantateams, role) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT p.id id FROM purchase p, player pl WHERE fantateams=$1 AND p.id = pl.id AND role=$2  ';
    db.query(sql, [fantateams, role], (err, rows) => {
      if (err) {
        console.log(err)
        reject(err);
        return;
      }
      const purchase = rows.rows.map((e) => ({ ...e }));
      resolve(purchase);
    });
  });
};

// add a new purchase
exports.addPurchase = (purchase) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO purchase(id, fantateams, price) VALUES ($1,$2,$3)';
    db.query(sql, [purchase.id, purchase.fantateams, purchase.price], function (err) {
      if (err) {
        //console.log(err)
        reject(err);
        return;
      } else {
        // update team credits and role counter
        const props = { P: 0, D: 0, C: 0, A: 0 }
        props[purchase.role] += 1
        const sql2 = 'UPDATE fantateams SET credits=credits-$1, p=p+$2, d=d+$3, c=c+$4, a=a+$5 WHERE id=$6';
        db.query(sql2, [purchase.price, props.P, props.D, props.C, props.A, purchase.fantateams], function (err) {
          if (err) {
            console.log(err)
            reject(err);
            return;
          } else {
            resolve({});
          }
        })
      }
    });
  });
};


// delete an existing exam
exports.deletePurchase = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT fantateams, price, role FROM purchase p, player pl WHERE p.id = $1 AND p.id = pl.id';
    db.query(sql, [id], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      } else {
        const props = { P: 0, D: 0, C: 0, A: 0 }
        props[rows.rows[0].role] += 1;
        const sql3 = 'UPDATE fantateams SET credits=credits+$1, p=p-$2, d=d-$3, c=c-$4, a=a-$5 WHERE id=$6';
        db.query(sql3, [rows.rows[0].price, props.P, props.D, props.C, props.A, rows.rows[0].fantateams], (err) => {
          if (err) {
            console.log(err);
            reject(err);
            return;
          } else {
            const sql2 = 'DELETE FROM purchase WHERE id = $1';
            db.query(sql2, [id], (err) => {
              if (err) {
                console.log(err);
                reject(err);
                return;
              } else
                resolve(null);
            })
          }
        })
      }
    });
  });
}