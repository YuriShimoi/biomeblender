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
    let map = new BlendedMap([]).config({x:x,y:y}, 6);

    // corner 1
    map.addDots({
        1: [ // corner 1
            {x: 3, y: 3},
            {x: 8, y: 3},
            {x: 1, y: 10}
        ],
        2: [ // corner 2
            {x: x-3, y: 3},
            {x: x-8, y: 3},
            {x: x-1, y: 10}
        ],
        3: [ // corner 3
            {x: 3, y: y-3},
            {x: 8, y: y-3},
            {x: 1, y: y-10}
        ],
        4: [ // corner 4
            {x: x-3, y: y-3},
            {x: x-8, y: y-3},
            {x: x-1, y: y-10}
        ],
        0: [ // center
            {x: parseInt(x/2), y: parseInt(y/2)-5},
            {x: parseInt(x/2), y: parseInt(y/2)+5},
            {x: parseInt(x/2), y: parseInt(y/2)}
        ],
        6: [ // belt
            {x: parseInt(x/2),   y: parseInt(y/2)-9},
            {x: parseInt(x/2),   y: parseInt(y/2)+9},
            {x: parseInt(x/2)-5, y: parseInt(y/2)},
            {x: parseInt(x/2)+5, y: parseInt(y/2)}
        ]
    });

    return new BlendedMap(map.toArray()).spray(1).smooth().toArray();
}

function randomMap(variants=5) {
    let [sx, sy] = [Math.ceil(Math.random()*20)+3, Math.ceil(Math.random()*20)+3];
    return new Array(sx).fill(0).map(_ => new Array(sy).fill(0).map(_ => Math.ceil(Math.random()*variants)));
}

_document_ready = setInterval((f) => {if(document.readyState == "complete"){clearInterval(_document_ready);delete _document_ready;f()}}, 1, () => {
    map = proceduralMap();
    // map = proceduralMap(50, 100, 18);
    Visualizer.render(map, document.getElementById('main'), {1:'lightblue',2:'orange',3:'forestgreen',4:'indianred',5:'deepskyblue',6:'royalblue'}, true, false);
});