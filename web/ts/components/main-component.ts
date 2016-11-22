import {Component, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {NavigationComponent} from './navigation-component';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {todoType, NewTodo} from './todo';
import {noteType} from './note';
import {dayType, newDay} from './day';
import {ToasterConfig} from "angular2-toaster/angular2-toaster";
import {Notification} from './notifications';
import {SettingsComponent} from './settings-component';

const encrypter = require('object-encrypter');
const engine = encrypter('your secret');
const storage = require('electron-json-storage');

@Component({
    selector:'productivityTool',
    changeDetection:ChangeDetectionStrategy.OnPush,
    templateUrl:'./views/main-component.html',
    directives:[ROUTER_DIRECTIVES, NavigationComponent]
})

export class MainComponent {

    public toasterConfig:ToasterConfig;
    protected todoFileName:string = 'ProductivityToolData';
    protected userSettingsFileName:string = 'ProductivityToolSettings';
    protected todos:Array<todoType>;
    protected completedTodos:Array<todoType>;
    protected notes:Array<noteType>;
    protected completedNotes:Array<noteType>;
    protected ref:ChangeDetectorRef;
    protected progress:string;
    protected takeABreak:boolean;
    protected startDate:string;
    protected myDays:Array<dayType>;

    constructor (ref:ChangeDetectorRef) {

        setTimeout(() => {
            this.ref = ref;
            this.toasterConfig = new ToasterConfig({limit:1});

            this.readTodoData();
            this.readUserSettingsData();

            setTimeout(() => {
                this.addMissingDays(this.getShortenedDate(new Date()));
                this.fillInWorkingOnIt(this.getShortenedDate(new Date()));
                this.calculateProgressBar();
            }, 100);

            setInterval(() => {
                Notification.calculateBreakTimeReminder();
                Notification.calculateStartWorkReminder();
            }, 300);
        }, 200);
    }

    private readUserSettingsData () {

        SettingsComponent.readUserSettingsData();
    }

    private readTodoData () {

        storage.has(this.todoFileName, function (error, hasKey) {

            if (error)
                throw error;

            if (hasKey) {
                storage.get(this.todoFileName, function (error, data) {

                    if (error)
                        throw error;

                    // let dataObj = JSON.parse(data);
                    let dataObj = engine.decrypt(data);

                    if (dataObj.todos) {
                        this.todos = dataObj.todos;
                    } else {
                        this.todos = [];
                    }

                    if (dataObj.completedTodos) {
                        this.completedTodos = dataObj.completedTodos;
                    } else {
                        this.completedTodos = [];
                    }

                    if (dataObj.notes) {
                        this.notes = dataObj.notes;
                    } else {
                        this.notes = [];
                    }

                    if (dataObj.completedNotes) {
                        this.completedNotes = dataObj.completedNotes;
                    } else {
                        this.completedNotes = [];
                    }

                    if (dataObj.takeABreak) {
                        this.takeABreak = dataObj.takeABreak;
                    } else {
                        this.takeABreak = false;
                    }

                    if (dataObj.startDate) {
                        this.startDate = dataObj.startDate;
                    } else {
                        this.startDate = this.getShortenedDate(new Date());
                    }

                    if (dataObj.myDays) {
                        this.myDays = dataObj.myDays;
                    } else {
                        this.myDays = [];//new newDay(this.getShortenedDate(new Date()))];
                    }

                    this.calculateProgressBar();
                    Notification.checkTodoReminders(this.todos);
                }.bind(this));
            } else {
                this.todos = [];
                this.completedTodos = [];
                this.notes = [];
                this.completedNotes = [];
                this.myDays = [];//new newDay(this.getShortenedDate(new Date()))];
                this.takeABreak = false;
                this.startDate = this.getShortenedDate(new Date());
            }
        }.bind(this));
    }

    private addMissingDays (until:string) {

        if (this.myDays && this.myDays.length > 0) {
            let lastIndex:number = this.myDays.length - 1;

            let tempDay:string = (until).substr(0, 2);
            let tempMonth:string = (until).substr(3, 2);
            let tempYear:string = (until).substr(6, 4);
            let tempDate:string = tempMonth + "/" + tempDay + "/" + tempYear;
            let untilDate = new Date(tempDate);

            tempDay = (this.myDays[lastIndex].date).substr(0, 2);
            tempMonth = (this.myDays[lastIndex].date).substr(3, 2);
            tempYear = (this.myDays[lastIndex].date).substr(6, 4);
            tempDate = tempMonth + "/" + tempDay + "/" + tempYear;
            let currentDate:Date = new Date(tempDate);
            currentDate.setDate(currentDate.getDate() + 1);

            while (currentDate <= untilDate) {
                this.myDays.push(new newDay(this.getShortenedDate(currentDate)));
                currentDate.setDate(currentDate.getDate() + 1);
            }

            this.addMissingInbetweenDays();
        } else {
            this.myDays.push(new newDay(this.getShortenedDate(new Date())));
        }
    }

    private addMissingInbetweenDays () {

        if (this.myDays && this.myDays.length > 0) {
            let index:number = 0;
            let splicedArray:boolean = false;
            let tempDate:Date;
            let currentDate:Date = new Date(this.myDays[0].date);
            currentDate.setDate(currentDate.getDate() + 1);

            this.myDays.some(function (day) {

                let tempDay:string = (day.date).substr(0, 2);
                let tempMonth:string = (day.date).substr(3, 2);
                let tempYear:string = (day.date).substr(6, 4);
                let tempDateStr:string = tempMonth + "/" + tempDay + "/" + tempYear;

                tempDate = new Date(tempDateStr);
                index++;

                if (tempDate >= currentDate) {
                    currentDate.setDate(currentDate.getDate() - 1);
                    this.myDays.splice(index - 1, 0, new newDay(this.getShortenedDate(currentDate)));
                    splicedArray = true;
                    return true;
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }.bind(this));

            if (splicedArray) {
                this.addMissingInbetweenDays();
            }

            this.saveData();
        }
    }

    private todoInDay (checkTodo:todoType):string {

        let date:string = "";

        if (this.myDays && this.myDays.length > 0) {
            this.myDays.forEach(function (day) {
                day.todos.forEach(function (todo) {
                    if (todo.name === checkTodo.name)
                        date = day.date;
                });
            });
        }

        return date;
    }

    protected fillInWorkingOnIt (today:string):void {

        let foundDate:string = "";
        let tempDay:Date;
        let currentDay:Date;

        if (this.todos && this.todos.length > 0) {
            this.todos.forEach(function (todo) {
                if (todo.workingOnTodo) {
                    foundDate = this.todoInDay(todo);
                    if (foundDate !== "") {

                        let tempDayStr:string = (foundDate).substr(0, 2);
                        let tempMonth:string = (foundDate).substr(3, 2);
                        let tempYear:string = (foundDate).substr(6, 4);
                        let tempDateStr:string = tempMonth + "/" + tempDayStr + "/" + tempYear;

                        currentDay = new Date(tempDateStr);
                        this.myDays.forEach(function (day) {

                            let tempDayStr:string = (day.date).substr(0, 2);
                            let tempMonth:string = (day.date).substr(3, 2);
                            let tempYear:string = (day.date).substr(6, 4);
                            let tempDateStr:string = tempMonth + "/" + tempDayStr + "/" + tempYear;

                            tempDay = new Date(tempDateStr);
                            if (tempDay > currentDay) {
                                day.todos.push(todo);
                            }
                        });
                    }
                }
            }.bind(this));
        }

        setTimeout(() => {
            this.saveData();
        }, 200);
    }

    protected calculateProgressBar () {

        let numCompleted:number = 0;
        let tempProgress:number = 0;

        if (this.todos && this.completedTodos) {

            this.completedTodos.forEach(function (todo) {
                if (todo.completed)
                    numCompleted++;
            });

            let totalTodos = this.todos.length + this.completedTodos.length;

            tempProgress = (numCompleted / totalTodos) * 100;
        }

        if (tempProgress === 100)
            tempProgress += 2;

        if (isNaN(tempProgress))
            tempProgress = 0;

        this.progress = tempProgress.toString() + "%";

        this.ref.markForCheck();
    }

    protected saveData ():void {

        let jsonObj:Object = {
            'startDate':this.startDate,
            'takeABreak':this.takeABreak,
            'todos':this.todos,
            'completedTodos':this.completedTodos,
            'notes':this.notes,
            'completedNotes':this.completedNotes,
            'myDays':this.myDays
        };

        if (this.startDate != undefined && this.takeABreak != undefined && this.todos != undefined && this.notes != undefined && this.myDays != undefined && this.completedTodos != undefined && this.completedNotes != undefined) {

            // let jsonStr:string = JSON.stringify(jsonObj);
            let jsonStr = engine.encrypt(jsonObj);

            storage.set(this.todoFileName, jsonStr, function (error) {
                if (error)
                    throw error;
            });
        }
    }

    protected deleteTodo (todo:todoType, completed?:boolean):void {

        let userAction:boolean;

        if (completed == undefined && todo.name != "") {
            userAction = confirm("Continue with the deletion of todo: " + todo.name + "?");
        } else {
            userAction = true;
        }

        if (userAction) {
            let index = this.todos.indexOf(todo);

            if (index > -1) {
                this.todos.splice(index, 1);
                this.calculateProgressBar();
                this.saveData();
            } else {
                let index = this.completedTodos.indexOf(todo);

                if (index > -1) {
                    this.completedTodos.splice(index, 1);
                    this.calculateProgressBar();
                    this.saveData();
                }
            }
        }
    }

    protected takeBreak () {

        this.takeABreak = !this.takeABreak;
        let currentDay: string = this.getShortenedDate(new Date());
        let takeBreakTodo = new NewTodo();

        if (!this.takeABreak) {
            Notification.setLastBreakTime(new Date());
            Notification.setStartBreakTime(null);

            takeBreakTodo.name = "Break Over";
            takeBreakTodo.description = "Going back to work";
            takeBreakTodo.colour = "#93cf13";
            this.addDayToArray(currentDay, takeBreakTodo);
        } else {
            Notification.setStartBreakTime(new Date());
            Notification.setLastBreakTime(null);

            takeBreakTodo.name = "Break Time";
            takeBreakTodo.description = "Taking a break";
            takeBreakTodo.colour = "#b0a9ec";
            this.addDayToArray(currentDay, takeBreakTodo);
        }

        this.saveData();
    }

    protected getShortenedDate (date:Date):string {

        let mm:number = date.getMonth() + 1;
        let strMM:string = mm.toString();

        if(strMM.length === 1){
            strMM = "0" + strMM
        }

        let dd = date.getDate();
        let strDD = dd.toString();

        if(strDD.length === 1){
            strDD = "0" + strDD;
        }

        // let tempDate = date.getFullYear() + "-" + strMM + "-" + strDD;
        let tempDate = strDD + "/" + strMM + "/" + date.getFullYear();
        return tempDate;
    }

    private returnDayIfDayExists (date:string):dayType {

        let returnedDay = null;

        if (this.myDays && this.myDays.length > 0) {
            this.myDays.some(function (day) {
                if (day.date == date) {
                    returnedDay = day;
                    return true;
                }
            });
        }

        return returnedDay;
    }

    protected addDayToArray (date:string, todo?:todoType):void {

        let day:dayType = this.returnDayIfDayExists(date);

        if (day === null) {
            console.log(date);
            this.myDays.push(new newDay(date, todo));
        } else if (todo) {
            day.todos.push(todo);
        }

        this.saveData();
    }
}
