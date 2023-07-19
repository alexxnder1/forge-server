import * as conf from "../../dist/conf.json";
import * as geo from "geoip-lite";

mp.events.addProc("getPlayers", () => {
    let players: any = [];
    mp.players.forEach(p => {
        players.push({name: p.name, id: p.id, ping: p.ping, country: geo.lookup(p.ip) ?? 'UNKNOWN'});
    });
    return players;
})

mp.events.addProc("getServerInfo", () => {
    return { name: conf.name, maxPlayers: conf.maxplayers };
});