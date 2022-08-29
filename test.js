function randomMap(variants=10) {
    let [sx, sy] = [Math.ceil(Math.random()*20)+3, Math.ceil(Math.random()*20)+3];
    return new Array(sx).fill(0).map(_ => new Array(sy).fill(0).map(_ => Math.ceil(Math.random()*variants))); 
}

let _document_ready = setInterval((f) => {if(document.readyState == "complete"){clearInterval(_document_ready);delete _document_ready;f()}}, 1, () => {
    Visualizer.render(randomMap(5), document.getElementById('main'));
});