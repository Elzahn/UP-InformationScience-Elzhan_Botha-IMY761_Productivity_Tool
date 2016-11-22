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
var todos_component_1 = require('../components/todos-component');
var ShowActiveTodosPipe = (function () {
    function ShowActiveTodosPipe() {
    }
    ShowActiveTodosPipe.prototype.transform = function (todos, arg) {
        if (!todos || todos.length === 0)
            return [];
        return todos.filter(function (todo) { return (todo.saved === arg.saved && !todo.completed); });
    };
    ShowActiveTodosPipe = __decorate([
        core_1.Pipe({
            name: 'showActiveTodos', pure: false
        }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ShowActiveTodosPipe);
    return ShowActiveTodosPipe;
}());
exports.ShowActiveTodosPipe = ShowActiveTodosPipe;
var ShowCompletedTodosPipe = (function () {
    function ShowCompletedTodosPipe() {
    }
    ShowCompletedTodosPipe.prototype.transform = function (todos) {
        if (!todos || todos.length === 0)
            return [];
        return todos.filter(function (todo) { return todo.completed; });
    };
    ShowCompletedTodosPipe = __decorate([
        core_1.Pipe({
            name: 'showCompletedTodos', pure: false
        }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ShowCompletedTodosPipe);
    return ShowCompletedTodosPipe;
}());
exports.ShowCompletedTodosPipe = ShowCompletedTodosPipe;
var ShowInPeriodPipe = (function () {
    function ShowInPeriodPipe() {
    }
    ShowInPeriodPipe.prototype.transform = function (todos) {
        todos_component_1.TodosComponent.filteredTodosEmpty = false;
        todos_component_1.TodosComponent.filteredBy = "Todos filtered by: " + settings_component_1.SettingsComponent.checkedPeriodValue;
        if (!todos || todos.length === 0)
            return [];
        if (settings_component_1.SettingsComponent.checkedPeriodValue != "all") {
            var toDate_1 = new Date(settings_component_1.SettingsComponent.toDate.toString());
            var fromDate_1 = new Date(settings_component_1.SettingsComponent.fromDate.toString());
            var todoDate_1;
            var returnedTodo = todos.filter(function (todo) {
                var tempDay = (todo.dueDate).substr(0, 2);
                var tempMonth = (todo.dueDate).substr(3, 2);
                var tempYear = (todo.dueDate).substr(6, 4);
                var tempDate = tempMonth + "/" + tempDay + "/" + tempYear;
                todoDate_1 = new Date(tempDate);
                if (settings_component_1.SettingsComponent.checkedPeriodValue == "today") {
                    todos_component_1.TodosComponent.filteredMessage = "You have no todos for today";
                    if (todoDate_1.getDay() >= fromDate_1.getDay() && todoDate_1.getDay() <= toDate_1.getDay()) {
                        if (todoDate_1.getMonth() >= fromDate_1.getMonth() && todoDate_1.getMonth() <= toDate_1.getMonth()) {
                            if (todoDate_1.getFullYear() >= fromDate_1.getFullYear() && todoDate_1.getFullYear() <= toDate_1.getFullYear()) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    }
                }
                else if (settings_component_1.SettingsComponent.checkedPeriodValue == "month") {
                    todos_component_1.TodosComponent.filteredMessage = "You have no todos for this month";
                    if (todoDate_1.getMonth() == fromDate_1.getMonth()) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    if (settings_component_1.SettingsComponent.checkedPeriodValue == "week") {
                        todos_component_1.TodosComponent.filteredMessage = "You have no todos for this week";
                    }
                    else {
                        todos_component_1.TodosComponent.filteredMessage = "You have no todos between " + StringManipulation.shortenDate(settings_component_1.SettingsComponent.savedFromDate) + " and " + StringManipulation.shortenDate(settings_component_1.SettingsComponent.savedToDate);
                    }
                    return (todoDate_1 >= fromDate_1 && todoDate_1 <= toDate_1);
                }
            });
            if (returnedTodo.length === 0)
                todos_component_1.TodosComponent.filteredTodosEmpty = true;
            return returnedTodo;
        }
        else {
            return todos;
        }
    };
    ShowInPeriodPipe = __decorate([
        core_1.Pipe({
            name: 'showInPeriod', pure: false
        }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ShowInPeriodPipe);
    return ShowInPeriodPipe;
}());
exports.ShowInPeriodPipe = ShowInPeriodPipe;
var StringManipulation = (function () {
    function StringManipulation() {
    }
    StringManipulation.shortenDate = function (value) {
        var date = new Date(value.toString());
        var mm = date.getMonth() + 1;
        var strMM = mm.toString();
        if (strMM.length === 1) {
            strMM = "0" + strMM;
        }
        var dd = date.getDate();
        var strDD = dd.toString();
        if (strDD.length === 1) {
            strDD = "0" + strDD;
        }
        var tempDate = strDD + "/" + strMM + "/" + date.getFullYear();
        return tempDate;
    };
    return StringManipulation;
}());
//# sourceMappingURL=show-todos-pipe.js.map