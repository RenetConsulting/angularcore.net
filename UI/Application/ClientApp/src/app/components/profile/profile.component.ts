import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IPerson } from '~/interfaces/person';
import { RootStore } from '~/reducers';
import { GetProfileRequest, UpdateProfileRequest } from './actions';
import { selectProfile } from './selectors';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit, OnDestroy {

    readonly subscription = new Subscription();
    formGroup: FormGroup;

    constructor(
        @Inject(Store) private store: Store<RootStore>
    ) { }

    ngOnInit() {
        this.setFormGroup();
        this.subscription.add(this.store.select(selectProfile).pipe(filter(i => !!i)).subscribe(this.patchValue));
        this.store.dispatch(new GetProfileRequest());
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    /** TODO: add a phone validator */
    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.email]),
            phone: new FormControl('', [Validators.required]),
            address: new FormControl(),
            zipCode: new FormControl(),
            city: new FormControl(),
            region: new FormControl(),
            country: new FormControl(),
        } as MapPick<IPerson, keyof IPerson, FormControl>);
    }

    patchValue = (i: IPerson): void => this.formGroup.patchValue(i);

    submit = (): void => {
        if (this.formGroup.valid) {
            this.store.dispatch(new UpdateProfileRequest(this.formGroup));
        }
    }
}
