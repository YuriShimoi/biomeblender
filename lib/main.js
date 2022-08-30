class BlendedMap {
    static blank_value = 0;
    #map;

    constructor(map) {
        this.#map = map;
    }

    toArray() {
        return this.#map;
    }

    blankCopy() {
        return new Array(this.#map.length).fill(0).map((_, i) => new Array(this.#map[i].length).fill(BlendedMap.blank_value));
    }

    forEach(lambda, map=this.#map) {
        return map.forEach((r, x) => r.forEach((v, y) => lambda(v, {x:x,y:y})));
    }

    spray(radius=1, blend=true, resume=true) {
        let aux_map = this.blankCopy();

        const setIfValid = (value, pos) => {
            if(pos.x < 0 || pos.x >= aux_map.length) return;
            if(pos.y < 0 || pos.y >= aux_map[pos.x].length) return;
            if((aux_map[pos.x][pos.y] !== BlendedMap.blank_value && value === aux_map[pos.x][pos.y])
            || (aux_map[pos.x][pos.y] instanceof Array && aux_map[pos.x][pos.y].includes(value)))
                return;

            let set_val = value;
            if(aux_map[pos.x][pos.y] instanceof Array) set_val = [...aux_map[pos.x][pos.y], value];
            else if(aux_map[pos.x][pos.y] !== BlendedMap.blank_value) set_val = [aux_map[pos.x][pos.y], value];
            aux_map[pos.x][pos.y] = set_val;
        };
        const sprayCircle = (value, pos) => {
            for(let x=pos.x-radius; x <= pos.x+radius; x++) {
                for(let y=pos.y-radius; y <= pos.y+radius; y++) {
                    if(Math.floor((Math.sqrt((x-pos.x)**2+(y-pos.y)**2))+0.5) <= radius)
                        setIfValid(value, {x:x, y:y});
                }
            }
        };

        this.forEach((v, p) => {
            if(v !== BlendedMap.blank_value) sprayCircle(v, p);
        });

        if(blend) return this.blendLayerMap(aux_map);
        if(resume) return this.resumeLayerMap(aux_map);
        this.#map = aux_map;
        return this;
    }

    blendLayerMap(layer_mapping) {
        const moreOccurs = (pos) => {
            let occurs = {};
            for(let x=pos.x-1; x <= pos.x+1; x++) {
                for(let y=pos.y-1; y <= pos.y+1; y++) {
                    if(x < 0 || x >= layer_mapping.length) continue;
                    if(y < 0 || y >= layer_mapping[x].length) continue;
                    
                    let value = layer_mapping[x][y];
                    if(value === BlendedMap.blank_value) continue;
                    if(value instanceof Array) {
                        value.forEach(val => {
                            if(val in occurs) occurs[val]++;
                            else occurs[val] = 1;
                        });
                    }
                    else {
                        if(value in occurs) occurs[value]++;
                        else occurs[value] = 1;
                    }
                }
            }

            let occurs_values = Object.values(occurs);
            return Number(Object.keys(occurs)[occurs_values.indexOf(Math.max(...occurs_values))]);
        };

        let overlapping_positions = [];
        this.forEach((val, pos) => {
            if(val instanceof Array) overlapping_positions.push(pos);
        }, layer_mapping);
        while(overlapping_positions.length) {
            let rnd_ind = Math.floor(Math.random() * overlapping_positions.length);
            let rnd_pos = overlapping_positions.splice(rnd_ind, 1)[0];
            layer_mapping[rnd_pos.x][rnd_pos.y] = moreOccurs(rnd_pos);
        }

        this.#map = layer_mapping;
        return this;
    }

    resumeLayerMap(layer_mapping) {
        const resumeLayer = (value) => {
            if(value instanceof Array) return value[0] || BlendedMap.blank_value;
            return value || BlendedMap.blank_value;
        };
        
        this.forEach((v, p) => this.#map[p.x][p.y] = resumeLayer(v), layer_mapping);

        return this;
    }
}