// disables ambient sounds (car sounds, honks ....)
mp.game.audio.startAudioScene('CHARACTER_CHANGE_IN_SKY_SCENE');

mp.events.add("render", () => {
    for(let i = 0; i<=22; i++)
        mp.game.ui.hideComponentThisFrame(i);   
});