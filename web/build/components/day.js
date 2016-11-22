"use strict";
var newDay = (function () {
    function newDay(date, todo) {
        var tempTodoArr = new Array();
        if (todo)
            tempTodoArr.push(todo);
        this.date = date;
        this.todos = tempTodoArr;
    }
    return newDay;
}());
exports.newDay = newDay;
//# sourceMappingURL=day.js.map