function sampleMap() {
    let _ = 0;
    let map = [
        [_,_,_,_,_,1,_,_,_,_,_,_,_,_,_,_,_,_,_,3,_,_,_,_,_],
        [_,1,_,1,1,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,3,3,_,3,_],
        [_,_,1,_,_,_,_,_,_,6,6,6,6,6,6,6,_,_,_,_,_,_,3,_,_],
        [_,1,_,_,_,_,_,6,_,_,_,_,_,_,_,_,_,6,_,_,_,_,_,3,_],
        [_,1,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,3,_],
        [_,_,_,_,_,6,_,_,_,_,_,5,5,5,_,_,_,_,_,6,_,_,_,_,_],
        [_,_,_,_,_,_,_,_,_,_,_,5,5,5,_,_,_,_,_,_,_,_,_,_,_],
        [_,2,_,_,_,_,6,_,_,_,_,_,_,_,_,_,_,_,6,_,_,_,_,4,_],
        [_,2,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,4,_],
        [_,_,2,_,_,_,_,_,6,6,6,6,6,6,6,6,6,_,_,_,_,_,4,_,_],
        [_,2,_,2,2,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,4,4,_,4,_],
        [_,_,_,_,_,2,_,_,_,_,_,_,_,_,_,_,_,_,_,4,_,_,_,_,_]
    ];
    return new BlendedMap(map).spray(3).toArray();
}

function proceduralMap(x=25, y=50, spray=6) {
    let map = new Array(x).fill(0).map(_ => new Array(y).fill(6));
    
    // corner 1
    map[3][3]  = 1;
    map[8][3]  = 1;
    map[1][10] = 1;
    // corner 2
    map[x-3][3]  = 2;
    map[x-8][3]  = 2;
    map[x-1][10] = 2;
    // corner 3
    map[3][y-3]  = 3;
    map[8][y-3]  = 3;
    map[1][y-10] = 3;
    // corner 3
    map[x-3][y-3]  = 4;
    map[x-8][y-3]  = 4;
    map[x-1][y-10] = 4;
    // center
    map[parseInt(x/2)][parseInt(y/2)-5] = 5;
    map[parseInt(x/2)][parseInt(y/2)+5] = 5;
    map[parseInt(x/2)][parseInt(y/2)]   = 5;
    // belt
    map[parseInt(x/2)][parseInt(y/2)-9] = 6;
    map[parseInt(x/2)][parseInt(y/2)+9] = 6;
    map[parseInt(x/2)-5][parseInt(y/2)] = 6;
    map[parseInt(x/2)+5][parseInt(y/2)] = 6;

    return new BlendedMap(map).spray(spray).toArray();
}

function randomMap(variants=5) {
    let [sx, sy] = [Math.ceil(Math.random()*20)+3, Math.ceil(Math.random()*20)+3];
    return new Array(sx).fill(0).map(_ => new Array(sy).fill(0).map(_ => Math.ceil(Math.random()*variants)));
}

let _document_ready = setInterval((f) => {if(document.readyState == "complete"){clearInterval(_document_ready);delete _document_ready;f()}}, 1, () => {
    let map = proceduralMap();
    // let map = proceduralMap(50, 100, 18);
    Visualizer.render(map, document.getElementById('main'), [,'lightblue','orange','forestgreen','indianred','deepskyblue','royalblue'], true, false);
});