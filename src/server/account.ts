import { HEX_COLORS } from "@shared/colors";
import { IUser } from "./schemas/User";

mp.events.add("playerJoin", (player: PlayerMp) => {
    const account: Account = {
        loginTries: 0,
        logged: false,
        operator: false,
        staff: false,
        cash: 0,
        bank: 0,
        id :0
    };

    player.account = account;
});

mp.events.add("player.loadAccountData", (player: PlayerMp, res: IUser): any => {
    player.call("onPlayerLogged", [res]);
    player.chat!.init(res);
    player.chat.send(`Welcome back, <span style="color: red">${player.name}!</span>`);
    
    player.account.id = mp.players.toArray().indexOf(player);
    player.account.operator = res.operator;
    player.account.staff = res.staff;
    player.account.cash = res.cash;
    player.account.bank = res.bank;

    if(player.account.operator || player.account.staff)
    {
        player.chat.send(`${HEX_COLORS.orange}(server)${HEX_COLORS.white} Your account is part of our administrators.`);
        
        player.chat.send(`${HEX_COLORS.orange}>> ${HEX_COLORS.white}Operator: ${HEX_COLORS.orange}${player.account.operator}${HEX_COLORS.white}.`);
        player.chat.send(`${HEX_COLORS.orange}>> ${HEX_COLORS.white}Staff: ${HEX_COLORS.orange}${player.account.staff}${HEX_COLORS.white}.`);
    }
});