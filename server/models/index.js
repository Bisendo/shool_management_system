'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
const db = {};

let sequelize;

// Initialize Sequelize instance based on environment configuration
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Ensure sequelize is correctly initialized
console.log(sequelize instanceof Sequelize);  // This should log 'true'

// Load all models in the current directory (excluding this file)
fs.readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.endsWith('.js') &&
    !file.endsWith('.test.js') && // Exclude test files
    file !== 'adminloginpage.js'  // Exclude the removed admin login page model
  )
  .forEach(file => {
    const modelPath = path.join(__dirname, file);
    const model = require(modelPath);

    // Ensure the model is a function before invoking it
    if (typeof model === 'function') {
      const initializedModel = model(sequelize, Sequelize.DataTypes);
      db[initializedModel.name] = initializedModel;
    } else {
      console.error(`Error: Model in file "${file}" does not export a valid function.`);
    }
  });

// Set up associations if defined in the models
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach Sequelize instance and library to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
