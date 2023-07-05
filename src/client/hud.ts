var hudBrowser: BrowserMp;

mp.events.add("onPlayerLogged", (res: any): void => {
    hudBrowser = mp.browsers.new("http://localhost:3000/hud");
    hudBrowser.execute(`window.SetStatsData('${mp.players.local.name}', ${mp.players.toArray().indexOf(mp.players.local)})`);
    hudBrowser.execute(`window.SetMoney(${res.cash}, ${res.bank})`);
});