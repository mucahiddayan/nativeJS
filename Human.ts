interface IHuman{
    name:string;
    birthday: string;
    sex:string;
    getName():string;
    getAge():number;
}

export class Human implements IHuman {
    name:string;
    birthday:string;
    sex:string;

    constructor(name:string, birthday:string, sex:string){
        this.birthday = birthday;
        this.name = name;
        this.sex = sex;
    }
    
    getName():string{
        return this.name;
    }

    getAge():number{
        return this.getAgeFromMiliseconds();
    }

    private getAgeFromMiliseconds():number{
        var nowInMilisecond = Date.now();
        return this.convertMilisecondsToYear(nowInMilisecond - this.birthdayToMiliseconds());
    }

    private convertMilisecondsToYear(value):number{
        return ~~(value / (1000 * 3600 * 24 * 365));
    }

    private birthdayToMiliseconds():number{
        let birthdayDate;
        try{
            birthdayDate = new Date(this.birthday);
        }catch(e){
            console.warn(e);
            return;
        }
        return birthdayDate.getTime();
    }
}

