const { isMatch } = require("date-fns");
const { Op } = require("sequelize");

const baseService = require("./baseService");
const { ValidationError, NotFoundError } = require("../lib/errors");
const { db } = require("../lib/db");

const validateData = (data) => {
  const errors = [];

  if (data.start && !isMatch(data.start, "HH:mm:ss")) {
    errors.push(`start time must be in the format "HH:mm:ss"`);
  }

  if (data.duration && typeof data.duration !== "number") {
    errors.push("duration must be a number");
  }

  if (errors.length) {
    throw new ValidationError("001", errors.join(", "));
  }
};

const updateSlot = (event) => {
  return baseService(async (sequelize) => {
    console.log("Event received: ", event);

    const body = JSON.parse(event.body);
    const { id, start, duration } = event.pathParameters;

    validateData(body);
    const { Slot } = await db(sequelize);

    const { id: slotId } = await Slot.findByPk(id);

    if (!slotId) {
      throw new NotFoundError("002");
    }

    try {
      await Slot.update(
        {
          start,
          duration,
        },
      );
      return {
        statusCode: 204,
        body: null,
      };

    } catch (error) {
      throw new ValidationError(error.code ?? 500, error.message);
    }
  } )};

const filter = async (event) => {
  return baseService(async (sequelize) => {
    console.log("Event received", event);

    const { Slot } = await db(sequelize);

    const slots = await Slot.findAll();

    return {
      body: { slots },
    };
  });
};


const createSlots = async (event) => {
  return baseService(async (sequelize) => {
    const data = JSON.parse(event.body);
    const { slots } = data;

  
    const createSlotsData = slots.map(
      ({ start, duration }) => ({
        start,
        duration,
      })
    );

    const { Slot } = await db(sequelize);
    const slotsBulk = await Slot.bulkCreate(createSlotsData);
    return {
      body: { slotsBulk },
      statusCode: 200,
    };
  })
};

const deleteSlots = async (event) => {
  return baseService(async (sequelize) => {
    console.log("Event received: ", event);

    const data = JSON.parse(event.body);
    const { slots } = data;
    if (!Array.isArray(slots)) {
      throw new ValidationError("030");
    }
    const { Slot } = await db(sequelize);

    // check the schedule_id against slots
    const checkBoxSlot = await Slot.findAll({
      where: {
        id: {
          [Op.in]: slots,
        },
      },
    });

    if (checkBoxSlot.length) {
      throw new ValidationError("029");
    }
    try {
      const deletedBoxSlot = await BoxSlot.destroy({
        where: {
          id: { [Op.in]: slots },
        }
      });
      console.log("Delete performed. Affected rows: ", deletedBoxSlot);
      return {
      statusCode: 204,
      body: null,
    };
    } catch (error) {
      console.error("Error when deleting box slot", error);

      throw new ValidationError(error.code ?? 500, error.message);
    }
  })
}

module.exports = {
  updateSlot,
  filter,
  createSlots,
  deleteSlots,
};
