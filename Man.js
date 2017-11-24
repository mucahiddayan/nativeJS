"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Human_1 = require("./Human");
var Man = /** @class */ (function (_super) {
    __extends(Man, _super);
    function Man(name, birthday) {
        return _super.call(this, name, birthday, 'male') || this;
    }
    Man.prototype.getName = function () {
        return _super.prototype.getName.call(this);
    };
    Man.prototype.getAge = function () {
        return _super.prototype.getAge.call(this);
    };
    return Man;
}(Human_1.Human));
var Woman = /** @class */ (function (_super) {
    __extends(Woman, _super);
    function Woman(name, birthday) {
        return _super.call(this, name, birthday, 'female') || this;
    }
    Woman.prototype.getName = function () {
        return _super.prototype.getName.call(this);
    };
    Woman.prototype.getAge = function () {
        return _super.prototype.getAge.call(this);
    };
    return Woman;
}(Human_1.Human));
