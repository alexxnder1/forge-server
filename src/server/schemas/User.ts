import { Schema , model } from "mongoose";

export interface IUser {
    name: string,
    password: string,
    email: string,
    socialClub: string,
    chat: {
        width: number,
        height: number,
        fontSize: number,
        spacing: number,
        timestamp: boolean,
        links: boolean
    },
    operator: boolean,
    staff: boolean,

    cash: number,
    bank: number
}

const userSchema = new Schema<IUser>({
    name: {type:  String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    socialClub: {type: String, required: true},
    chat: {
        width: { type: Number, default: 500, required: true },
        height: { type: Number, default: 300, required: true },
        fontSize: { type: Number, default: 12, required: true },
        spacing: { type: Number, default: 0, required: true },
        timestamp: { type: Boolean, default: true, required: true },
        links: { type: Boolean, default: true, required: true }
    },

    operator: {type: Boolean, default: false}, 
    staff:  {type: Boolean, default: false},

    cash: {type:Number, default: 1000, rqeuired: true},
    bank: {type:Number, default: 0, rqeuired: true},
});

export default model<IUser>("User", userSchema);