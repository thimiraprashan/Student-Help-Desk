import mongoose from "mongoose";

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    gmail: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    }
});

export default mongoose.model("CStudentModel", studentSchema);