module.exports = (sequelize, DataTypes) => {
  class Slot extends sequelize.Sequelize.Model {
    static associate(models) {
      Slot.hasMany(models.Time);
    }
  }
  Slot.init(
    {
      start: DataTypes.TIME,
      duration: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: "slot",
      underscored: true,
    }
  );
  return Slot;
};
