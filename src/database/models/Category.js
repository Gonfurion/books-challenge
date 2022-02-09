module.exports = (sequelize, dataTypes) => {
  let alias = 'Categories';
  let cols = {
    Id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Name: {
      type: dataTypes.STRING
    }
  };
  let config = {
    tableName: 'Categories',
    timestamps: false
  };

  const Categories = sequelize.define(alias, cols, config);
  return Categories;
};