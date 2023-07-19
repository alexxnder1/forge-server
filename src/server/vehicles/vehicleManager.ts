// class
export interface VehicleManager {
    vehicles: Array<VehicleMp>,
    create: (model: number, pos: Vector3, colors?: [Array2d, Array2d] | [RGB, RGB], heading?: number, numberPlate?: string) => VehicleMp;
}

export var vehicleManager: VehicleManager = {
    vehicles: [],
    create: (model: number, pos: Vector3, colors: [Array2d, Array2d] | [RGB, RGB] = [[255,255,255], [255,255,255]], heading: number = 0, numberPlate: string = `FRG-${vehicleManager.vehicles.length}`) => {
        let veh = mp.vehicles.new(model, pos, {
            color: colors,
            heading: heading,
            numberPlate: numberPlate
        })

        vehicleManager.vehicles.push(veh);
        veh.fuel = 100;
        return veh;
    }
};

// functions
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