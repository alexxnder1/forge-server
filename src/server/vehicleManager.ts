export interface VehicleManager {
    vehicles: Array<VehicleMp>,
}

export var vehicleManager: VehicleManager = {
    vehicles: []
};

export function GetAvailableSeats(vehicle: VehicleMp) {
    var seat: number = -1, occupiedSeats: Array<number> = [];
    mp.players.forEach(player => {
        if(player.vehicle === vehicle)
            occupiedSeats.push(player.seat);
    });

    for(let i = 0; i <= 3; i++)
    {
        if(occupiedSeats.find(e => e===i) === undefined)
            seat = i;    
            break;
    }
    
    return seat;
}