module.exports = (sequelize, DataTypes) => {
  const Teachers = sequelize.define("Teachers", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,  // Automatically increments the teacher id
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experience: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // This is the foreign key for the user
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',  // Referencing the Users table
        key: 'id',       // The id field in the Users table
      },
      onDelete: 'CASCADE',  // If a User is deleted, delete the corresponding Teacher
    }
  });

  // Associations
  Teachers.associate = (models) => {
    // This sets up the association between Teachers and Users using the userId field
    Teachers.belongsTo(models.Users, { foreignKey: 'userId', as: 'user' });
  };

  return Teachers;
};
