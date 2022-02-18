const { response } = require("express");

const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "biblechars",
  password: "postgres",
  port: 5432,
});

const getCharacters = (req, res) => {
  pool.query("SELECT * FROM characters", (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
    console.log(res);
  });
};

const addCharacter = (req, res) => {
  try {
    const { name, time, lessons, image } = req.body;
    pool.query(
      `INSERT INTO characters (name, time, lessons, image) VALUES ($1, $2, $3, $4) RETURNING *;`,
      [name, time, lessons, image],
      (error, results) => {
        if (error) {
          console.log(error, "<--- error here");
          throw error;
        }
        console.log(results, "<--- result!");
        res.status(200).json(results.rows);
      }
    );
  } catch (error) {
    throw error;
  }
};

const deleteCharacter = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(`DELETE FROM characters WHERE id = ${id}`, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const getCharacter = (reg, res) => {
  const { id } = req.body;
  console.log(id);
  pool.query(
    "SELECT * FROM characters WHERE id =$1",
    [id],
    (error, results) => {
      if (error) throw error;
      res.status(200).json(results.rows);
    }
  );
};

const updateCharacter = (req, res) => {
  let { name, time, lessons, image, id } = req.body;
  console.log(req.body);
  let myPromise = new Promise(function (resolve, reject) {
    pool.query(
      "SELECT * FROM characters WHERE id =$1",
      [id],
      (error, results) => {
        if (error) throw error;
        else if (res) {
          name = name !== undefined ? name : results.rows.name;
          time = time !== undefined ? time : results.rows.time;
          lessons = lessons !== undefined ? lessons : results.rows.lessons;
          image = image !== undefined ? image : results.rows.image;
          resolve(results.rows);
          return results.rows;
        } else reject();
      }
    );
  });
  myPromise.then(() => {
    try {
      pool.query(
        `UPDATE characters SET name = $1, time = $2, lessons = $3, image = $4 WHERE id = $5;`,
        [name, time, lessons, image, id],
        (error, results) => {
          if (error) {
            console.log(error, "<-- error here");
            throw error;
          }
          console.log(results, "<-- result!");
          res.status(200).json(results.rows);
        }
      );
    } catch (error) {
      throw error;
    }
  });
};

module.exports = {
  getCharacters,
  addCharacter,
  deleteCharacter,
  getCharacter,
  updateCharacter,
};
