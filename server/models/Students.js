module.exports = (sequelize, DataTypes) => {
  const Students = sequelize.define("Students", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rollNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parentName: {
      type: DataTypes.STRING,
    },
    parentContact: {
      type: DataTypes.STRING,
    },
    picture: {
      type: DataTypes.STRING,
    },
   
  });

  Students.associate = (models) => {
    Students.belongsTo(models.Teachers, {
      foreignKey: "teacherId",
      as: "Teacher", // Ensure this alias matches
    });
  };
  return Students;
};
