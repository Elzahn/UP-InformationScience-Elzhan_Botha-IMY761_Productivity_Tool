"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var settings_component_1 = require('../components/settings-component');
var OrderByPipe = (function () {
    function OrderByPipe() {
    }
    OrderByPipe.prototype.transform = function (todos) {
        if (settings_component_1.SettingsComponent.checkedViewByValue != 'custom') {
            return todos.sort(function (todoA, todoB) {
                var tempADay = (todoA.dueDate).substr(0, 2);
                var tempAMonth = (todoA.dueDate).substr(3, 2);
                var tempAYear = (todoA.dueDate).substr(6, 4);
                var tempADate = tempAMonth + "/" + tempADay + "/" + tempAYear;
                var tempBDay = (todoB.dueDate).substr(0, 2);
                var tempBMonth = (todoB.dueDate).substr(3, 2);
                var tempBYear = (todoB.dueDate).substr(6, 4);
                var tempBDate = tempBMonth + "/" + tempBDay + "/" + tempBYear;
                var tempTodoA = new Date(tempADate);
                var tempTodoB = new Date(tempBDate);
                if (tempTodoA < tempTodoB) {
                    return -1;
                }
                else if (tempTodoA > tempTodoB) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
        }
        else {
            return todos;
        }
    };
    OrderByPipe = __decorate([
        core_1.Pipe({
            name: 'orderBy', pure: false
        }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], OrderByPipe);
    return OrderByPipe;
}());
exports.OrderByPipe = OrderByPipe;
//# sourceMappingURL=orderBy-pipe.js.map