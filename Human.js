"use strict";
exports.__esModule = true;
var Human = /** @class */ (function () {
    function Human(name, birthday, sex) {
        this.birthday = birthday;
        this.name = name;
        this.sex = sex;
    }
    Human.prototype.getName = function () {
        return this.name;
    };
    Human.prototype.getAge = function () {
        return this.getAgeFromMiliseconds();
    };
    Human.prototype.getAgeFromMiliseconds = function () {
        var nowInMilisecond = Date.now();
        return this.convertMilisecondsToYear(nowInMilisecond - this.birthdayToMiliseconds());
    };
    Human.prototype.convertMilisecondsToYear = function (value) {
        return ~~(value / (1000 * 3600 * 24 * 365));
    };
    Human.prototype.birthdayToMiliseconds = function () {
        var birthdayDate;
        try {
            birthdayDate = new Date(this.birthday);
        }
        catch (e) {
            console.warn(e);
            return;
        }
        return birthdayDate.getTime();
    };
    return Human;
}());
exports.Human = Human;
