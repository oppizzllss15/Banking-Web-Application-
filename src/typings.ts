// interface IUser {
//   _id?: mongoose.Types.ObjectId;
//   firstname: String;
//   lastname: String;
//   username: String;
//   email: String;
//   phonenumber: Number;
//   "Date of Birth": String;
//   address: String;
//   gender?: String;
//   user_status?: String;
//   password?: String;
//   passwordChanged?: Date;
// }

interface IEmail {
  from?: String;
  email?: String;
  subject?: String;
  message?: String;
}
