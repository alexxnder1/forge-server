import { GenerateDoubleArrayColors, HEX_COLORS } from "@shared/colors";
import { Command } from "./chat";
import { GetAvailableSeats, vehicleManager } from "./vehicleManager";

new Command(["spawncar", "spawnveh", "veh", "car", "vehicle", "spawnvehicle"], (player: PlayerMp, args: any) => {
    if(!player.account.operator && !player.account.staff)
        return player.chat.send("You have not the necessary administration level to use this command.");

    if(args.length === 0)
        return player.chat.sendSyntax("/spawncar [modelName]");

    var modelName = args[0], colors = GenerateDoubleArrayColors();

    let vehicle = mp.vehicles.new(mp.joaat(modelName), player.position, {
        heading: player.heading,
        color: colors,
        numberPlate: "ADMIN" 
    })

    vehicleManager.vehicles.push(vehicle);
    setTimeout(() => {
        player.putIntoVehicle(vehicle, 0);
    }, 500);

    player.chat.sendAdmin(`Admin ${player.name} (${player.account.id}) spawned an ${modelName} with an id of ${vehicleManager.vehicles.indexOf(vehicle)}.`);
});

new Command(["despawncar", "despawnveh", "despawnvehicle", "destroycar", "destroyveh"], (player: PlayerMp, args: any) => {
    if(!player.account.operator && !player.account.staff)
        return player.chat.send("You have not the necessary administration level to use this command.");

    var vehicle: any, id = args[0];
    if(isNaN(id))
    {
        if(!player.vehicle)
            return player.chat.sendSyntax("/despawncar [id]");

        vehicle = player.vehicle;
    }

    if(!vehicleManager.vehicles.includes(vehicle))
        return player.chat.send("Error: That vehicle is not spawned.");

    player.chat.sendAdmin(`Admin ${player.name} (${player.account.id}) destroyed vehicle with id of ${vehicleManager.vehicles.indexOf(vehicle)}`)    
    vehicleManager.vehicles = vehicleManager.vehicles.filter(e => e !== vehicle);
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
    
    
    let vehicle = mp.vehicles.new(veh.model, veh.position, {
        heading: veh.heading,
        color: [veh.getColorRGB(0), veh.getColorRGB(1)]
    });
    
    if(player.vehicle === veh)
        player.putIntoVehicle(veh, 0);
    
    vehicleManager.vehicles.push(vehicle);
    player.chat.sendAdmin(`Admin ${player.name} (${player.account.id}) respawned vehicle with an id of ${vehicleManager.vehicles.indexOf(veh)}.`);
    vehicleManager.vehicles = vehicleManager.vehicles.filter(e => e !== veh);
    veh.destroy();
});

new Command("closestcar", (player: PlayerMp) => {
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
    console.log(seat);
    if(seat !== -1)
        player.putIntoVehicle(closestStruct.veh, seat);
    
    else player.position = veh.position + new mp.Vector3(3, 0, 2);
    player.chat.sendAdmin(`Admin ${player.name} (${player.id}) teleported to the closest vehicle in his area (id ${vehicleManager.vehicles.indexOf(veh)}).`)
});

// gotocar, getcar,