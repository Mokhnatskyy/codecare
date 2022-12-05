const {
  updateSlot,
  filter,
  createSlots,
  deleteSlots,
} = require("../services/boxSlots");

const updateHandler = async (event) => updateSlot(event);
const createHandler = async (event) => createSlots(event);
const filterHandler = async (event) => filter(event);
const deleteHandler = async (event) => deleteSlots(event);

module.exports = {
  updateHandler,
  createHandler,
  filterHandler,
  deleteHandler,
};
