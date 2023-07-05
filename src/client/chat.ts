var chatBrowser: BrowserMp;
mp.gui.chat.show(false);

mp.events.add("chat.create", () => {
    chatBrowser = mp.browsers.new("http://localhost:3000/chat");
    chatBrowser.markAsChat();
});

mp.keys.bind(0x54, true, () => {
    chatBrowser?.execute(`window.FocusChat(true)`);
    mp.gui.cursor.visible = true;
});

mp.events.add("hide.cursor", () => {
    mp.gui.cursor.visible = false;
});

mp.events.add("chat.broadcast.message", (text: string):any => {
    mp.events.callRemote("chat.broadcast.message", mp.players.local, text);
});

mp.events.add("chat.send.message", (from: string, text: string, local?: boolean): any => {
    chatBrowser?.execute(`window.SendMessage({ local: ${local}, from: '${from}', content: '${text}'})`);
});

mp.events.add("chat.set.settings", (cmds: string[], width: number, height: number, fontSize: number, spacing: number, timestamp: boolean, links: boolean) => {
    chatBrowser?.execute(`window.SetCommands('${JSON.stringify(cmds)}')`);
    chatBrowser?.execute(`window.SetSettings({ width: ${width}, height: ${height}, spacing: ${spacing}, fontSize: ${fontSize}, timestamp: ${timestamp}, links: ${links} })`);
});

mp.events.add("playerQuit", () => {
    chatBrowser?.execute(`window.RetrieveChatData();`);
});

mp.events.add("chat.get.data", (width: number, height: number, fontSize: number, spacing: number, timestamp: boolean, links: boolean): any => {
    mp.events.callRemote("chat.update.data", mp.players.local, width, height, fontSize, spacing, timestamp, links);
});