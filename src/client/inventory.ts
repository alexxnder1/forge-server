import { chatBrowser } from "./chat";
import { hudBrowser } from "./hud";

var nearbyInterval: number = -1;
export var inventoryCef: BrowserMp = mp.browsers.new("http://localhost:3000/inventory"); 
inventoryCef.active = false;

mp.game.graphics.transitionFromBlurred(100);

mp.keys.bind(0x49, true, () => {
    // if(chatBrowser.active)
    //     return;

    inventoryCef.active = !inventoryCef.active;
    chatBrowser.active = !inventoryCef.active;
    hudBrowser.active = !inventoryCef.active;

    setTimeout(() => {
        mp.gui.cursor.visible = inventoryCef.active;
    }, 100);

    if(inventoryCef.active) {
        mp.game.graphics.transitionToBlurred(100);
        nearbyInterval = setInterval(getNearbyItems, 1000);
        mp.events.callRemoteProc('getInventoryItems', mp.players.local).then((val: any) => {
            mp.events.call('inventory.update.items', val);
        });
    
        getNearbyItems();
    }
    
    else {
        mp.game.graphics.transitionFromBlurred(100); 
        clearInterval(nearbyInterval);
    }
});

const getNearbyItems = () => {
    mp.events.callRemoteProc("getNearbyItems", mp.players.local).then((val: any) => {
        mp.events.call('inventory.update.nearbyItems', val)
    });
};

mp.events.add("inventory.update.nearbyItems", (items: any): any => {
    inventoryCef?.execute(`window.SetNearbyItems('${JSON.stringify(items)}')`);
});

mp.events.add("inventory.update.items", (items: any) => {
    inventoryCef?.execute(`window.SetItems('${JSON.stringify(items)}')`);
});

mp.events.add("inventory.drop.item", (index: number, amount: number) => {
    mp.events.callRemote("inventory.drop.item", mp.players.local, index, amount);
});

mp.events.add("sync_object", (parent: PlayerMp, objId: number, labelId: number):any => {
    let object = mp.objects.at(objId);
    let label = mp.labels.at(labelId);
    let pos  = new mp.Vector3(object.position.x, object.position.y, object.position.z-parent.getHeightAboveGround());
    label.position  = new mp.Vector3(pos.x,pos.y,pos.z+0.2);
    object.position = pos;
});

mp.events.add("inventory.pickup.item", (item: number, amount: number):any => {
    mp.events.callRemote("inventory.pickup.item", mp.players.local, item, amount);
});