var carHud: BrowserMp | null;
var player = mp.players.local;

mp.players.local.setConfigFlag(429, true);

mp.events.add('render', () => {
    var veh = player.vehicle;
    if(!veh)
        return;

    if(veh.getPedInSeat(-1) === player.handle)
        carHud?.execute(`window.UpdateHud(${veh.getSpeed()}, ${veh.getIsEngineRunning() ? veh.rpm : 0}, ${veh.gear});`);

    else DestroyCarHud();
});

mp.events.add("playerEnterVehicle", (_: VehicleMp, seat: number) => {
    if(seat !== -1)
        return;
    
    DestroyCarHud();
    carHud = mp.browsers.new("http://localhost:3000/car");
});

mp.events.add("vehicle.update.fuel", (fuel: number) => {
    carHud?.execute(`window.SetFuel(${fuel})`);
})

mp.keys.bind(0x32, true, () => {
    mp.events.callRemote("vehicle.change.engine", mp.players.local);    
});

const DestroyCarHud = () => {
    if(!carHud)
        return;

    carHud.destroy();
    carHud = null;
};  
