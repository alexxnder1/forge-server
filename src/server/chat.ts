import { HEX_COLORS } from "@shared/colors";
import User, { IUser } from "./schemas/User";

const BROADCAST_DISTANCE: number = 10;

export var commands: Array<Command> = [];

export class Command {
    name: Array<string> | string;
    callback: (player: PlayerMp, args: any | any[]) => void;

    constructor(name: Array<string> | string, callback: (player: PlayerMp, args: any | any[]) => void) {
        this.name = name;
        this.callback = callback;       
        commands.push(this);
    }
}

mp.events.add("playerJoin", (player: PlayerMp) => {
    var chat: Chat = {
        send(s: string) {
            player.call("chat.send.message", ["", s]);
        },

        sendAdmin(s: string) {
            mp.players.forEach(p => {
                if(p.account.operator || p.account.staff)
                    this.send(`${HEX_COLORS.orange} ${s}`);
            });
        },

        sendSyntax(s: string) {
            this.send(`${HEX_COLORS.orange}Syntax: ${HEX_COLORS.white}${s}`);
        },

        init(res: IUser) {
            player.call("chat.create");
            player.account.chat = res.chat;

            var pureCmds: Array<string> = [];
            commands.forEach(cmd => {
                if(Array.isArray(cmd.name))
                {
                    cmd.name.forEach(element => {
                        pureCmds.push(element)
                    });
                }
                else pureCmds.push(String(cmd.name));
            })

            player.call("chat.set.settings", [pureCmds, res.chat.width, res.chat.height, res.chat.fontSize, res.chat.spacing, res.chat.timestamp, res.chat.links]);
        }
    }

    player.chat = chat;
});
// 

mp.events.add("chat.broadcast.message", (player: PlayerMp, _:any, text: string) => {
    if(text.startsWith("/")) {
        var exists = false;
        commands.forEach((cmd: Command) => {
            var extractedCmd =  text.split("/")[1].split(" ")[0];
            // console.log(cmd.name);
            if(Array.isArray(cmd.name))
            {
                cmd.name.forEach(element => {
                    if(element === extractedCmd)
                    {
                        cmd.callback(player, text.split(`/${element}`)[1].split(" ").splice(1));
                        exists = true;
                    }
                });
            }

            else {
                if(cmd.name === extractedCmd)
                {
                    cmd.callback(player, text.split(`/${cmd.name}`)[1].split(" ").splice(1));
                    exists = true;
                }
            }
        })
        
        if(!exists)
            return player.chat.send("Error: Unknown command.");
    } 

    mp.players.forEach((target:PlayerMp) => {
        if(target.dist(player.position) <= BROADCAST_DISTANCE)
            target.call("chat.send.message", [target.name, text, (target === player)]);
    });
});


mp.events.add("chat.update.data", async(player:PlayerMp , _:any, width: number, height: number, fontSize: number, spacing: number, timestamp: boolean, links:boolean): Promise<any> => {
    await User.updateOne({ socialClub: player.socialClub }, { $set: { chat: { width: width || 500, height: height || 300, fontSize: fontSize|| 6, spacing: spacing || 0, timestamp: timestamp, links: links }}}).catch(err => console.log(err));  
}); 