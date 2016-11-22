import {Pipe, Injectable, PipeTransform} from "@angular/core";
import {todoType} from '../components/todo';
import {SettingsComponent} from '../components/settings-component';
import {TodosComponent} from '../components/todos-component';

@Pipe({
    name:'showActiveTodos', pure:false
}) @Injectable()
export class ShowActiveTodosPipe implements PipeTransform {
    transform (todos:todoType[], arg:todoType):todoType[] {

        if (!todos || todos.length === 0) return [];
        return todos.filter(todo => (todo.saved === arg.saved && !todo.completed));
    }
}

@Pipe({
    name:'showCompletedTodos', pure:false
}) @Injectable()
export class ShowCompletedTodosPipe implements PipeTransform {
    transform (todos:todoType[]):todoType[] {

        if (!todos || todos.length === 0) return [];
        return todos.filter(todo => todo.completed);
    }
}

@Pipe({
    name:'showInPeriod', pure:false
}) @Injectable()
export class ShowInPeriodPipe implements PipeTransform {
    transform (todos:todoType[]):todoType[] {

        TodosComponent.filteredTodosEmpty = false;
        TodosComponent.filteredBy = "Todos filtered by: " + SettingsComponent.checkedPeriodValue;

        if (!todos || todos.length === 0) return [];

        if (SettingsComponent.checkedPeriodValue != "all") {

            let toDate:Date = new Date(SettingsComponent.toDate.toString());
            let fromDate:Date = new Date(SettingsComponent.fromDate.toString());
            let todoDate:Date;

            let returnedTodo =  todos.filter(function (todo) {
                let tempDay:string = (todo.dueDate).substr(0, 2);
                let tempMonth:string = (todo.dueDate).substr(3, 2);
                let tempYear:string = (todo.dueDate).substr(6, 4);
                let tempDate:string = tempMonth + "/" + tempDay + "/" + tempYear;

                todoDate = new Date(tempDate);
                if (SettingsComponent.checkedPeriodValue == "today") {

                    TodosComponent.filteredMessage = "You have no todos for today";

                    if (todoDate.getDay() >= fromDate.getDay() && todoDate.getDay() <= toDate.getDay()) {
                        if (todoDate.getMonth() >= fromDate.getMonth() && todoDate.getMonth() <= toDate.getMonth()) {
                            if (todoDate.getFullYear() >= fromDate.getFullYear() && todoDate.getFullYear() <= toDate.getFullYear()) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                } else if (SettingsComponent.checkedPeriodValue == "month") {

                    TodosComponent.filteredMessage = "You have no todos for this month";

                    if (todoDate.getMonth() == fromDate.getMonth()) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (SettingsComponent.checkedPeriodValue == "week") {
                        TodosComponent.filteredMessage = "You have no todos for this week";
                    } else {
                        TodosComponent.filteredMessage = "You have no todos between " + StringManipulation.shortenDate(SettingsComponent.savedFromDate) + " and " + StringManipulation.shortenDate(SettingsComponent.savedToDate);
                    }
                    return (todoDate >= fromDate && todoDate <= toDate);
                }
            });

            if(returnedTodo.length === 0)
                TodosComponent.filteredTodosEmpty = true;

            return returnedTodo;
        } else {
            return todos;
        }
    }


}

class StringManipulation {
    public static shortenDate (value:string|Date) {

        let date = new Date(value.toString());

        let mm:number = date.getMonth() + 1;
        let strMM:string = mm.toString();

        if (strMM.length === 1) {
            strMM = "0" + strMM
        }

        let dd = date.getDate();
        let strDD = dd.toString();

        if (strDD.length === 1) {
            strDD = "0" + strDD;
        }

        let tempDate = strDD + "/" + strMM + "/" + date.getFullYear();
        return tempDate;
    }
}