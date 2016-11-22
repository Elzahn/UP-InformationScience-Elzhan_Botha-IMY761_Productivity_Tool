import {SettingsComponent} from './settings-component';
import {todoType} from './todo';

const notifier = require('node-notifier');

export class Notification {

    private static lastBreakTime:Date;
    public static breakTimeAmount:number;
    private static startBreakTime:Date;
    public static workTimeAmount:number;
    private static alreadyCheckedTodoReminders:boolean = false;
    
    public static checkTodoReminders(todos:todoType[]){

        let today = new Date();
        today.setDate(today.getDate() + (+SettingsComponent.todoRemindDays));
        
        if(!this.alreadyCheckedTodoReminders) {
            if(SettingsComponent.todoRemindDays != undefined) {
                todos.forEach(function (todo) {

                    let tempDay:string = (todo.dueDate).substr(0, 2);
                    let tempMonth:string = (todo.dueDate).substr(3, 2);
                    let tempYear:string = (todo.dueDate).substr(6, 4);
                    let tempDate:string = tempMonth + "/" + tempDay + "/" + tempYear;
                    let todoDate:Date = new Date(tempDate);

                    if (todoDate.getDay() === today.getDay() && todoDate.getMonth() === today.getMonth() && todoDate.getFullYear() === today.getFullYear()) {
                        notifier.notify({
                            title:'Todo Reminder',
                            message:'Todo: ' + todo.name + ' is due in ' + SettingsComponent.todoRemindDays + ' days.',
                            sound:true,
                            wait:true
                        }, function (err, response) {
                            console.log(err, response);
                        });
                    }
                });
                this.alreadyCheckedTodoReminders = true;
            } else {
                setTimeout(() => {
                    Notification.checkTodoReminders(todos);
                }, 500);
            }
        }
    }

    public static setLastBreakTime (value:Date) {
        this.lastBreakTime = value;
    }

    public static setBreakTimeAmount (value:number) {
        this.breakTimeAmount = value;
    }

    public static setStartBreakTime (value:Date) {
        this.startBreakTime = value;
    }

    public static setWorkTimeAmount (value:number) {
        this.workTimeAmount = value;
    }

    public static calculateBreakTimeReminder () {

        if (!this.startBreakTime && SettingsComponent.showBreakNotifications) {
            if (!this.lastBreakTime) {
                this.lastBreakTime = new Date();
            }

            let timeSinceLastBreak:number = Date.now() - this.lastBreakTime.getTime();

            timeSinceLastBreak = Math.round(((timeSinceLastBreak % 86400000) % 600000) / 60000);

            if (timeSinceLastBreak >= this.workTimeAmount) {
                notifier.notify({
                    title:'Break time', message:'Would you like to take a break now?', sound:true, wait:true
                }, function (err, response) {
                    console.log(err, response);
                });

                this.lastBreakTime = new Date();
            }
        }
    }

    public static calculateStartWorkReminder () {
        
        if (!this.lastBreakTime && SettingsComponent.showBreakNotifications) {
            if (!this.startBreakTime) {
                this.startBreakTime = new Date();
            }

            let timeSinceBreakStarted:number = Date.now() - this.startBreakTime.getTime();

            timeSinceBreakStarted = Math.round(((timeSinceBreakStarted % 86400000) % 600000) / 60000);

            if (timeSinceBreakStarted >= this.breakTimeAmount) {
                notifier.notify({
                    title:'Work time',
                    message:'Do you want to start working again?',
                    sound:true,
                    wait:true
                }, function (err, response) {
                    console.log(err, response);
                });

                this.startBreakTime = new Date();
            }
        }
    }
}