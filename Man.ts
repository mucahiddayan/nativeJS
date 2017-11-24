import { Human } from './Human';
class Man extends Human{
    name:string;
    birthday:string;

    constructor(name,birthday){
        super(name,birthday,'male');        
    }

    getName(): string{
        return super.getName();
    }

    getAge():number {
        return super.getAge();
    }
    
}

class Woman extends Human{
    name:string;
    birthday:string;

    constructor(name,birthday){
        super(name,birthday,'female');        
    }

    getName(): string{
        return super.getName();
    }

    getAge():number {
        return super.getAge();
    }
}
