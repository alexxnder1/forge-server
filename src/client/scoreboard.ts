let scoreboard: BrowserMp;

mp.keys.bind(0x5A, true, () => {
    if(!scoreboard)
    {   
        scoreboard = mp.browsers.new("http://localhost:3000/scoreboard");
        mp.events.callRemoteProc("getServerInfo").then((val: any) => {
            scoreboard.execute(`window.SetServer('${JSON.stringify(val)}')`);
        })
    }

    else
        scoreboard.active = !scoreboard.active;
    
    if(scoreboard.active) 
    {
        mp.events.callRemoteProc("getPlayers").then((val: Array<PlayerMp>) => {
            scoreboard.execute(`window.SetPlayers('${JSON.stringify(val)}')`);
        });
    }
});