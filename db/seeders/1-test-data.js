const created_at = new Date();
const updated_at = new Date();

const createSlot = async (queryInterface, Sequelize, transaction, code) => {
  await queryInterface.bulkInsert(
    "slot",
    [
      {
        start: created_at,
        duration: 10,
        created_at,
        updated_at,
      },
      {
        start: created_at,
        duration: 20,
        created_at,
        updated_at,
      },
      {
        start: created_at,
        duration: 30,
        created_at,
        updated_at,
      },
    ],
    {
      transaction,
    }
  );
  const [{ id: schedule_id }] = await queryInterface.sequelize.query(
    "SELECT id FROM schedule WHERE code = :code",
    {
      replacements: { code },
      type: Sequelize.QueryTypes.SELECT,
      transaction,
    }
  );
  return schedule_id;
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await createSlot(
        queryInterface,
        Sequelize,
        transaction,
        scheduleCode,
        venueId
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
        await queryInterface.bulkDelete(
          "slot",
          {
            id: {
              [Sequelize.Op.ne]: null,
            },
          },
          {
            transaction,
          }
        );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
