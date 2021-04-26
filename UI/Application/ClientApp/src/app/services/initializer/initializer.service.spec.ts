import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { SetSettings } from '~/actions/settings.actions';
import { ISettings } from '~/interfaces/settings';
import { RootStore } from '~/reducers';
import { SettingsService } from '../settings/settings.service';
import { InitializerService } from './initializer.service';

describe('InitializerService', () => {

    let service: InitializerService;

    let settingsService: jasmine.SpyObj<SettingsService>;
    let store: jasmine.SpyObj<Store<RootStore>>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: SettingsService, useValue: jasmine.createSpyObj<SettingsService>('SettingsService', ['get']) },
                { provide: Store, useValue: jasmine.createSpyObj<Store<RootStore>>('Store', ['dispatch']) },
            ]
        });

        service = TestBed.inject(InitializerService);
        settingsService = TestBed.inject(SettingsService as any);
        store = TestBed.inject(Store as any);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('initialize', () => {
        const settings = {} as ISettings;
        settingsService.get.and.returnValue(of(settings));
        service.initialize();
        expect(settingsService.get).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith(new SetSettings(settings));
    });
});
