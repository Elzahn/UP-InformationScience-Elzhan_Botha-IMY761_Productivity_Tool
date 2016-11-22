"use strict";
var settings_component_1 = require('./settings-component');
var notifier = require('node-notifier');
var Notification = (function () {
    function Notification() {
    }
    Notification.checkTodoReminders = function (todos) {
        var today = new Date();
        today.setDate(today.getDate() + (+settings_component_1.SettingsComponent.todoRemindDays));
        if (!this.alreadyCheckedTodoReminders) {
            if (settings_component_1.SettingsComponent.todoRemindDays != undefined) {
                todos.forEach(function (todo) {
                    var tempDay = (todo.dueDate).substr(0, 2);
                    var tempMonth = (todo.dueDate).substr(3, 2);
                    var tempYear = (todo.dueDate).substr(6, 4);
                    var tempDate = tempMonth + "/" + tempDay + "/" + tempYear;
                    var todoDate = new Date(tempDate);
                    if (todoDate.getDay() === today.getDay() && todoDate.getMonth() === today.getMonth() && todoDate.getFullYear() === today.getFullYear()) {
                        notifier.notify({
                            title: 'Todo Reminder',
                            message: 'Todo: ' + todo.name + ' is due in ' + settings_component_1.SettingsComponent.todoRemindDays + ' days.',
                            sound: true,
                            wait: true
                        }, function (err, response) {
                            console.log(err, response);
                        });
                    }
                });
                this.alreadyCheckedTodoReminders = true;
            }
            else {
                setTimeout(function () {
                    Notification.checkTodoReminders(todos);
                }, 500);
            }
        }
    };
    Notification.setLastBreakTime = function (value) {
        this.lastBreakTime = value;
    };
    Notification.setBreakTimeAmount = function (value) {
        this.breakTimeAmount = value;
    };
    Notification.setStartBreakTime = function (value) {
        this.startBreakTime = value;
    };
    Notification.setWorkTimeAmount = function (value) {
        this.workTimeAmount = value;
    };
    Notification.calculateBreakTimeReminder = function () {
        if (!this.startBreakTime && settings_component_1.SettingsComponent.showBreakNotifications) {
            if (!this.lastBreakTime) {
                this.lastBreakTime = new Date();
            }
            var timeSinceLastBreak = Date.now() - this.lastBreakTime.getTime();
            timeSinceLastBreak = Math.round(((timeSinceLastBreak % 86400000) % 600000) / 60000);
            if (timeSinceLastBreak >= this.workTimeAmount) {
                notifier.notify({
                    title: 'Break time', message: 'Would you like to take a break now?', sound: true, wait: true
                }, function (err, response) {
                    console.log(err, response);
                });
                this.lastBreakTime = new Date();
            }
        }
    };
    Notification.calculateStartWorkReminder = function () {
        if (!this.lastBreakTime && settings_component_1.SettingsComponent.showBreakNotifications) {
            if (!this.startBreakTime) {
                this.startBreakTime = new Date();
            }
            var timeSinceBreakStarted = Date.now() - this.startBreakTime.getTime();
            timeSinceBreakStarted = Math.round(((timeSinceBreakStarted % 86400000) % 600000) / 60000);
            if (timeSinceBreakStarted >= this.breakTimeAmount) {
                notifier.notify({
                    title: 'Work time',
                    message: 'Do you want to start working again?',
                    sound: true,
                    wait: true
                }, function (err, response) {
                    console.log(err, response);
                });
                this.startBreakTime = new Date();
            }
        }
    };
    Notification.alreadyCheckedTodoReminders = false;
    return Notification;
}());
exports.Notification = Notification;
//# sourceMappingURL=notifications.js.map