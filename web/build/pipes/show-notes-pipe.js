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
var core_1 = require("@angular/core");
var ShowNotesPipe = (function () {
    function ShowNotesPipe() {
    }
    ShowNotesPipe.prototype.transform = function (notes, arg) {
        if (!notes || notes.length === 0)
            return [];
        return notes.filter(function (note) { return (note.completed === arg.completed && note.saved === arg.saved); });
    };
    ShowNotesPipe = __decorate([
        core_1.Pipe({
            name: 'showNotes',
            pure: false
        }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ShowNotesPipe);
    return ShowNotesPipe;
}());
exports.ShowNotesPipe = ShowNotesPipe;
var ShowNewNotePipe = (function () {
    function ShowNewNotePipe() {
    }
    ShowNewNotePipe.prototype.transform = function (notes) {
        if (!notes || notes.length === 0)
            return [];
        return notes.filter(function (note) { return (note.saved === false); });
    };
    ShowNewNotePipe = __decorate([
        core_1.Pipe({
            name: 'showNewNote',
            pure: false
        }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ShowNewNotePipe);
    return ShowNewNotePipe;
}());
exports.ShowNewNotePipe = ShowNewNotePipe;
//# sourceMappingURL=show-notes-pipe.js.map