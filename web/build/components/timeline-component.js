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
var main_component_1 = require('./main-component');
var TimelineComponent = (function (_super) {
    __extends(TimelineComponent, _super);
    function TimelineComponent(ref) {
        _super.call(this, ref);
        this.displayDetails = 0;
    }
    TimelineComponent.prototype.isInArray = function (item) {
        var itemIsInArray = false;
        this.todos.forEach(function (todo) {
            if (todo.name === item.name) {
                itemIsInArray = true;
            }
        });
        if (!itemIsInArray) {
            this.completedTodos.forEach(function (todo) {
                if (todo.name === item.name) {
                    itemIsInArray = true;
                }
            });
        }
        return itemIsInArray;
    };
    TimelineComponent.prototype.showTimelineDetails = function (todo) {
        this.displayDetails = 1;
        this.todoName = todo.name;
        this.todoDesc = todo.description;
        this.todoDue = todo.dueDate;
        this.todoCompleted = "";
        this.todoCompletionDate = '';
        if (todo.name !== "Break Over" && todo.name !== "Break Time") {
            if (!this.isInArray(todo)) {
                this.todoCompleted = "deleted was ";
            }
            else {
                this.todoCompleted = "";
            }
            if (todo.completed === true) {
                this.todoCompleted += "completed";
                this.todoCompletionDate = todo.completedOn;
            }
            else {
                this.todoCompleted += "active";
            }
        }
    };
    TimelineComponent.prototype.clearTimelineDetails = function () {
        this.displayDetails = 0;
        this.todoName = "";
        this.todoDesc = "";
        this.todoDue = "";
        this.todoCompleted = "";
    };
    TimelineComponent = __decorate([
        core_1.Component({
            selector: 'timelineComponent',
            templateUrl: './views/timeline-component.html',
            styleUrls: ['./css/timeline-component.css', './css/common.css']
        }), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef])
    ], TimelineComponent);
    return TimelineComponent;
}(main_component_1.MainComponent));
exports.TimelineComponent = TimelineComponent;
//# sourceMappingURL=timeline-component.js.map