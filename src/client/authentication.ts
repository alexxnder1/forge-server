var authenticationBrowser:BrowserMp = mp.browsers.new("http://localhost:3000/auth");
authenticationBrowser?.execute(`SetUsername('${mp.players.local.name}')`);

setTimeout(() => {
    mp.gui.cursor.visible = true;
}, 1000);

mp.events.add("auth.show.login", () => {
    authenticationBrowser?.execute(`SetLogin()`);
});

mp.events.add("auth.submit.login", (password: string) => {
    mp.events.callRemote("auth.submit.login", mp.players.local, password);
});

mp.events.add("auth.submit.register", (password: string, cpassword: string, email: string) => {
    mp.events.callRemote("auth.submit.register", mp.players.local, password, cpassword, email);
});

mp.events.add("auth.destroy", () => {
    authenticationBrowser?.destroy();
    mp.gui.cursor.visible = false;
});