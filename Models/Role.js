import {Schema, model} from "mongoose";

const Role = new Schema({
  value: {type: String, uniquie: true, default: "user"},
});

export default model('Role', Role);
