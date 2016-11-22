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
var notifications_1 = require('./notifications');
var encrypter = require('object-encrypter');
var engine = encrypter('your secret');
var storage = require('electron-json-storage');
var SettingsComponent = (function () {
    function SettingsComponent(ref) {
        var _this = this;
        this.ref = ref;
        SettingsComponent.readUserSettingsData();
        setTimeout(function () {
            _this.ref.markForCheck();
        }, 500);
    }
    SettingsComponent.prototype.saveCheckedViewByChange = function (value) {
        SettingsComponent.checkedViewByValue = value;
        SettingsComponent.staticSaveUserSettings();
    };
    SettingsComponent.prototype.getReminderDayValue = function () {
        return SettingsComponent.todoRemindDays;
    };
    SettingsComponent.prototype.saveCheckedNotifyChange = function (name, numDays) {
        if (name === 'breakNotifications') {
            SettingsComponent.showBreakNotifications = !SettingsComponent.showBreakNotifications;
        }
        else if (name === 'todoReminders') {
            SettingsComponent.todoReminders = !SettingsComponent.todoReminders;
        }
        else {
            SettingsComponent.todoRemindDays = numDays;
        }
        SettingsComponent.staticSaveUserSettings();
    };
    SettingsComponent.prototype.saveCheckedViewPeriodChange = function (name, fromDate, toDate) {
        var today = new Date();
        if (name === 'today') {
            SettingsComponent.fromDate = today;
            SettingsComponent.toDate = today;
        }
        else if (name === 'week') {
            var firstDay = (today.getDate() - today.getDay());
            SettingsComponent.fromDate = new Date(today.getFullYear(), today.getMonth(), firstDay);
            SettingsComponent.toDate = new Date(today.getFullYear(), today.getMonth(), (firstDay + 6));
        }
        else if (name === 'month') {
            var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            var lastDay = new Date(today.getFullYear(), (today.getMonth() + 1), 0);
            SettingsComponent.fromDate = firstDay;
            SettingsComponent.toDate = lastDay;
        }
        else if (name === 'all') {
            SettingsComponent.fromDate = new Date();
            SettingsComponent.toDate = new Date();
        }
        else {
            SettingsComponent.fromDate = new Date(fromDate);
            SettingsComponent.toDate = new Date(toDate);
        }
        SettingsComponent.checkedPeriodValue = name;
        SettingsComponent.staticSaveUserSettings();
    };
    SettingsComponent.prototype.amIcheckedViewByRadio = function (value) {
        return SettingsComponent.checkedViewByValue === value;
    };
    SettingsComponent.prototype.amIcheckedNotifyCheckBox = function (value) {
        if (value === 'breakNotifications') {
            return SettingsComponent.showBreakNotifications;
        }
        else {
            return SettingsComponent.todoReminders;
        }
    };
    SettingsComponent.prototype.amIcheckedViewPeriodRadio = function (value) {
        return SettingsComponent.checkedPeriodValue === value;
    };
    SettingsComponent.readUserSettingsData = function () {
        storage.has(this.userSettingsFileName, function (error, hasKey) {
            if (error)
                throw error;
            if (hasKey) {
                storage.get(this.userSettingsFileName, function (error, data) {
                    if (error)
                        throw error;
                    var dataObj = engine.decrypt(data);
                    if (dataObj.showBreakNotifications != undefined) {
                        this.staticSetShowBreakNotifications(dataObj.showBreakNotifications);
                    }
                    else {
                        this.staticSetShowBreakNotifications(true);
                    }
                    if (dataObj.todoReminders != undefined) {
                        this.staticSetTodoReminders(dataObj.todoReminders);
                    }
                    else {
                        this.staticSetTodoReminders(true);
                    }
                    if (dataObj.todoRemindDays != undefined) {
                        this.staticSetTodoReminderDays(dataObj.todoRemindDays);
                    }
                    else {
                        this.staticSetTodoReminderDays(3);
                    }
                    if (dataObj.checkedViewByValue != undefined) {
                        this.staticSetCheckedViewByValue(dataObj.checkedViewByValue);
                    }
                    else {
                        this.staticSetCheckedViewByValue("dueDate");
                    }
                    if (dataObj.checkedPeriodValue != undefined) {
                        this.staticSetCheckedPeriodValue(dataObj.checkedPeriodValue);
                    }
                    else {
                        this.staticSetCheckedPeriodValue("all");
                    }
                    if (dataObj.fromDate != undefined && dataObj.toDate != undefined) {
                        this.staticSetToDate(dataObj.toDate);
                        this.staticSetFromDate(dataObj.fromDate);
                    }
                    else {
                        this.staticSetToDate(new Date());
                        this.staticSetFromDate(new Date());
                    }
                    if (dataObj.savedFromDate != undefined && dataObj.savedToDate != undefined) {
                        this.staticSetSavedFromDate(dataObj.savedFromDate);
                        this.staticSetSavedToDate(dataObj.savedToDate);
                    }
                    else {
                        this.staticSetSavedToDate(new Date());
                        this.staticSetSavedFromDate(new Date());
                    }
                    if (dataObj.workAmount != undefined) {
                        notifications_1.Notification.setWorkTimeAmount(dataObj.workAmount);
                    }
                    else {
                        notifications_1.Notification.setWorkTimeAmount(25);
                    }
                    if (dataObj.breakAmount != undefined) {
                        notifications_1.Notification.setBreakTimeAmount(dataObj.breakAmount);
                    }
                    else {
                        notifications_1.Notification.setBreakTimeAmount(15);
                    }
                    notifications_1.Notification.setLastBreakTime(new Date());
                }.bind(this));
            }
            else {
                this.staticSetShowBreakNotifications(true);
                this.staticSetTodoReminders(true);
                this.staticSetTodoReminderDays(3);
                this.staticSetCheckedViewByValue("dueDate");
                this.staticSetCheckedPeriodValue("all");
                this.staticSaveCheckedViewPeriodChange(this.checkedPeriodValue);
                this.staticSetToDate(new Date());
                this.staticSetFromDate(new Date());
                this.staticSetSavedToDate(new Date());
                this.staticSetSavedFromDate(new Date());
                notifications_1.Notification.setWorkTimeAmount(25);
                notifications_1.Notification.setBreakTimeAmount(15);
                notifications_1.Notification.setLastBreakTime(new Date());
            }
        }.bind(this));
    };
    SettingsComponent.staticSaveCheckedViewPeriodChange = function (name, fromDate, toDate) {
        var today = new Date();
        SettingsComponent.checkedPeriodValue = name;
        if (name === 'today') {
            SettingsComponent.fromDate = today;
            SettingsComponent.toDate = today;
        }
        else if (name === 'week') {
            today.setDate(today.getDate() + 1);
            var firstDay = (today.getDate() - today.getDay());
            SettingsComponent.fromDate = new Date(today.getFullYear(), today.getMonth(), firstDay);
            SettingsComponent.toDate = new Date(today.getFullYear(), today.getMonth(), (firstDay + 6));
        }
        else if (name === 'month') {
            var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            var lastDay = new Date(today.getFullYear(), (today.getMonth() + 1), 0);
            SettingsComponent.fromDate = firstDay;
            SettingsComponent.toDate = lastDay;
        }
        else if (name === 'all') {
            SettingsComponent.fromDate = new Date();
            SettingsComponent.toDate = new Date();
        }
        else {
            SettingsComponent.fromDate = new Date(fromDate);
            SettingsComponent.toDate = new Date(toDate);
        }
        SettingsComponent.staticSaveUserSettings();
    };
    SettingsComponent.staticSetTodoReminderDays = function (value) {
        SettingsComponent.todoRemindDays = value;
        SettingsComponent.staticSaveUserSettings();
    };
    SettingsComponent.staticSetToDate = function (value) {
        SettingsComponent.toDate = value;
        SettingsComponent.staticSaveUserSettings();
    };
    SettingsComponent.staticSetSavedToDate = function (value) {
        SettingsComponent.savedToDate = value;
        SettingsComponent.staticSaveUserSettings();
    };
    SettingsComponent.staticSetFromDate = function (value) {
        SettingsComponent.fromDate = value;
        SettingsComponent.staticSaveUserSettings();
    };
    SettingsComponent.staticSetSavedFromDate = function (value) {
        SettingsComponent.savedFromDate = value;
        SettingsComponent.staticSaveUserSettings();
    };
    SettingsComponent.staticSetCheckedViewByValue = function (value) {
        SettingsComponent.checkedViewByValue = value;
        SettingsComponent.staticSaveUserSettings();
    };
    SettingsComponent.staticSetShowBreakNotifications = function (value) {
        this.showBreakNotifications = value;
        SettingsComponent.staticSaveUserSettings();
    };
    SettingsComponent.staticSetCheckedPeriodValue = function (value) {
        SettingsComponent.checkedPeriodValue = value;
        SettingsComponent.staticSaveUserSettings();
    };
    SettingsComponent.staticSetTodoReminders = function (value) {
        this.todoReminders = value;
        SettingsComponent.staticSaveUserSettings();
    };
    SettingsComponent.prototype.getWorkAmount = function () {
        return notifications_1.Notification.workTimeAmount;
    };
    SettingsComponent.prototype.getBreakAmount = function () {
        return notifications_1.Notification.breakTimeAmount;
    };
    SettingsComponent.prototype.saveWorkAmount = function (value) {
        notifications_1.Notification.setWorkTimeAmount(+value);
        SettingsComponent.staticSaveUserSettings();
    };
    SettingsComponent.prototype.saveBreakAmount = function (value) {
        notifications_1.Notification.setBreakTimeAmount(+value);
        SettingsComponent.staticSaveUserSettings();
    };
    SettingsComponent.staticSaveUserSettings = function () {
        var jsonObj = {
            'checkedViewByValue': SettingsComponent.checkedViewByValue,
            'showBreakNotifications': SettingsComponent.showBreakNotifications,
            'todoReminders': SettingsComponent.todoReminders,
            'todoRemindDays': SettingsComponent.todoRemindDays,
            'checkedPeriodValue': SettingsComponent.checkedPeriodValue,
            'toDate': SettingsComponent.toDate,
            'fromDate': SettingsComponent.fromDate,
            'workAmount': notifications_1.Notification.workTimeAmount,
            'breakAmount': notifications_1.Notification.breakTimeAmount,
            'savedToDate': SettingsComponent.savedToDate,
            'savedFromDate': SettingsComponent.savedFromDate,
        };
        if (SettingsComponent.checkedViewByValue != undefined &&
            SettingsComponent.showBreakNotifications != undefined &&
            SettingsComponent.todoRemindDays != undefined &&
            SettingsComponent.todoReminders != undefined &&
            SettingsComponent.checkedPeriodValue != undefined &&
            notifications_1.Notification.breakTimeAmount != undefined &&
            notifications_1.Notification.workTimeAmount != undefined &&
            SettingsComponent.toDate != undefined &&
            SettingsComponent.fromDate != undefined &&
            SettingsComponent.savedToDate != undefined &&
            SettingsComponent.savedFromDate != undefined) {
            var jsonStr = engine.encrypt(jsonObj);
            storage.set(this.userSettingsFileName, jsonStr, function (error) {
                if (error)
                    throw error;
            });
        }
    };
    SettingsComponent.prototype.getToDate = function () {
        var tempDate;
        if (SettingsComponent.savedToDate != undefined) {
            tempDate = new Date(SettingsComponent.savedToDate.toString());
        }
        else {
            tempDate = new Date();
        }
        var mm = tempDate.getMonth() + 1;
        var strMM = mm.toString();
        if (strMM.length === 1) {
            strMM = "0" + strMM;
        }
        var dd = tempDate.getDate();
        var strDD = dd.toString();
        if (strDD.length === 1) {
            strDD = "0" + strDD;
        }
        var tempToDate = tempDate.getFullYear() + "-" + strMM + "-" + strDD;
        return tempToDate;
    };
    SettingsComponent.prototype.getFromDate = function () {
        var tempDate;
        if (SettingsComponent.savedFromDate) {
            tempDate = new Date(SettingsComponent.savedFromDate.toString());
        }
        else {
            tempDate = new Date();
        }
        var mm = tempDate.getMonth() + 1;
        var strMM = mm.toString();
        if (strMM.length === 1) {
            strMM = "0" + strMM;
        }
        var dd = tempDate.getDate();
        var strDD = dd.toString();
        if (strDD.length === 1) {
            strDD = "0" + strDD;
        }
        var tempFromDate = tempDate.getFullYear() + "-" + strMM + "-" + strDD;
        return tempFromDate;
    };
    SettingsComponent.prototype.saveToDate = function (value) {
        SettingsComponent.staticSetToDate(new Date(value));
        SettingsComponent.staticSetSavedToDate(new Date(value));
    };
    SettingsComponent.prototype.saveFromDate = function (value) {
        var tempFrom = new Date(value);
        tempFrom.setDate(tempFrom.getDate() - 1);
        SettingsComponent.staticSetFromDate(tempFrom);
        SettingsComponent.staticSetSavedFromDate(new Date(value));
    };
    SettingsComponent.prototype.setShowBreakNotifications = function (value) {
        SettingsComponent.staticSetShowBreakNotifications(value);
    };
    SettingsComponent.prototype.setTodoReminders = function (value) {
        SettingsComponent.staticSetTodoReminders(value);
    };
    SettingsComponent.userSettingsFileName = 'ProductivityToolSettings';
    SettingsComponent = __decorate([
        core_1.Component({
            selector: 'settingsComponent',
            templateUrl: './views/settings-component.html',
            styleUrls: ['./css/settings-component.css', './css/common.css']
        }), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef])
    ], SettingsComponent);
    return SettingsComponent;
}());
exports.SettingsComponent = SettingsComponent;
//# sourceMappingURL=settings-component.js.map