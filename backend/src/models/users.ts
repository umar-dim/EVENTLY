import { Schema, model } from "mongoose";

//create an object called users whose properties are username, email, password, and profileUrl
interface Users {
  username: string;
  email: string;
  password: string;
  profileUrl?: string;
}

//create a schema based on the users

const UsersSchema = new Schema<Users>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profileUrl: { type: String, required: false },
});

//save the schema model to the users variable

export const users = model<Users>("User", UsersSchema);
