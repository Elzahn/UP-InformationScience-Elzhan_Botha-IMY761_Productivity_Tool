import {Pipe, Injectable, PipeTransform} from "@angular/core";
import {todoType} from '../components/todo';
import {noteType} from '../components/note';

@Pipe({
    name: 'showActiveTodos',
    pure: false
})
@Injectable()
export class showActiveTodosPipe implements PipeTransform {
    transform(todos: todoType[], arg: todoType): todoType[] {

        if (todos.length === 0 || !todos) return [];
            return todos.filter(todo => (todo.saved === arg.saved && !todo.completed));
    }
}

@Pipe({
    name: 'showCompletedTodos',
    pure: false
})
@Injectable()
export class showCompletedTodosPipe implements PipeTransform {
    transform(todos: todoType[]): todoType[] {

        if (todos.length === 0 || !todos) return [];
            return todos.filter(todo => todo.completed);
    }
}

@Pipe({
    name: 'showNotes',
    pure: false
})
@Injectable()
export class showNotesPipe implements PipeTransform {
    transform(notes: noteType[], arg: noteType): noteType[] {

        if (notes.length === 0 || !notes) return [];
        return notes.filter(note => (note.completed === arg.completed));
    }
}