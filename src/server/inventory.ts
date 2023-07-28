import { Command } from "./chat";
import items from "./json/items.json";
import User, { IUser } from "./schemas/User";

export interface Item {
    name: string;
    id: number,
    description: string;
    image: string;
    stackable: boolean;
    maxStackAmount: number;
    stackAmount: number;
    objectName: string
    object?: ObjectMp,
    label?: TextLabelMp
}

export interface Inventory {
    items: Array<Item>,
    maxItems: 100,
    give?: (name: string, amount?: number) => void;
    // hasItem
}

export var droppedItems: Array<Item> = [];

mp.events.add("player.loadAccountData", (player: PlayerMp, res: IUser) => {
    player.account.inventory ??= res.inventory;
    
    player.account.inventory.give = (name: string, amount: number = 1) => {
        if(player.account.inventory.items.length >= player.account.inventory.maxItems)
            return;

        var item = player.account.inventory.items.find(it => it.name.toLowerCase() === name.toLowerCase() && it.stackAmount < it.maxStackAmount)!;
        if(item)
        {
            if(item.stackAmount+amount < item.maxStackAmount)
                item.stackAmount += amount;
                
            else
            {
                let dif = (item.maxStackAmount - item.stackAmount);
                item.stackAmount += dif;
                amount -= dif;

                while(Math.trunc(amount/item.maxStackAmount) !== 0 && amount > 0) {
                    console.log(amount/item.maxStackAmount);
                    console.log("new item : " + item.maxStackAmount);
                    player.account.inventory.items.push({...item, id:player.account.inventory.items.length, stackAmount: item.maxStackAmount});
                    amount -= item.maxStackAmount;
                    console.log("amount: " + amount);
                }
                if(amount !== 0)
                    player.account.inventory.items.push({...item, id:player.account.inventory.items.length, stackAmount: amount});
            }
        }

        else {
            var jsonItem = items.find(it => it.name.toLowerCase() === name.toLowerCase())!;
            player.account.inventory.items.push({...jsonItem, id: player.account.inventory.items.length, stackAmount: amount});
        }
    };

    player.account.inventory.give('Orange');
    // player.account.inventory.give('Cigarettes');
    console.log(player.account.inventory.items);
});

mp.events.addProc("getInventoryItems", (player: PlayerMp) => { 
    return player.account.inventory.items
});

const getNearbyItems = (player:PlayerMp) => {
    return droppedItems.filter(item => item.object && player.dist(item.object.position) < 5);
}

mp.events.addProc("getNearbyItems", (player: PlayerMp) => {
    return getNearbyItems(player);
});

mp.events.add("inventory.drop.item", (player: PlayerMp, _, index: number, amount: number) => {
    var playerItems = player.account.inventory.items as Array<Item>;
    var item = playerItems[index];
    
    if(item) {
        if(amount === item.stackAmount)
            playerItems.splice(index, 1);
        
        else
            item.stackAmount-=amount;

        let found = false;
        droppedItems.forEach(it => {
            if(it.object) {
                if(it.object.dist(player.position) < 5 && it.name === item.name) {
                    it.stackAmount+=amount;
                    it.label!.text = `${it.name} (${it.stackAmount}x)`;
                    found = true;
                }
            }
        });

        if(!found) {
            var newItem: Item = {...item};
            newItem.stackAmount = amount;
            createObjectFromItem(player,newItem);
        }
    }

    player.call("inventory.update.nearbyItems", [getNearbyItems(player)]);
});

const createObjectFromItem = (player: PlayerMp, item: Item) => {
    var amount = item.stackAmount;
    item.object = mp.objects.new(item.objectName, player.position, {dimension: player.dimension});
    item.label = mp.labels.new(`${item.name} ${amount !== 1 ? `(${amount}x)` :  ''}`, item.object.position, { drawDistance: 10, dimension:player.dimension});

    mp.players.forEach((p) => {
        p.call('sync_object', [player, item.object!.id, item.label!.id]);
    })

    droppedItems.push(item);
}

mp.events.add("playerJoin", (player:PlayerMp) => {
    droppedItems.forEach(item => {
        player.call('sync_object', [player, item.object!.id, item.label!.id]);
    });
});

mp.events.add("inventory.pickup.item", (player: PlayerMp, _: any, index: number, amount: number) => {   
    var items = getNearbyItems(player);
    if(!items[index])
        return;

    var item = droppedItems[index];
    if(amount === item.stackAmount)
    {
        item.object?.destroy();
        item.label?.destroy();
        droppedItems.splice(index, 1);
    }

    else {
        item.stackAmount -= amount;
        item.label!.text = `${item.name} ${item.stackAmount !== 1 ? ` (${item.stackAmount}x)` : ''}`;
    }

    player.account.inventory.give!(item.name, amount);

    player.call("inventory.update.items", [player.account.inventory.items]);
    console.log(items);
    mp.players.forEach(p => {
        if(p.dist(player.position) < 5)
            p.call('inventory.update.nearbyItems', [items]);
    })
});


mp.events.add("playerQuit", (player: PlayerMp) => {
    User.updateOne({ socialClub: player.socialClub }, { $set: { inventory: player.account.inventory } }).exec();
});

new Command("debug", (player: PlayerMp, args: any) => {
    var amount = parseInt(args[0]);
    player.account.inventory.give!('Orange', amount);
}); 