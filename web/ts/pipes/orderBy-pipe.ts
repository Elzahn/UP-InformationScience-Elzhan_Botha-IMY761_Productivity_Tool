import {Pipe, Injectable, PipeTransform} from "@angular/core";
import {SettingsComponent} from '../components/settings-component';
import {todoType} from '../components/todo';

@Pipe({
    name:'orderBy', pure:false
})

@Injectable()
export class OrderByPipe implements PipeTransform {
    transform (todos:todoType[]):todoType[] {

        if (SettingsComponent.checkedViewByValue != 'custom') {
           return todos.sort((todoA:todoType, todoB:todoType) => {
                let tempADay:string = (todoA.dueDate).substr(0, 2);
                let tempAMonth:string = (todoA.dueDate).substr(3, 2);
                let tempAYear:string = (todoA.dueDate).substr(6, 4);
                let tempADate:string = tempAMonth + "/" + tempADay + "/" + tempAYear;

                let tempBDay:string = (todoB.dueDate).substr(0, 2);
                let tempBMonth:string = (todoB.dueDate).substr(3, 2);
                let tempBYear:string = (todoB.dueDate).substr(6, 4);
                let tempBDate:string = tempBMonth + "/" + tempBDay + "/" + tempBYear;

                let tempTodoA = new Date(tempADate);
                let tempTodoB = new Date(tempBDate);

                if (tempTodoA < tempTodoB) {
                    return -1;
                } else if (tempTodoA > tempTodoB) {
                    return 1;
                } else {
                    return 0;
                }
            });
        } else {
            return todos;
        }
    }
}