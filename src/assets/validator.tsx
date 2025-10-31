const validate=(name:string,value:string):boolean=>{

    if(name==='email'){

        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)

    }

    else{

        return value.length>=8

    }

}


 

export default validate