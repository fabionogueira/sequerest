const Model = require('../../src/Model');

const TaskModel = new Model('Task', {
    fields: {
        title: Model.DataTypes.STRING
    },
    associate(db){
        db.Task.belongsTo(db.User, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
    }
});

module.exports = TaskModel;
