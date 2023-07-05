import { IUser } from "@/schemas/User";
declare global {
    interface Chat {
        send(s: string): void;
        init(user: IUser): void;
    }
}

export {};