import {Pipe, Injectable, PipeTransform} from "@angular/core";
import {noteType} from '../components/note';

@Pipe({
    name: 'showNotes',
    pure: false
})
@Injectable()
export class ShowNotesPipe implements PipeTransform {
    transform(notes: noteType[], arg: noteType): noteType[] {

        if (!notes || notes.length === 0) return [];
        return notes.filter(note => (note.completed === arg.completed && note.saved === arg.saved));
    }
}

@Pipe({
    name: 'showNewNote',
    pure: false
})
@Injectable()
export class ShowNewNotePipe implements PipeTransform {
    transform(notes: noteType[]): noteType[] {

        if (!notes || notes.length === 0) return [];
        return notes.filter(note => (note.saved === false));
    }
}