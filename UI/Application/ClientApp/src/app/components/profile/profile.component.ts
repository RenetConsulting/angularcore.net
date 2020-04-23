import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { phoneUSRegExp, phoneValidator } from '@renet-consulting/ngx-validator';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MaxLength } from '~/enums/max-length.type';
import { IPerson } from '~/interfaces/person';
import { RootStore } from '~/reducers';
import { GetProfileRequest, UpdateProfileRequest } from './actions';
import { selectProfile } from './selectors';
import { MapPick } from '../../../../src/typings'

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

    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            firstName: new FormControl('', [Validators.required, Validators.maxLength(MaxLength.l250)]),
            lastName: new FormControl('', [Validators.required, Validators.maxLength(MaxLength.l250)]),
            email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(MaxLength.l150)]),
            phone: new FormControl('', [Validators.required, Validators.maxLength(MaxLength.l12), phoneValidator(phoneUSRegExp)]),
            address: new FormControl('', [Validators.maxLength(MaxLength.l150)]),
            zipCode: new FormControl('', [Validators.maxLength(MaxLength.l10)]),
            city: new FormControl('', [Validators.maxLength(MaxLength.l100)]),
            region: new FormControl('', [Validators.maxLength(MaxLength.l100)]),
            country: new FormControl('', [Validators.maxLength(MaxLength.l100)]),
        } as MapPick<IPerson, keyof IPerson, FormControl>);
    }

    patchValue = (i: IPerson): void => this.formGroup.patchValue(i);

    submit = (): void => {
        if (this.formGroup.valid) {
            this.store.dispatch(new UpdateProfileRequest(this.formGroup));
        }
    }
}
