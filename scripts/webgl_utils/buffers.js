class DataBuffer{
    constructor(gl, program, data=[]){
        this.gl = gl;
        this.program = program;
        this.buffer = this.gl.createBuffer();

        this.data = [];
        this.addData(data);        
    }
  
    updateBuffer(){
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(this.data), this.gl.STATIC_DRAW);
    }
  
    addDatum(datum, update=true){
        this.data.push(vec4(datum));
  
        if(update){
            this.updateBuffer();
        }
    }
  
    addData(data){
        for(let i = 0; i < data.length; i++){
            this.addDatum(data[i], false);
        }
  
        this.updateBuffer();
    }

    setData(data){
        this.data = data;
        this.updateBuffer();
    }

    updateData(start, data){
        for(let i = start, j = 0; j < data.length; i++, j++){
            this.data[i] = data[j];
        }

        this.updateBuffer();
    }

    length(){
        return this.data.length;
    }
  
    load(variable, size=4){
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        let varPos = this.gl.getAttribLocation(this.program, variable);
        this.gl.enableVertexAttribArray(varPos);
        
        this.gl.vertexAttribPointer(varPos, size, this.gl.FLOAT, false, 0, 0);
    }
};

class MultiBuffer{
    constructor(gl, program, size){
        this.gl = gl;
        this.program = program;

        this.length = size;

        this.data = new Float32Array(size);
        if(this.parent != null){
            this.parent.push(this.data);
            this.buffer = this.parent.getBuffer();
        }else{
            this.buffer = this.gl.createBuffer();
        }
    }

    set(index, value, update=false){
        this.data[index] = value;
        
        if (update){
            this.update();
        }
    }

    get(index){
        return this.data[index];
    }

    createSubBuffer(start, size){
        return this.data.subarray(start, start+size);
    }

    fill(value, start=0, step=1, end=null){
        if (!end){
            end = this.length;
        }
        for (let i = start; i < end; i+=step){
            this.data[i] = value;
        }
    }

    update(){
        // console.log(this.data);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.data, this.gl.STATIC_DRAW);
    }

    load(variable, size){
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        let varPos = this.gl.getAttribLocation(this.program, variable);
        this.gl.enableVertexAttribArray(varPos);
        
        this.gl.vertexAttribPointer(varPos, size, this.gl.FLOAT, false, 0, 0);
    }

    render(mode, variable, size){
        this.load(variable, size);
        this.gl.drawArrays(mode, 0, this.length);
    }
};
  
class IndexBuffer{
    constructor(gl, program, data = []){
        this.gl = gl;
        this.program = program;
        this.data = data;

        this.buffer = this.gl.createBuffer();
        this.updateBuffer();
    }

    updateBuffer(){
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.data), this.gl.STATIC_DRAW);
    }

    addDatum(datum, update=true){
        this.data.push(datum);

        if(update){
            this.updateBuffer();
        }
    }

    addData(data){
        for(let i = 0; i < data.length; i++){
            this.addDatum(data[i], false);
        }

        this.updateBuffer();
    }

    render(drawMode){
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
        this.gl.drawElements(drawMode, this.data.length, this.gl.UNSIGNED_SHORT, 0);
    }
};