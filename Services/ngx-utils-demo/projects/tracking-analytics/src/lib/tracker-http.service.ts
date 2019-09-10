import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TrackerModel } from './tracker.model';

export abstract class NgxTrackerHttpService {

    abstract addTracker(model: TrackerModel): Observable<any>;
}

@Injectable({
    providedIn: 'root'
})
export class NgxTrackerHttpFakeService extends NgxTrackerHttpService {

    addTracker(x: TrackerModel): Observable<any> {
        return of({} || x);
    }
}
