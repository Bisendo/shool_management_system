module.exports = (sequelize, DataTypes) => {
  const Students = sequelize.define("Students", {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Full Name is required" },
        notEmpty: { msg: "Full Name cannot be empty" }
      }
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Grade/Class is required" },
        notEmpty: { msg: "Grade/Class cannot be empty" }
      }
    },
    rollNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "This Roll Number already exists"
      },
      validate: {
        notNull: { msg: "Roll Number is required" },
        notEmpty: { msg: "Roll Number cannot be empty" }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Phone Number is required" },
        notEmpty: { msg: "Phone Number cannot be empty" },
        is: {
          args: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
          msg: "Please provide a valid Phone Number"
        }
      }
    },
    parentName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: { msg: "Parent Name cannot be empty if provided" }
      }
    },
    parentContact: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: { msg: "Parent Contact cannot be empty if provided" },
        is: {
          args: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
          msg: "Please provide a valid Parent Contact Number"
        }
      }
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Stores filename/path of passport photo"
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    paranoid: true, // Enables soft deletion
    indexes: [
      {
        unique: true,
        fields: ['rollNumber']
      },
      {
        fields: ['adminId'] // Improves query performance for admin-specific queries
      }
    ]
  });

  Students.associate = (models) => {
    Students.belongsTo(models.Users, {
      foreignKey: 'adminId',
      as: 'admin',
      onDelete: 'CASCADE' // Automatically delete students if admin is deleted
    });
  };

  return Students;
};