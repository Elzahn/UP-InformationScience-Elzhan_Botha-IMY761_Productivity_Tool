/// <reference path="../typings/index.d.ts" />

import {bootstrap} from '@angular/platform-browser-dynamic';
import {MainComponent} from './components/main-component';
import {APP_ROUTER_PROVIDERS} from './routes';

bootstrap(MainComponent, [APP_ROUTER_PROVIDERS]);