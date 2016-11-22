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
var router_1 = require('@angular/router');
var NavigationComponent = (function () {
    function NavigationComponent() {
        this.isTodoActive = true;
    }
    NavigationComponent.prototype.toggleActive = function (variable) {
        switch (variable) {
            case 'isTodoActive': {
                this.isTodoActive = true;
                this.isCompletedActive = false;
                this.isNotesActive = false;
                this.isTimelineActive = false;
                this.isSettingsActive = false;
                break;
            }
            case 'isCompletedActive': {
                this.isTodoActive = false;
                this.isCompletedActive = true;
                this.isNotesActive = false;
                this.isTimelineActive = false;
                this.isSettingsActive = false;
                break;
            }
            case 'isNotesActive': {
                this.isTodoActive = false;
                this.isCompletedActive = false;
                this.isNotesActive = true;
                this.isTimelineActive = false;
                this.isSettingsActive = false;
                break;
            }
            case 'isTimelineActive': {
                this.isTodoActive = false;
                this.isCompletedActive = false;
                this.isNotesActive = false;
                this.isTimelineActive = true;
                this.isSettingsActive = false;
                break;
            }
            case 'isSettingsActive': {
                this.isTodoActive = false;
                this.isCompletedActive = false;
                this.isNotesActive = false;
                this.isTimelineActive = false;
                this.isSettingsActive = true;
                break;
            }
        }
    };
    NavigationComponent = __decorate([
        core_1.Component({
            selector: 'navBar',
            templateUrl: './views/navigation-component.html',
            directives: [router_1.ROUTER_DIRECTIVES],
            styleUrls: ['./css/navigation-component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], NavigationComponent);
    return NavigationComponent;
}());
exports.NavigationComponent = NavigationComponent;
//# sourceMappingURL=navigation-component.js.map