import { IUser } from "@/schemas/User";
declare global {
    interface Chat {
        send(s: string, f?: string, local?: boolean): void;
        sendSyntax(s: string): void;
        sendAdmin(s: string):void;
        init(user: IUser): void;
    }
}

export {};