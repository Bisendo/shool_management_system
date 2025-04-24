module.exports = (sequelize, DataTypes) => {
  const Teachers = sequelize.define("Teachers", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    teacherNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Teachers.associate = (models) => {
    Teachers.hasMany(models.Students, {
      foreignKey: "teacherId",
      as: "Students", // Ensure this alias matches
    });

    
  };


  Teachers.associate = (models) => {
    Teachers.belongsTo(models.Staffs, {
      foreignKey: "adminId",
      as: "teachersUnderAdmin"
    });
  };

  return Teachers;
};
