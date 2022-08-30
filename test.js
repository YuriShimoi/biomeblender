function sampleMap() {
    let _ = 0;
    return [
        [_,_,_,_,_,1,_,_,_,_,_,_,_,_,_,_,_,_,_,3,_,_,_,_,_],
        [_,1,_,1,1,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,3,3,_,3,_],
        [_,_,1,_,_,_,_,_,6,6,6,6,6,6,6,6,6,_,_,_,_,_,3,_,_],
        [_,1,_,_,_,_,_,6,_,_,_,_,_,_,_,_,_,6,_,_,_,_,_,3,_],
        [_,1,_,_,_,_,6,_,_,_,_,_,_,_,_,_,_,_,6,_,_,_,_,3,_],
        [_,_,_,_,_,6,_,_,_,_,5,5,5,5,_,_,_,_,_,6,_,_,_,_,_],
        [_,_,_,_,_,6,_,_,_,_,_,5,5,5,5,_,_,_,_,6,_,_,_,_,_],
        [_,2,_,_,_,_,6,_,_,_,_,_,_,_,_,_,_,_,6,_,_,_,_,4,_],
        [_,2,_,_,_,_,_,6,_,_,_,_,_,_,_,_,_,6,_,_,_,_,_,4,_],
        [_,_,2,_,_,_,_,_,6,6,6,6,6,6,6,6,6,_,_,_,_,_,4,_,_],
        [_,2,_,2,2,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,4,4,_,4,_],
        [_,_,_,_,_,2,_,_,_,_,_,_,_,_,_,_,_,_,_,4,_,_,_,_,_]
    ];
}

function randomMap(variants=5) {
    let [sx, sy] = [Math.ceil(Math.random()*20)+3, Math.ceil(Math.random()*20)+3];
    return new Array(sx).fill(0).map(_ => new Array(sy).fill(0).map(_ => Math.ceil(Math.random()*variants))); 
}

let _document_ready = setInterval((f) => {if(document.readyState == "complete"){clearInterval(_document_ready);delete _document_ready;f()}}, 1, () => {
    let map = sampleMap();
    map = new BlendedMap(map).spray(3).toArray();
    Visualizer.render(map, document.getElementById('main'), ['lightgray']);
});