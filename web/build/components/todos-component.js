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
var todo_1 = require('./todo');
var show_todos_pipe_1 = require('../pipes/show-todos-pipe');
var main_component_1 = require("./main-component");
var ng2_tooltip_1 = require('ng2-tooltip');
var angular2_toaster_1 = require('angular2-toaster/angular2-toaster');
var ng2_dragula_1 = require('ng2-dragula/ng2-dragula');
var orderBy_pipe_1 = require('../pipes/orderBy-pipe');
var TodosComponent = (function (_super) {
    __extends(TodosComponent, _super);
    function TodosComponent(ref, toasterService, dragulaService) {
        var _this = this;
        _super.call(this, ref);
        this.savedArg = { saved: true };
        this.notSavedArg = { saved: false };
        this.toasterService = toasterService;
        this.dragulaService = dragulaService;
        this.dragulaService.setOptions('todo-container', {
            revertOnSpill: true, moves: function (el, container, handle) {
                return handle.className === 'handle';
            }
        });
        this.dragulaService.dropModel.subscribe(function (value) {
            _this.onDropModel(value.slice(1));
        });
    }
    TodosComponent.prototype.onDropModel = function (args) {
        this.saveData();
    };
    TodosComponent.prototype.getFilteredTodosEmpty = function () {
        return TodosComponent.filteredTodosEmpty;
    };
    TodosComponent.prototype.getFilteredMessage = function () {
        return TodosComponent.filteredMessage;
    };
    TodosComponent.prototype.getFilteredBy = function () {
        return TodosComponent.filteredBy;
    };
    TodosComponent.prototype.addTodo = function () {
        var alreadyOpen = false;
        this.myScrollContainer.nativeElement.scrollTop = 0;
        if (this.todos && this.todos.length > 0) {
            this.todos.forEach(function (todo) {
                if (!todo.saved)
                    alreadyOpen = true;
                if (todo.saved && todo.inEdit)
                    this.cancelChanges(todo);
            }.bind(this));
        }
        if (!alreadyOpen) {
            this.todos.push(new todo_1.NewTodo());
            this.calculateProgressBar();
        }
        else {
            this.toasterService.pop("warning", "Add new todo", "Only one todo can be added at a time.");
        }
    };
    TodosComponent.prototype.workingOnIt = function (todo) {
        todo.workingOnTodo = !todo.workingOnTodo;
        if (todo.workingOnTodo) {
            this.toasterService.pop("success", "Working on it", "Todo added to timeline");
            var date = this.getShortenedDate(new Date());
            this.addDayToArray(date, todo);
        }
        this.saveData();
    };
    TodosComponent.prototype.toggleTodoCompletionState = function (todo) {
        todo.completed = true;
        todo.workingOnTodo = false;
        todo.completedOn = this.getShortenedDate(new Date());
        this.deleteTodo(todo, true);
        this.completedTodos.push(todo);
        this.calculateProgressBar();
        this.updateMyDaysArray(todo.name, 'completed', todo.completed);
        this.saveData();
    };
    TodosComponent.prototype.acceptChanges = function (todo, todoName, todoDesc, todoDueDate) {
        if (todoName !== "" && todoDesc !== "" && todoDueDate != "") {
            var duplicate_1 = false;
            if (!todo.saved) {
                if (this.todos) {
                    this.todos.forEach(function (todo) {
                        if (todo.name === todoName) {
                            duplicate_1 = true;
                        }
                    });
                }
            }
            if (duplicate_1) {
                this.toasterService.pop("warning", "Accept changes", "A todo with this name already exists.");
            }
            else {
                todo.name = todoName;
                todo.description = todoDesc;
                todo.dueDate = this.getShortenedDate(new Date(todoDueDate));
                todo.saved = true;
                todo.inEdit = false;
                todo.datePickerDue = todoDueDate;
                this.toasterService.clear();
                this.saveData();
            }
        }
        else {
            this.toasterService.pop("warning", "Accept changes", "All fields must be completed before saving changes.");
        }
    };
    TodosComponent.prototype.cancelChanges = function (todo) {
        if (todo.saved) {
            todo.inEdit = false;
        }
        else {
            this.deleteTodo(todo);
        }
    };
    TodosComponent.prototype.activateEditMode = function (todo) {
        this.todos.forEach(function (currentTodo) {
            if (currentTodo.inEdit)
                this.cancelChanges(currentTodo);
        }.bind(this));
        todo.inEdit = true;
        this.ref.markForCheck();
    };
    TodosComponent.prototype.updateMyDaysArray = function (todoName, property, value) {
        this.myDays.forEach(function (currentDay) {
            currentDay.todos.forEach(function (currentTodo) {
                if (currentTodo.name === todoName) {
                    currentTodo[property] = value;
                }
            });
        });
        this.saveData();
    };
    TodosComponent.filteredTodosEmpty = false;
    TodosComponent.filteredMessage = "";
    TodosComponent.filteredBy = "";
    __decorate([
        core_1.ViewChild('Todos'), 
        __metadata('design:type', core_1.ElementRef)
    ], TodosComponent.prototype, "myScrollContainer", void 0);
    TodosComponent = __decorate([
        core_1.Component({
            selector: 'activeComponent',
            templateUrl: './views/todos-component.html',
            styleUrls: ['./css/todos-component.css', './css/common.css'],
            providers: [angular2_toaster_1.ToasterService, ng2_dragula_1.DragulaService],
            directives: [ng2_tooltip_1.TOOLTIP_DIRECTIVES, angular2_toaster_1.ToasterContainerComponent, ng2_dragula_1.Dragula],
            pipes: [show_todos_pipe_1.ShowActiveTodosPipe, orderBy_pipe_1.OrderByPipe, show_todos_pipe_1.ShowInPeriodPipe]
        }), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef, angular2_toaster_1.ToasterService, ng2_dragula_1.DragulaService])
    ], TodosComponent);
    return TodosComponent;
}(main_component_1.MainComponent));
exports.TodosComponent = TodosComponent;
//# sourceMappingURL=todos-component.js.map