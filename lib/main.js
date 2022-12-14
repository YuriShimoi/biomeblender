class BlendedMap {
    static blank_value = 0;
    #map;

    /**
     * Auxiliar class to implement blend methods.
     * 
     * @param {[Array]} map - 2D mapping
     */
    constructor(map) {
        this.#map = map;
    }

    #moreOccurs(pos, mapping=this.#map) {
        let occurs = {};
        for(let x=pos.x-1; x <= pos.x+1; x++) {
            for(let y=pos.y-1; y <= pos.y+1; y++) {
                if(x < 0 || x >= mapping.length) continue;
                if(y < 0 || y >= mapping[x].length) continue;
                
                let value = mapping[x][y];
                if(value === BlendedMap.blank_value) continue;
                if(value instanceof Array) {
                    value.forEach(val => {
                        if(val !== BlendedMap.blank_value) {
                            if(val in occurs) occurs[val]++;
                            else occurs[val] = 1;
                        }
                    });
                }
                else {
                    if(value in occurs) occurs[value]++;
                    else occurs[value] = 1;
                }
            }
        }

        let occurs_values = Object.values(occurs);
        let occurs_key = Object.keys(occurs)[occurs_values.indexOf(Math.max(...occurs_values))];
        return isNaN(occurs_key)? occurs_key: Number(occurs_key);

    }

    /**
     * Overwrites the mapping with the given configuration.
     * 
     * @param {{x: Integer, y: Integer}} sizes - Size 'x' and 'y'
     * @param {*} fill - Value to fill the mapping **(default: BlendedMap.blank_value)**
     * @param {{value:[{x: Integer, y: Integer}]}} dots - Dictionary of values, each one a list of 'x' and 'y' positions **(default: null)**
     * @returns {BlendedMap} This instance
     */
    config(sizes, fill=BlendedMap.blank_value, dots=null) {
        this.#map = this.blankCopy(sizes, fill);
        return dots !== null? this.addDots(dots): this;
    }

    /**
     * Add new dots into given positions.
     * 
     * @param {{value:[{x: Integer, y: Integer}]}} dots - Dictionary of values, each one a list of 'x' and 'y' positions **(default: null)**
     * @returns {BlendedMap} This instance
     */
    addDots(dots) {
        for(let dot in dots) {
            dots[dot].forEach(pos => this.#map[pos.x][pos.y] = dot);
        }
        return this;
    }

    /**
     * Return the mapping converted to 2D Array.
     * 
     * @returns {[Array]} Simplified mapping array
     */
    toArray() {
        return this.#map;
    }

    /**
     * Generate a new blank array with internal map sizes or given ones.
     * 
     * @param {{x: Integer, y: Integer}} size - Size 'x' and 'y' **(default: internal mapping sizes)**
     * @param {*} fill - Value to fill the mapping **(default: BlendedMap.blank_value)**
     * @returns {[Array]} Simplified mapping array
     */
    blankCopy(size=null, fill=BlendedMap.blank_value) {
        if(size !== null) return new Array(size.x).fill(0).map(_ => new Array(size.y).fill(fill));
        return new Array(this.#map.length).fill(0).map((_, i) => new Array(this.#map[i].length).fill(fill));
    }

    /**
     * ForEach implementation to easily apply into mapping values.
     * 
     * @param {Function} lambda - Function to apply over every mapping value, sends (value, position:{x:Integer,y:Integer}) as arguments to lambda
     * @param {[Array]} map - 2D mapping **(default: internal mapping)**
     * @returns {BlendedMap} This instance
     */
    forEach(lambda, map=this.#map) {
        return map.forEach((r, x) => r.forEach((v, y) => lambda(v, {x:x,y:y})));
    }

    /**
     * Expand every not blank value on mapping.
     * 
     * @param {Integer} radius - Expansion radius **(default: 1)**
     * @param {Boolean} blend - At end pass the mapping over blend method **(default: true)**
     * @param {Boolean} resume - If do not pass on blend, resume layers of values generated into spray **(default: true)**
     * @returns {BlendedMap} This instance
     */
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

    /**
     * Create an outline inside the areas.
     * 
     * @param {Integer} size - Outline width **(default: 1)**
     * @param {Integer} layers - Amount of outlines **(default: 1)**
     * @param {Array} whitelist - List of values to apply the outlines **(default: all)**
     * @param {*} fill - Value to set into outline **(default: generated layer)**
     * @returns {BlendedMap} This instance
     */
    outline(size=1, layers=1, whitelist=null, fill=null) {
        if(layers === 0) return this;

        const inEdge = (val, pos) => {
            for(let x=pos.x-1; x <= pos.x+1; x++) {
                for(let y=pos.y-1; y <= pos.y+1; y++) {
                    if(x == pos.x && y == pos.y) continue;
                    
                    if((x < 0 || x >= this.#map.length)
                    || (y < 0 || y >= this.#map[x].length)
                    || (this.#map[x][y] !== val)) return true;
                }
            }
            return false;
        };
        const inLastDepth = (value, nvalue) => {
            let pval   = typeof value == "string"? value.split('-')[0]: value;
            let pdepth = typeof value == "string"? Number(value.split('-')[1] || 0): 0;

            return pval == nvalue && pdepth == 0;
        };
        const lookEvery = (val) => {
            let ndepth = typeof val == "string"? Number(val.split('-')[1] || 0): 0;
            let new_value = `${val}-${ndepth + layers}`;

            let to_convert = [];
            this.forEach((v, p) => {
                if(inLastDepth(v, val)) {
                    if(inEdge(v, p)) {
                        to_convert.push(p);
                    }
                }
            });
            to_convert.forEach(pos => this.#map[pos.x][pos.y] = fill || new_value);
        };
        const eachValue = () => {
            let values = [];
            this.forEach(v => {
                if(!values.includes(v)) values.push(v);
            });
            return values;
        };

        let val_list = whitelist || eachValue();
        val_list.forEach(value => {
            for(let l=0; l < layers; l++) {
                for(let s=0; s < size; s++) {
                    lookEvery(value);
                }
            }
        });

        return this;
    }

    /**
     * Iterate the mapping to smooth edges. 
     * 
     * @param {*} times - Amount of times will apply the smooth
     * @returns {BlendedMap} This instance
     */
    smooth(times=1) {
        const checkNeighbors = (pos) => {
            let new_value = this.#moreOccurs(pos);
            if(new_value) {
                this.#map[pos.x][pos.y] = new_value;
            }
        };

        let pos = [];
        while(times--) {
            this.forEach((_,p) => pos.push(p));
            while(pos.length) {
                let rind = Math.floor(Math.random()*pos.length);
                let rpos = pos.splice(rind, 1)[0];
                checkNeighbors(rpos);
            }
        }

        return this;
    }

    /**
     * Merge internal mapping with given one.
     * 
     * @param {*} other_map 
     * @returns {BlendedMap} This instance
     */
    merge(other_map) {
        this.forEach((val, pos) => {
            if(val !== BlendedMap.blank_value) other_map[pos.x][pos.y] = [val, this.#map[pos.x][pos.y]];
        }, other_map);

        return this.blendLayerMap(other_map).smooth();
    }

    /**
     * Blend values of layered mapping. (mapping with values are an array)
     * 
     * @param {[[Array]]} layer_mapping - 2D mapping where values what is an array will be blended by most common neighbour values
     * @returns {BlendedMap} This instance
     */
    blendLayerMap(layer_mapping) {
        let overlapping_positions = [];
        this.forEach((val, pos) => {
            if(val instanceof Array) overlapping_positions.push(pos);
        }, layer_mapping);
        while(overlapping_positions.length) {
            let rnd_ind = Math.floor(Math.random() * overlapping_positions.length);
            let rnd_pos = overlapping_positions.splice(rnd_ind, 1)[0];
            layer_mapping[rnd_pos.x][rnd_pos.y] = this.#moreOccurs(rnd_pos, layer_mapping);
        }

        this.#map = layer_mapping;
        return this;
    }

    /**
     * Resume values of layered mapping. (mapping with values are an array)
     * 
     * @param {[[Array]]} layer_mapping - 2D mapping where values what is an array will be blended by first option
     * @returns {BlendedMap} This instance
     */
    resumeLayerMap(layer_mapping) {
        const resumeLayer = (value) => {
            if(value instanceof Array) return value[0] || BlendedMap.blank_value;
            return value || BlendedMap.blank_value;
        };
        
        this.forEach((v, p) => this.#map[p.x][p.y] = resumeLayer(v), layer_mapping);

        return this;
    }
}