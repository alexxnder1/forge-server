import User from "./schemas/User";
import CryptoJS from "crypto-js";

const HMAC_KEY: string = "dSF@DK"; 

mp.events.add("playerJoin", async(player: PlayerMp) => {
    await User.findOne({socialClub: player.socialClub}).catch(err => console.log(err)).then((res) => {
        if(res) 
            player.call("auth.show.login");
    });
});

mp.events.add("auth.submit.login", async function (player: PlayerMp, _:any, password: string) {    
    await User.findOne({ socialClub: player.socialClub, password: CryptoJS.HmacSHA1(password, HMAC_KEY).toString() }).catch(err => console.log(err)).then((res) => {
        if (res) {
            player.call("auth.destroy");
            mp.events.call("player.loadAccountData", player, res);
            player.spawn(new mp.Vector3(0, 0, 0));
        }

        else{
            player.outputChatBox("Incorrect password.");
            player.account!.loginTries ++;
            console.log(player.account!.loginTries);
            if(player.account!.loginTries == 3)
                player.kick('Too many unsuccesful attempts to login.');
        }
    });
});

mp.events.add("auth.submit.register", (player: PlayerMp, _:any, password: string, cpassword: string, email: string) => {
    if(password.length < 4 || cpassword.length < 4)
        return player.outputChatBox("Passwords are too short.");

    if(password !== cpassword)
        return  player.outputChatBox("Passwords aren't matching.");
        
    if(email.length <= 4)
        return player.outputChatBox("Email is invalid.");
    
    const newUser = new User({
        name: player.name,
        password: CryptoJS.HmacSHA1(password, HMAC_KEY).toString(),
        email: email.toString(),
        socialClub: player.socialClub
    });

    newUser.save();
    player.call("auth.show.login");
    player.outputChatBox("You have successfully registered in our database. Please log in.");
});
