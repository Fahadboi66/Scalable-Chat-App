import mongoose from "mongoose";

async function connectMongo() {
  try{
    const connect = await mongoose.connect(`${process.env.MONGO_URL}`);
    if(!connect) {
      console.log("Erorr connecting mongodb");
      throw new Error("Erorr connecting mongodb")
    }
    console.log("Database Connected Successfully")
  } catch(err) {
    console.log("Error: ", err);
    process.exit(1);
  }
}

export { connectMongo };