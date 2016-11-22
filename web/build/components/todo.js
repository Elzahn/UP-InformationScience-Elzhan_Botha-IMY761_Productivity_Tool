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
var NewTodo = (function () {
    function NewTodo() {
        this.name = "";
        this.description = "";
        this.dueDate = "";
        this.completed = false;
        this.workingOnTodo = false;
        this.inEdit = true;
        this.saved = false;
        this.completedOn = "";
        this.colour = this.generateColour();
        this.datePickerDue = "";
    }
    ;
    NewTodo.prototype.generateColour = function () {
        return Math.floor(Math.random() * 16777215).toString(16);
    };
    NewTodo = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], NewTodo);
    return NewTodo;
}());
exports.NewTodo = NewTodo;
//# sourceMappingURL=todo.js.map