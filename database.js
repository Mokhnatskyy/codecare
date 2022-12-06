const { DataTypes } = require("sequelize");
// const fs = require("fs");
// const path = require("path");
const { Slot } = require("../../db/models/slot");
// const parseSQLFile = (file) =>
//   fs
//     .readFileSync(path.resolve(__dirname, `../sql/${file}.sql`), "utf8")
//     .split(/\r?\n/)
//     .filter((line) => !line.trim().startsWith("--"))
//     .join(" ");

// const getWaitingTimeSQL = parseSQLFile("getWaitingTime");

const db = async (sequelize) => {
  if (Object.keys(sequelize.models).length > 0) {
    return sequelize.models;
  }
  const models = [
    Slot,
    Time,
  ];
  const instances = models.reduce((accumulator, model) => {
    const instance = model(sequelize, DataTypes);
    accumulator[instance.name] = instance;
    return accumulator;
  }, {});

  await Promise.all(
    Object.values(instances).map((model) => model.associate(instances))
  );

  return sequelize.models;
};

module.exports = {
  db,
};
