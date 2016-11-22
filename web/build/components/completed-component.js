"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var show_todos_pipe_1 = require('../pipes/show-todos-pipe');
var main_component_1 = require('./main-component');
var ng2_tooltip_1 = require('ng2-tooltip');
var CompletedComponent = (function (_super) {
    __extends(CompletedComponent, _super);
    function CompletedComponent(ref) {
        _super.call(this, ref);
    }
    CompletedComponent.prototype.toggleTodoCompletionState = function (todo) {
        todo.completed = false;
        todo.workingOnTodo = false;
        this.deleteTodo(todo, true);
        this.todos.push(todo);
        this.updateMyDaysArray(todo.name, 'completed', todo.completed);
        this.calculateProgressBar();
        this.saveData();
    };
    CompletedComponent.prototype.updateMyDaysArray = function (todoName, property, value) {
        this.myDays.forEach(function (currentDay) {
            currentDay.todos.forEach(function (currentTodo) {
                if (currentTodo.name === todoName) {
                    currentTodo[property] = value;
                }
            });
        });
        this.saveData();
    };
    CompletedComponent = __decorate([
        core_1.Component({
            selector: 'completedComponent',
            templateUrl: './views/completed-component.html',
            styleUrls: ['./css/completed-component.css', './css/common.css'],
            directives: [ng2_tooltip_1.TOOLTIP_DIRECTIVES],
            pipes: [show_todos_pipe_1.ShowCompletedTodosPipe]
        }), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef])
    ], CompletedComponent);
    return CompletedComponent;
}(main_component_1.MainComponent));
exports.CompletedComponent = CompletedComponent;
//# sourceMappingURL=completed-component.js.map