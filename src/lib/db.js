import mongoose from "mongoose";

const connectMongo = async () => {
    mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log("something Went Wrong", err));
};

export default connectMongo;
