import { HEX_COLORS } from "@shared/colors";

const FUEL_PER_HR = 30;
const INTERVAL_FREQ = 35;

setInterval(() => {
    mp.players.forEach(player => {
        var veh = player.vehicle;
        if(!veh)
            return;

        if(player.seat === 0 && veh.engine)
        {
            if(veh.fuel > 0)
                veh.fuel -= (1/INTERVAL_FREQ*FUEL_PER_HR);
            
            else veh.engine = false;
        }
        
        player.call("vehicle.update.fuel", [veh.fuel]);
    })
}, INTERVAL_FREQ*1000);

mp.events.add("playerEnterVehicle", (player: PlayerMp, vehicle: VehicleMp, seat:number) => {
    if(seat === 0)
        player.call("vehicle.update.fuel", [vehicle.fuel]);
})

mp.events.add("vehicle.change.engine", (player: PlayerMp) => {
    if(!player.vehicle || player.seat != 0)
        return;

    if(player.vehicle.fuel <= 0)
        return player.chat.send(`${HEX_COLORS.grey}You cannot start the engine because you ran out of fuel...`);

    player.vehicle.engine = !player.vehicle.engine;
    player.chat.send(`${HEX_COLORS.purple} ${player.name} ${player.vehicle.engine === true ? "started" : "stopped" } the engine of his vehicle.`);
});