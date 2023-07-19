import { LOG_TYPE } from "./schemas/Logs";
import Log from "./schemas/Logs";

export interface LogManager {
    insert(s: string, type?: LOG_TYPE): void;
}

export const logManager: LogManager = {
    insert(s: string, type?: LOG_TYPE) {
        if(s.length === 0)
            return;
            
        const newLog = new Log({content: s, logType: type});
        newLog.save();
        console.log(s);
    }
};
