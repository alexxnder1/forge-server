import * as colors from "./json/console-colors.json";
import * as mongoose from "mongoose";

async function main(): Promise<void> {
    await mongoose.connect('mongodb+srv://alexxnder1:KJv9qT5NRCnZbaiT@union-rage.pgj1miu.mongodb.net/');
}

main().catch(err => console.log(err)).then(() => {
    console.log(`${colors.red}[MongoDB]${colors.reset} The connection was successfully established.`);
});