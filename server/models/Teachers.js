module.exports = (sequelize, DataTypes) => {
    const Teachers = sequelize.define("Teachers", {
      teacherNumber: {
        type: DataTypes.STRING,
        allowNull: false, // Ensure it can't be null
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
  
    return Teachers;
  };
  