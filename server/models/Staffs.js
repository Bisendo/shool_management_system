module.exports = (sequelize, DataTypes) => {
  const Staffs = sequelize.define("Staffs", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    schoolName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'teacher'),
      allowNull: false,
    },
    
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });


  Staffs.associate = (models) => {
    Staffs.hasMany(models.Teachers, {
      foreignKey: "adminId",
      as: "admin", // Ensure this alias matches
    });
  };

  return Staffs;
};
