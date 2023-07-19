import { GenerateDoubleArrayColors, HEX_COLORS } from "@shared/colors";
import { Command } from "./chat";
import { GetAvailableSeats, vehicleManager } from "./vehicles/vehicleManager";

new Command(["spawncar", "spawnveh", "veh", "car", "vehicle", "spawnvehicle"], (player: PlayerMp, args: any) => {
    if(!player.account.operator && !player.account.staff)
        return player.chat.send("You have not the necessary administration level to use this command.");

    if(args.length === 0)
        return player.chat.sendSyntax("/spawncar [modelName]");

    var modelName = args[0], colors = GenerateDoubleArrayColors();
    let vehicle = vehicleManager.create(mp.joaat(modelName), player.position, colors, player.heading, "ADMIN");
    setTimeout(() => {
        player.putIntoVehicle(vehicle, 0);
    }, 500);

    player.chat.sendAdmin(`Admin ${player.name} (${player.account.id}) spawned an ${modelName} with an id of ${vehicleManager.vehicles.indexOf(vehicle)}.`);
});

new Command(["despawncar", "despawnveh", "despawnvehicle", "destroycar", "destroyveh"], (player: PlayerMp, args: any) => {
    if(!player.account.operator && !player.account.staff)
        return player.chat.send("You have not the necessary administration level to use this command.");

    var vehicle: any, id = args[0];
    if(!id || !isNaN(id))
    {
        if(!player.vehicle)
            return player.chat.sendSyntax("/despawncar [id]");

        vehicle = player.vehicle;
    }

    else vehicle = vehicleManager.vehicles.at(id);

    if(!vehicleManager.vehicles.includes(vehicle))
        return player.chat.send("Error: That vehicle is not spawned.");

    player.chat.sendAdmin(`Admin ${player.name} (${player.account.id}) destroyed vehicle with id of ${vehicleManager.vehicles.indexOf(vehicle)}`)    
    vehicleManager.vehicles = vehicleManager.vehicles.filter(e => e !== vehicle);
    player.call("playerLeaveVehicle", [vehicle]);
    vehicle.destroy();
});

new Command(["vre", "respawnveh", "respawncar", "respawnvehicle"], (player: PlayerMp, args: any) => {
    if(!player.account.operator && !player.account.staff)
        return player.chat.send("You have not the necessary administration level to use this command.");

    var veh: VehicleMp, id = args[0];
    if(player.vehicle)
        veh = player.vehicle;

    else {
        if(isNaN(id))
            return player.chat.sendSyntax("/respawnvehicle [id]");
        
        if(vehicleManager.vehicles[id] === undefined)
            return player.chat.send("Error: Invalid vehicle.");
        
        veh = vehicleManager.vehicles[id];
    }
    
    let vehicle = vehicleManager.create(veh.model, veh.position, [veh.getColorRGB(0), veh.getColorRGB(1)], veh.heading);    
    if(player.vehicle === vehicle)
    {
        setTimeout(() => {
            player.putIntoVehicle(vehicle, 0);
        }, 500);
    }

    vehicleManager.vehicles.push(vehicle);
    player.chat.sendAdmin(`Admin ${player.name} (${player.account.id}) respawned vehicle with an id of ${vehicleManager.vehicles.indexOf(veh)}.`);
    vehicleManager.vehicles = vehicleManager.vehicles.filter(e => e !== veh);
    veh.destroy();
});

new Command(["closestcar", "closetveh", "closestvehicle"], (player: PlayerMp) => {
    if(!player.account.operator && !player.account.staff)
        return player.chat.send("You have not the necessary administration level to use this command.");

    var closestStruct: any = {
        closest: 9999999,
        veh: null
    }

    vehicleManager.vehicles.forEach(veh => {
        let distance = player.dist(veh.position);
        if(distance < closestStruct.closest)
        {
            closestStruct.name = distance;
            closestStruct.veh = veh;
        }
    })    

    let veh = closestStruct.veh;
    if(veh === null)
        return player.chat.send("Error: There is not any vehicle near you.");
    
    let seat = GetAvailableSeats(closestStruct.veh);
    if(seat !== -1) {
        player.call("playerLeaveVehicle", [closestStruct.veh]);
        player.putIntoVehicle(closestStruct.veh, seat);
    }

    else player.position = veh.position + new mp.Vector3(3, 0, 2);
    player.chat.sendAdmin(`Admin ${player.name} (${player.id}) teleported to the closest vehicle in his area (id ${vehicleManager.vehicles.indexOf(veh)}).`)
});

new Command(["gotocar", "gotoveh", "gotovehicle"], (player: PlayerMp, args: any) => {
    if(!player.account.operator && !player.account.staff)
        return player.chat.send("You have not the necessary administration level to use this command.");

    var id = args[0];
    if(isNaN(id))
        player.chat.sendSyntax("/gotocar [id]");

    var veh: any = vehicleManager.vehicles[id];
    if(!veh)
        return player.chat.send("Error: Invalid vehicle id.");

    var seat = GetAvailableSeats(veh);
    if(seat !== -1)
        player.putIntoVehicle(veh, seat);

    else         
        player.position = veh.position + new mp.Vector3(2, 0, 2); 

    player.chat.sendAdmin(`Admin ${player.name} (${player.id}) teleported to vehicle ${id}.`);
});

new Command(["getcar", "getveh", "getvehicle"], (player: PlayerMp, args: any) => {
    if(!player.account.operator && !player.account.staff)
        return player.chat.send("You have not the necessary administration level to use this command.");

    var id = args[0];
    if(isNaN(id) || !id)
        player.chat.sendSyntax("/getveh [id]");

    var veh: VehicleMp | undefined = vehicleManager.vehicles[id];
    if(!veh)
        return player.chat.send("Error: Invalid vehicle id.");

    veh.position = player.position.add(new mp.Vector3(0, 5, 0));
    player.chat.sendAdmin(`Admin ${player.name} (${player.id}) teleported vehicle ${id} to him.`);
});

new Command(["slapcar", "slapveh", "slapvehicle"], (player: PlayerMp, args: any) => {
    if(!player.account.operator && !player.account.staff)
        return player.chat.send("You have not the necessary administration level to use this command.");
    
    var id = args[0];
    if(isNaN(id) || !id)
        return player.chat.sendSyntax("/slapcar [id]");
        
    if(!vehicleManager.vehicles[id])
        return player.chat.send("Error: Invalid vehicle id.");

    var pos = vehicleManager.vehicles[id].position;
    vehicleManager.vehicles[id].position = pos.add(new mp.Vector3(3, 2, 2));
    player.chat.sendAdmin(`Admin ${player.name} (${player.id}) slapped vehicle with an id of ${id}.`);
});

new Command(["fixveh", "fixcar", "fixvehicle", "fv"], (player: PlayerMp, args: any) => {
    if(!player.account.operator && !player.account.staff)
        return player.chat.send("You have not the necessary administration level to use this command.");
    
    var id = args[0];    
    if(player.vehicle)
        player.vehicle.repair();
        
    else {
        if(!id || !isNaN(id))
            return player.chat.sendSyntax("/fixveh [id]");

        if(!vehicleManager.vehicles[id])
            return player.chat.send("Error: Invalid vehicle id.");

        vehicleManager.vehicles[id].repair();
    }

    player.chat.sendAdmin(`Admin ${player.name} (${player.id}) repaired vehicle with id of ${(player.vehicle) ? vehicleManager.vehicles.indexOf(player.vehicle): id}.`);
});

new Command(["goto", "gotoplayer"], (player: PlayerMp, args: any) => {
    if(!player.account.operator && !player.account.staff)
        return player.chat.send("You have not the necessary administration level to use this command.");

    var id = args[0];
    if(!isNaN(id) || !id)
        return player.chat.sendSyntax("/gotoplayer [id]");

    var target = mp.players.at(id);
    if(target === player)
        return player.chat.send("You cannot teleport to yourself.");

    player.position = target.position;
    target.chat.send(`${HEX_COLORS.grey} Admin ${player.name} teleported to you.`);
    player.chat.sendAdmin(`Admin ${player.name} (${player.id} teleported to ${target.name} (${target.id}) using (/goto).`);
});

new Command(["gethere", "gethere player"], (player: PlayerMp, args: any) => {
    if(!player.account.operator && !player.account.staff)
        return player.chat.send("You have not the necessary administration level to use this command.");

    var id = args[0];
    if(!isNaN(id) || !id)
        return player.chat.sendSyntax("/gethere [id]");

    var target = mp.players.at(id);
    if(target === player)
        return player.chat.send("You cannot teleport yourself.");

    target.position = player.position;
    target.chat.send(`${HEX_COLORS.grey} Admin ${player.name} teleported you to him.`);
    player.chat.sendAdmin(`Admin ${player.name} (${player.id} teleported ${target.name} (${target.id}) to him using (/gethere).`);
});

new Command(["disarm", "resetweapons", "disarmplayer"], (player: PlayerMp, args: any) => {
    if(!player.account.operator && !player.account.staff)
        return player.chat.send("You have not the necessary administration level to use this command.");

    var id = args[0];
    if(!isNaN(id) || !id)
        return player.chat.sendSyntax("/disarm [id]");

    var target = mp.players.at(id);
    target.weapons.reset();
    target.chat.send(`${HEX_COLORS.grey} Admin ${player.name} disarmed you.`);
    player.chat.sendAdmin(`Admin ${player.name} (${player.id}) disarmed user ${target.name} (${target.id}).`);
});

new Command("savepos", (player: PlayerMp) => {
    if(!player.account.staff && !player.account.operator)
        return player.chat.send("You have not the necessary administration level to use this command.");

    console.log(`Coordinates for ${player.name}: `+player.position);
    player.chat.send("The coordinates were printed into the console.");
});

new Command("gotoxyz", (player: PlayerMp, args: any) => {
    if(!player.account.staff && !player.account.operator)
        return player.chat.send("You have not the necessary administration level to use this command.");

    if(args.length < 3)
        return player.chat.send("Invalid coords.");

    var pos = new mp.Vector3(args[0], args[1], args[2]);
    player.position = pos;
    player.chat.send("You have been teleported to the location.");
});

// stats, area, set, /a, fly, charcreator, spawnlocation, car hud, car engine (2key), logo, scoreboard, give