import {Component, ChangeDetectorRef} from '@angular/core';
import {Notification} from './notifications';

const encrypter = require('object-encrypter');
const engine = encrypter('your secret');
const storage = require('electron-json-storage');

@Component({
    selector:'settingsComponent',
    templateUrl:'./views/settings-component.html',
    styleUrls:['./css/settings-component.css', './css/common.css']
})

export class SettingsComponent {

    public static fromDate:Date;
    public static savedFromDate:Date;
    public static toDate:Date;
    public static savedToDate:Date;
    public static todoRemindDays:number;
    public static checkedViewByValue:string;
    public static showBreakNotifications:boolean;
    public static todoReminders:boolean;
    public static checkedPeriodValue:string;
    private static userSettingsFileName:string = 'ProductivityToolSettings';

    protected ref:ChangeDetectorRef;

    constructor (ref:ChangeDetectorRef) {

        this.ref = ref;
        SettingsComponent.readUserSettingsData();

        setTimeout(() => {
            this.ref.markForCheck();
        }, 500);
    }

    public saveCheckedViewByChange (value:string) {

        SettingsComponent.checkedViewByValue = value;
        SettingsComponent.staticSaveUserSettings();
    }

    public getReminderDayValue(): number {
        return SettingsComponent.todoRemindDays;
    }

    public saveCheckedNotifyChange (name:string, numDays?:number) {

        if(name === 'breakNotifications') {
            SettingsComponent.showBreakNotifications = !SettingsComponent.showBreakNotifications;
        } else if(name === 'todoReminders') {
            SettingsComponent.todoReminders = !SettingsComponent.todoReminders;
        } else {
            SettingsComponent.todoRemindDays = numDays;
        }

        SettingsComponent.staticSaveUserSettings();
    }

    public saveCheckedViewPeriodChange(name:string, fromDate?:string, toDate?:string){

        let today:Date = new Date();

        if(name === 'today') {
            SettingsComponent.fromDate = today;
            SettingsComponent.toDate = today;
        } else if(name === 'week') {
            let firstDay = (today.getDate() - today.getDay());
            SettingsComponent.fromDate = new Date(today.getFullYear(), today.getMonth(), firstDay);
            SettingsComponent.toDate = new Date(today.getFullYear(), today.getMonth(), (firstDay + 6));
        } else if(name === 'month') {
            let firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            let lastDay = new Date(today.getFullYear(), (today.getMonth()+1), 0);
            SettingsComponent.fromDate = firstDay;
            SettingsComponent.toDate = lastDay;
        } else if(name === 'all') {
            SettingsComponent.fromDate = new Date();
            SettingsComponent.toDate = new Date();
        } else {
                SettingsComponent.fromDate = new Date(fromDate);
                SettingsComponent.toDate = new Date(toDate);
        }

        SettingsComponent.checkedPeriodValue = name;
        SettingsComponent.staticSaveUserSettings();
    }
    
    public amIcheckedViewByRadio (value:string) {
        return SettingsComponent.checkedViewByValue === value;
    }

    public amIcheckedNotifyCheckBox (value:string) {

        if (value === 'breakNotifications') {
            return SettingsComponent.showBreakNotifications;
        } else {
            return SettingsComponent.todoReminders;
        }
    }

    public amIcheckedViewPeriodRadio(value:string){
        return SettingsComponent.checkedPeriodValue === value;
    }

    public static readUserSettingsData () {

        storage.has(this.userSettingsFileName, function (error, hasKey) {

            if (error)
                throw error;

            if (hasKey) {
                storage.get(this.userSettingsFileName, function (error, data) {

                    if (error)
                        throw error;

                    let dataObj = engine.decrypt(data);
                    // let dataObj = JSON.parse(data);

                    if (dataObj.showBreakNotifications != undefined) {
                        this.staticSetShowBreakNotifications(dataObj.showBreakNotifications);
                    } else {
                        this.staticSetShowBreakNotifications(true);
                    }
                    
                    if (dataObj.todoReminders != undefined) {
                        this.staticSetTodoReminders(dataObj.todoReminders);
                    } else {
                        this.staticSetTodoReminders(true);
                    }

                    if (dataObj.todoRemindDays != undefined) {
                        this.staticSetTodoReminderDays(dataObj.todoRemindDays);
                    } else {
                        this.staticSetTodoReminderDays(3);
                    }

                    if (dataObj.checkedViewByValue != undefined) {
                        this.staticSetCheckedViewByValue(dataObj.checkedViewByValue);
                    } else {
                        this.staticSetCheckedViewByValue("dueDate");
                    }

                    if (dataObj.checkedPeriodValue != undefined) {
                        this.staticSetCheckedPeriodValue(dataObj.checkedPeriodValue);
                    } else {
                        this.staticSetCheckedPeriodValue("all");
                    }

                    if (dataObj.fromDate != undefined && dataObj.toDate != undefined) {
                        this.staticSetToDate(dataObj.toDate);
                        this.staticSetFromDate(dataObj.fromDate);
                    } else {
                        this.staticSetToDate(new Date());
                        this.staticSetFromDate(new Date());
                    }

                    if (dataObj.savedFromDate != undefined && dataObj.savedToDate != undefined) {
                        this.staticSetSavedFromDate(dataObj.savedFromDate);
                        this.staticSetSavedToDate(dataObj.savedToDate);
                    } else {
                        this.staticSetSavedToDate(new Date());
                        this.staticSetSavedFromDate(new Date());
                    }

                    if (dataObj.workAmount != undefined) {
                        Notification.setWorkTimeAmount(dataObj.workAmount);
                    } else {
                        Notification.setWorkTimeAmount(25);
                    }

                    if (dataObj.breakAmount != undefined) {
                        Notification.setBreakTimeAmount(dataObj.breakAmount);
                    } else {
                        Notification.setBreakTimeAmount(15);
                    }

                    Notification.setLastBreakTime(new Date());

                }.bind(this));
            } else {
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
                Notification.setWorkTimeAmount(25);
                Notification.setBreakTimeAmount(15);
                Notification.setLastBreakTime(new Date());
            }
        }.bind(this));
    }

    public static staticSaveCheckedViewPeriodChange(name:string, fromDate?:string, toDate?:string){

        let today:Date = new Date();

        SettingsComponent.checkedPeriodValue = name;

        if(name === 'today') {
            SettingsComponent.fromDate = today;
            SettingsComponent.toDate = today;
        } else if(name === 'week') {
            today.setDate(today.getDate()+1);
            let firstDay = (today.getDate() - today.getDay());
            SettingsComponent.fromDate = new Date(today.getFullYear(), today.getMonth(), firstDay);
            SettingsComponent.toDate = new Date(today.getFullYear(), today.getMonth(), (firstDay + 6));
        } else if(name === 'month') {
            let firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            let lastDay = new Date(today.getFullYear(), (today.getMonth()+1), 0);
            SettingsComponent.fromDate = firstDay;
            SettingsComponent.toDate = lastDay;
        } else if(name === 'all') {
            SettingsComponent.fromDate = new Date();
            SettingsComponent.toDate = new Date();
        } else {
            SettingsComponent.fromDate = new Date(fromDate);
            SettingsComponent.toDate = new Date(toDate);
        }

        SettingsComponent.staticSaveUserSettings();
    }

    public static staticSetTodoReminderDays (value:number){

        SettingsComponent.todoRemindDays = value;
        SettingsComponent.staticSaveUserSettings();
    }

    public static staticSetToDate(value:Date){

        SettingsComponent.toDate = value;
        SettingsComponent.staticSaveUserSettings();
    }

    public static staticSetSavedToDate(value:Date){

        SettingsComponent.savedToDate = value;
        SettingsComponent.staticSaveUserSettings();
    }

    public static staticSetFromDate(value:Date){

        SettingsComponent.fromDate = value;
        SettingsComponent.staticSaveUserSettings();
    }

    public static staticSetSavedFromDate(value:Date){

        SettingsComponent.savedFromDate = value;
        SettingsComponent.staticSaveUserSettings();
    }

    public static staticSetCheckedViewByValue (value:string) {

        SettingsComponent.checkedViewByValue = value;
        SettingsComponent.staticSaveUserSettings();
    }

    public static staticSetShowBreakNotifications (value:boolean) {

        this.showBreakNotifications = value;
        SettingsComponent.staticSaveUserSettings();
    }

    public static staticSetCheckedPeriodValue (value:string){

        SettingsComponent.checkedPeriodValue = value;
        SettingsComponent.staticSaveUserSettings();
    }

    public static staticSetTodoReminders (value:boolean) {

        this.todoReminders = value;
        SettingsComponent.staticSaveUserSettings();
    }

    public getWorkAmount(){
        return Notification.workTimeAmount;
    }

    public getBreakAmount(){
        return Notification.breakTimeAmount;
    }

    public saveWorkAmount(value:string){

        Notification.setWorkTimeAmount(+value);
        SettingsComponent.staticSaveUserSettings();
    }

    public saveBreakAmount(value:string){

        Notification.setBreakTimeAmount(+value);
        SettingsComponent.staticSaveUserSettings();
    }

    protected static staticSaveUserSettings ():void {

        let jsonObj:Object = {
            'checkedViewByValue':SettingsComponent.checkedViewByValue,
            'showBreakNotifications':SettingsComponent.showBreakNotifications,
            'todoReminders':SettingsComponent.todoReminders,
            'todoRemindDays':SettingsComponent.todoRemindDays,
            'checkedPeriodValue':SettingsComponent.checkedPeriodValue,
            'toDate':SettingsComponent.toDate,
            'fromDate':SettingsComponent.fromDate,
            'workAmount':Notification.workTimeAmount,
            'breakAmount':Notification.breakTimeAmount,
            'savedToDate':SettingsComponent.savedToDate,
            'savedFromDate':SettingsComponent.savedFromDate,
        };

        // console.log(SettingsComponent.checkedViewByValue != undefined,
        //     SettingsComponent.showBreakNotifications != undefined ,
        //     SettingsComponent.todoRemindDays != undefined ,
        //     SettingsComponent.todoReminders != undefined ,
        //     SettingsComponent.checkedPeriodValue != undefined ,
        //     Notification.breakTimeAmount != undefined ,
        //     Notification.workTimeAmount != undefined ,
        //     SettingsComponent.toDate != undefined ,
        //     SettingsComponent.fromDate != undefined ,
        //     SettingsComponent.savedToDate != undefined ,
        //     SettingsComponent.savedFromDate != undefined)
        if (SettingsComponent.checkedViewByValue != undefined &&
            SettingsComponent.showBreakNotifications != undefined &&
            SettingsComponent.todoRemindDays != undefined &&
            SettingsComponent.todoReminders != undefined &&
            SettingsComponent.checkedPeriodValue != undefined &&
            Notification.breakTimeAmount != undefined &&
            Notification.workTimeAmount != undefined &&
            SettingsComponent.toDate != undefined &&
            SettingsComponent.fromDate != undefined &&
            SettingsComponent.savedToDate != undefined &&
            SettingsComponent.savedFromDate != undefined
        ) {

            // let jsonStr:string = JSON.stringify(jsonObj);
            let jsonStr = engine.encrypt(jsonObj);

            storage.set(this.userSettingsFileName, jsonStr, function (error) {
                if (error)
                    throw error;
            });
        }
    }

    public getToDate(){

        let tempDate:Date;

        if(SettingsComponent.savedToDate != undefined) {
            tempDate = new Date(SettingsComponent.savedToDate.toString());
        } else {
            tempDate = new Date();
        }

        let mm:number = tempDate.getMonth() + 1;
        let strMM:string = mm.toString();

        if(strMM.length === 1){
            strMM = "0" + strMM
        }

        let dd = tempDate.getDate();
        let strDD = dd.toString();

        if(strDD.length === 1){
            strDD = "0" + strDD;
        }

        let tempToDate:string = tempDate.getFullYear() + "-" + strMM + "-" + strDD;
        return tempToDate;
    }

    public getFromDate(){

        let tempDate:Date;

        if(SettingsComponent.savedFromDate) {
           tempDate = new Date(SettingsComponent.savedFromDate.toString());
        } else {
            tempDate = new Date();
        }

        let mm:number = tempDate.getMonth() + 1;
        let strMM:string = mm.toString();

        if(strMM.length === 1){
            strMM = "0" + strMM
        }

        let dd = tempDate.getDate();
        let strDD = dd.toString();

        if(strDD.length === 1){
            strDD = "0" + strDD;
        }

        let tempFromDate:string = tempDate.getFullYear() + "-" + strMM + "-" + strDD;
        return tempFromDate;
    }

    public saveToDate(value:string){

        SettingsComponent.staticSetToDate(new Date(value));
        SettingsComponent.staticSetSavedToDate(new Date(value));
    }

    public saveFromDate(value:string){

        let tempFrom:Date = new Date(value);
        tempFrom.setDate(tempFrom.getDate()-1);
        SettingsComponent.staticSetFromDate(tempFrom);
        SettingsComponent.staticSetSavedFromDate(new Date(value));
    }

    public setShowBreakNotifications (value:boolean) {
        SettingsComponent.staticSetShowBreakNotifications(value);
    }

    public setTodoReminders (value:boolean) {
        SettingsComponent.staticSetTodoReminders(value);
    }
}