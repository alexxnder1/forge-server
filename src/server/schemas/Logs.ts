import mongoose, { Schema } from "mongoose"

export enum LOG_TYPE {
    LOG_TYPE_ADMIN,
    LOG_TYPE_REGUALR
}

export interface Log {
    date: string,
    hour: string,
    content: string,
    logType: LOG_TYPE
}

const logSchema = new Schema<Log>({
    date: { type: String, required: true, default: new Date().toLocaleDateString('ro')},
    hour: {type: String, requireD: true, default: new Date().toLocaleTimeString('ro')},
    content: {type: String, required: true, default: ""},
    logType: { type: Number, default: LOG_TYPE.LOG_TYPE_REGUALR }
});

export default mongoose.model("Logs", logSchema);