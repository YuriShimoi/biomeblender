class Visualizer {
    static conversionMethod = (v) => JSON.stringify(v);

    static isValidMap(mapping) {
        return mapping instanceof Array && mapping[0] instanceof Array;
    }

    static map(mapping, relational_map=null) {
        if(!Visualizer.isValidMap(mapping)) throw TypeError("Invalid map format, tested with \"Visualizer.isValidMap()\" method.");

        let result_map = new Array(mapping.length).fill(0).map(_ => new Array(mapping[0].length).fill(0));

        let nmap = relational_map || {};
        let pivot = 1;
        result_map.forEach((r, ri) => r.forEach((_, di) => {
            let value = Visualizer.conversionMethod(mapping[ri][di]);
            if(!(value in nmap)) nmap[value] = value === undefined? 0: pivot++;
            result_map[ri][di] = nmap[value];
        }));

        return result_map;
    }

    static render(mapping, element, colors=null, already_mapped=false, showNumbers=true) {
        if(!already_mapped) mapping = Visualizer.map(mapping);
        
        const mappedColor = (v) => {
            if(colors === null) colors = [];
            if(colors[v] === undefined) colors[v] = Visualizer.randomColor();
            return colors[v];
        };

        element.innerHTML = "";
        let mtable = document.createElement("TABLE");
        mapping.forEach((r, ri) => {
            let mrow = document.createElement("TR");
            r.forEach((_, di) => {
                let mdata = document.createElement("TD");
                if(showNumbers) mdata.innerHTML = mapping[ri][di];
                mdata.style.background = mappedColor(mapping[ri][di]);
                mrow.appendChild(mdata);
            });
            mtable.appendChild(mrow);
        });
        element.appendChild(mtable);
    }

    static randomColor() {
        const shuffle = (list) => {
            let aux  = [];
            let copy = [...list];
            while(copy.length) aux.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
            return aux;
        };

        const randomHex = (start, end) => {
            let aux = (Math.floor((Math.random() * (end-start)) + start)).toString(16);
            return aux.length === 1? `0${aux}`: aux;
        };

        return '#' + shuffle([randomHex(128,256), randomHex(64, 192), '00']).join('');
    }
}