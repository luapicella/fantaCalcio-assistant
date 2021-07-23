'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const db = require('./db');

// get all fantaTeams and all informations
exports.getFantaTeams = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM fantaTeams';
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.log(err)
        reject(err);
        return;
      }
      const fantaTeams = rows.map((e) => ({ id: e.id, name: e.name, credits: e.credits, p: e.p, d: e.d, c: e.c, a: e.a }));
      resolve(fantaTeams);
    });
  });
};

// get players with role = role
exports.getPlayers = (role) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM player WHERE role=?';
    db.all(sql, [role], (err, rows) => {
      if (err) {
        console.log(err)
        reject(err);
        return;
      }
      const players = rows.map((e) => ({ ...e }));
      resolve(players);
    });
  });
};

// get team with id = id
exports.getFantaTeam = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT pl.id id, pl.name name, pl.role role, pl.team team, p.price price FROM fantaTeams t, purchase p, player pl WHERE t.id = ? AND t.id = p.fantaTeams AND pl.id = p.id ';
    db.all(sql, [id], (err, rows) => {
      if (err) {
        console.log(err)
        reject(err);
        return;
      }
      const team = rows.map((e) => ({ ...e }));
      resolve(team);
    });
  });
};

// get team with id = id
exports.getPurchased = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM purchase WHERE id=? ';
    db.all(sql, [id], (err, rows) => {
      if (err) {
        console.log(err)
        reject(err);
        return;
      }
      const player = rows.map((e) => ({ ...e }));
      resolve(player);
    });
  });
};

// get team with id = id
exports.getNumberRole = (fantaTeams, role) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT p.id id FROM purchase p, player pl WHERE fantaTeams=? AND p.id = pl.id AND role=?  ';
    db.all(sql, [fantaTeams, role], (err, rows) => {
      if (err) {
        console.log(err)
        reject(err);
        return;
      }
      const purchase = rows.map((e) => ({ ...e }));
      resolve(purchase);
    });
  });
};

// add a new purchase
exports.addPurchase = (purchase) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO purchase(id, fantaTeams, price) VALUES (?,?,?)';
    db.run(sql, [purchase.id, purchase.fantaTeams, purchase.price], function (err) {
      if (err) {
        //console.log(err)
        reject(err);
        return;
      } else {
        // update team credits and role counter
        const props = { P: 0, D: 0, C: 0, A: 0 }
        props[purchase.role] += 1
        const sql2 = 'UPDATE fantaTeams SET credits=credits-?, p=p+?, d=d+?, c=c+?, a=a+? WHERE id=?';
        db.run(sql2, [purchase.price, props.P, props.D, props.C, props.A, purchase.fantaTeams], function (err) {
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
    const sql = 'SELECT fantaTeams, price, role FROM purchase p, player pl WHERE p.id = ? AND p.id = pl.id';
    db.all(sql, [id], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      } else {
        const props = { P: 0, D: 0, C: 0, A: 0 }
        props[rows[0].role] += 1;
        const sql3 = 'UPDATE fantaTeams SET credits=credits+?, p=p-?, d=d-?, c=c-?, a=a-? WHERE id=?';
        db.run(sql3, [rows[0].price, props.P, props.D, props.C, props.A, rows[0].fantaTeams], (err) => {
          if (err) {
            console.log(err);
            reject(err);
            return;
          } else {
            const sql2 = 'DELETE FROM purchase WHERE id = ?';
            db.run(sql2, [id], (err) => {
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