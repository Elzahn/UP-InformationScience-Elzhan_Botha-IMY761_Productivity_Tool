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
var core_1 = require('@angular/core');
var navigation_component_1 = require('./navigation-component');
var router_1 = require('@angular/router');
var todo_1 = require('./todo');
var day_1 = require('./day');
var angular2_toaster_1 = require("angular2-toaster/angular2-toaster");
var notifications_1 = require('./notifications');
var settings_component_1 = require('./settings-component');
var encrypter = require('object-encrypter');
var engine = encrypter('your secret');
var storage = require('electron-json-storage');
var MainComponent = (function () {
    function MainComponent(ref) {
        var _this = this;
        this.todoFileName = 'ProductivityToolData';
        this.userSettingsFileName = 'ProductivityToolSettings';
        setTimeout(function () {
            _this.ref = ref;
            _this.toasterConfig = new angular2_toaster_1.ToasterConfig({ limit: 1 });
            _this.readTodoData();
            _this.readUserSettingsData();
            setTimeout(function () {
                _this.addMissingDays(_this.getShortenedDate(new Date()));
                _this.fillInWorkingOnIt(_this.getShortenedDate(new Date()));
                _this.calculateProgressBar();
            }, 100);
            setInterval(function () {
                notifications_1.Notification.calculateBreakTimeReminder();
                notifications_1.Notification.calculateStartWorkReminder();
            }, 300);
        }, 200);
    }
    MainComponent.prototype.readUserSettingsData = function () {
        settings_component_1.SettingsComponent.readUserSettingsData();
    };
    MainComponent.prototype.readTodoData = function () {
        storage.has(this.todoFileName, function (error, hasKey) {
            if (error)
                throw error;
            if (hasKey) {
                storage.get(this.todoFileName, function (error, data) {
                    if (error)
                        throw error;
                    var dataObj = engine.decrypt(data);
                    if (dataObj.todos) {
                        this.todos = dataObj.todos;
                    }
                    else {
                        this.todos = [];
                    }
                    if (dataObj.completedTodos) {
                        this.completedTodos = dataObj.completedTodos;
                    }
                    else {
                        this.completedTodos = [];
                    }
                    if (dataObj.notes) {
                        this.notes = dataObj.notes;
                    }
                    else {
                        this.notes = [];
                    }
                    if (dataObj.completedNotes) {
                        this.completedNotes = dataObj.completedNotes;
                    }
                    else {
                        this.completedNotes = [];
                    }
                    if (dataObj.takeABreak) {
                        this.takeABreak = dataObj.takeABreak;
                    }
                    else {
                        this.takeABreak = false;
                    }
                    if (dataObj.startDate) {
                        this.startDate = dataObj.startDate;
                    }
                    else {
                        this.startDate = this.getShortenedDate(new Date());
                    }
                    if (dataObj.myDays) {
                        this.myDays = dataObj.myDays;
                    }
                    else {
                        this.myDays = [];
                    }
                    this.calculateProgressBar();
                    notifications_1.Notification.checkTodoReminders(this.todos);
                }.bind(this));
            }
            else {
                this.todos = [];
                this.completedTodos = [];
                this.notes = [];
                this.completedNotes = [];
                this.myDays = [];
                this.takeABreak = false;
                this.startDate = this.getShortenedDate(new Date());
            }
        }.bind(this));
    };
    MainComponent.prototype.addMissingDays = function (until) {
        if (this.myDays && this.myDays.length > 0) {
            var lastIndex = this.myDays.length - 1;
            var tempDay = (until).substr(0, 2);
            var tempMonth = (until).substr(3, 2);
            var tempYear = (until).substr(6, 4);
            var tempDate = tempMonth + "/" + tempDay + "/" + tempYear;
            var untilDate = new Date(tempDate);
            tempDay = (this.myDays[lastIndex].date).substr(0, 2);
            tempMonth = (this.myDays[lastIndex].date).substr(3, 2);
            tempYear = (this.myDays[lastIndex].date).substr(6, 4);
            tempDate = tempMonth + "/" + tempDay + "/" + tempYear;
            var currentDate = new Date(tempDate);
            currentDate.setDate(currentDate.getDate() + 1);
            while (currentDate <= untilDate) {
                this.myDays.push(new day_1.newDay(this.getShortenedDate(currentDate)));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            this.addMissingInbetweenDays();
        }
        else {
            this.myDays.push(new day_1.newDay(this.getShortenedDate(new Date())));
        }
    };
    MainComponent.prototype.addMissingInbetweenDays = function () {
        if (this.myDays && this.myDays.length > 0) {
            var index_1 = 0;
            var splicedArray_1 = false;
            var tempDate_1;
            var currentDate_1 = new Date(this.myDays[0].date);
            currentDate_1.setDate(currentDate_1.getDate() + 1);
            this.myDays.some(function (day) {
                var tempDay = (day.date).substr(0, 2);
                var tempMonth = (day.date).substr(3, 2);
                var tempYear = (day.date).substr(6, 4);
                var tempDateStr = tempMonth + "/" + tempDay + "/" + tempYear;
                tempDate_1 = new Date(tempDateStr);
                index_1++;
                if (tempDate_1 >= currentDate_1) {
                    currentDate_1.setDate(currentDate_1.getDate() - 1);
                    this.myDays.splice(index_1 - 1, 0, new day_1.newDay(this.getShortenedDate(currentDate_1)));
                    splicedArray_1 = true;
                    return true;
                }
                currentDate_1.setDate(currentDate_1.getDate() + 1);
            }.bind(this));
            if (splicedArray_1) {
                this.addMissingInbetweenDays();
            }
            this.saveData();
        }
    };
    MainComponent.prototype.todoInDay = function (checkTodo) {
        var date = "";
        if (this.myDays && this.myDays.length > 0) {
            this.myDays.forEach(function (day) {
                day.todos.forEach(function (todo) {
                    if (todo.name === checkTodo.name)
                        date = day.date;
                });
            });
        }
        return date;
    };
    MainComponent.prototype.fillInWorkingOnIt = function (today) {
        var _this = this;
        var foundDate = "";
        var tempDay;
        var currentDay;
        if (this.todos && this.todos.length > 0) {
            this.todos.forEach(function (todo) {
                if (todo.workingOnTodo) {
                    foundDate = this.todoInDay(todo);
                    if (foundDate !== "") {
                        var tempDayStr = (foundDate).substr(0, 2);
                        var tempMonth = (foundDate).substr(3, 2);
                        var tempYear = (foundDate).substr(6, 4);
                        var tempDateStr = tempMonth + "/" + tempDayStr + "/" + tempYear;
                        currentDay = new Date(tempDateStr);
                        this.myDays.forEach(function (day) {
                            var tempDayStr = (day.date).substr(0, 2);
                            var tempMonth = (day.date).substr(3, 2);
                            var tempYear = (day.date).substr(6, 4);
                            var tempDateStr = tempMonth + "/" + tempDayStr + "/" + tempYear;
                            tempDay = new Date(tempDateStr);
                            if (tempDay > currentDay) {
                                day.todos.push(todo);
                            }
                        });
                    }
                }
            }.bind(this));
        }
        setTimeout(function () {
            _this.saveData();
        }, 200);
    };
    MainComponent.prototype.calculateProgressBar = function () {
        var numCompleted = 0;
        var tempProgress = 0;
        if (this.todos && this.completedTodos) {
            this.completedTodos.forEach(function (todo) {
                if (todo.completed)
                    numCompleted++;
            });
            var totalTodos = this.todos.length + this.completedTodos.length;
            tempProgress = (numCompleted / totalTodos) * 100;
        }
        if (tempProgress === 100)
            tempProgress += 2;
        if (isNaN(tempProgress))
            tempProgress = 0;
        this.progress = tempProgress.toString() + "%";
        this.ref.markForCheck();
    };
    MainComponent.prototype.saveData = function () {
        var jsonObj = {
            'startDate': this.startDate,
            'takeABreak': this.takeABreak,
            'todos': this.todos,
            'completedTodos': this.completedTodos,
            'notes': this.notes,
            'completedNotes': this.completedNotes,
            'myDays': this.myDays
        };
        if (this.startDate != undefined && this.takeABreak != undefined && this.todos != undefined && this.notes != undefined && this.myDays != undefined && this.completedTodos != undefined && this.completedNotes != undefined) {
            var jsonStr = engine.encrypt(jsonObj);
            storage.set(this.todoFileName, jsonStr, function (error) {
                if (error)
                    throw error;
            });
        }
    };
    MainComponent.prototype.deleteTodo = function (todo, completed) {
        var userAction;
        if (completed == undefined && todo.name != "") {
            userAction = confirm("Continue with the deletion of todo: " + todo.name + "?");
        }
        else {
            userAction = true;
        }
        if (userAction) {
            var index = this.todos.indexOf(todo);
            if (index > -1) {
                this.todos.splice(index, 1);
                this.calculateProgressBar();
                this.saveData();
            }
            else {
                var index_2 = this.completedTodos.indexOf(todo);
                if (index_2 > -1) {
                    this.completedTodos.splice(index_2, 1);
                    this.calculateProgressBar();
                    this.saveData();
                }
            }
        }
    };
    MainComponent.prototype.takeBreak = function () {
        this.takeABreak = !this.takeABreak;
        var currentDay = this.getShortenedDate(new Date());
        var takeBreakTodo = new todo_1.NewTodo();
        if (!this.takeABreak) {
            notifications_1.Notification.setLastBreakTime(new Date());
            notifications_1.Notification.setStartBreakTime(null);
            takeBreakTodo.name = "Break Over";
            takeBreakTodo.description = "Going back to work";
            takeBreakTodo.colour = "#93cf13";
            this.addDayToArray(currentDay, takeBreakTodo);
        }
        else {
            notifications_1.Notification.setStartBreakTime(new Date());
            notifications_1.Notification.setLastBreakTime(null);
            takeBreakTodo.name = "Break Time";
            takeBreakTodo.description = "Taking a break";
            takeBreakTodo.colour = "#b0a9ec";
            this.addDayToArray(currentDay, takeBreakTodo);
        }
        this.saveData();
    };
    MainComponent.prototype.getShortenedDate = function (date) {
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
    MainComponent.prototype.returnDayIfDayExists = function (date) {
        var returnedDay = null;
        if (this.myDays && this.myDays.length > 0) {
            this.myDays.some(function (day) {
                if (day.date == date) {
                    returnedDay = day;
                    return true;
                }
            });
        }
        return returnedDay;
    };
    MainComponent.prototype.addDayToArray = function (date, todo) {
        var day = this.returnDayIfDayExists(date);
        if (day === null) {
            console.log(date);
            this.myDays.push(new day_1.newDay(date, todo));
        }
        else if (todo) {
            day.todos.push(todo);
        }
        this.saveData();
    };
    MainComponent = __decorate([
        core_1.Component({
            selector: 'productivityTool',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            templateUrl: './views/main-component.html',
            directives: [router_1.ROUTER_DIRECTIVES, navigation_component_1.NavigationComponent]
        }), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef])
    ], MainComponent);
    return MainComponent;
}());
exports.MainComponent = MainComponent;
//# sourceMappingURL=main-component.js.map