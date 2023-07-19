var hudBrowser: BrowserMp;
let temp = 0;

mp.events.add("onPlayerLogged", (res: any): void => {
    hudBrowser = mp.browsers.new("http://localhost:3000/hud");
    mp.events.callRemoteProc("getTemp").then((val: number) => {
        hudBrowser.execute(`window.SetStatsData('${mp.players.local.name}', ${mp.players.toArray().indexOf(mp.players.local)});`);  
        hudBrowser.execute(`window.SetMoney(${res.cash}, ${res.bank});`);
    });

    updateTemp();
});

const updateTemp = () => {
    mp.events.callRemoteProc("getTemp").then((val: number) => {
        hudBrowser.execute(`window.SetTemp(${val})`);
    });
};

setInterval(updateTemp, 4000*1000);