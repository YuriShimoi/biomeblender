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

    forEach(lambda) {
        return this.#map.forEach((r, x) => r.forEach((v, y) => lambda(v, {x:x,y:y})));
    }

    spray(radius=1, blend=true) {
        let aux_map = this.blankCopy();
        const sprayCircle = (pos) => {
            // spread a circle around the position (aux_map[pos.x][pos.y])
            // add the value as a option, position must be an array, a unique value or blank
            
        };
        this.forEach((v, p) => {
            if(v !== BlendedMap.blank_value) sprayCircle( p);
        });

        if(blend) return this.blendMap(aux_map);
        
        this.#map = aux_map;
        return this;
    }

    blendMap(other_map) {
        // introduce a rule for overlapping treatment
        // maybe nearest repetition rule in a random order over overlapping ones

        return this;
    }
}