import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Data } from '@angular/router';
import { DEFAULT_TITLE_TOKEN } from './default-title.token';
import { TitleStrategyService } from './title-strategy.service';

describe('TitleStrategyService', () => {

    let service: TitleStrategyService;

    let titleService: jasmine.SpyObj<Title>;
    const defaultTitle = 'def';

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                { provide: Title, useValue: jasmine.createSpyObj<Title>('Title', ['setTitle']) },
                { provide: DEFAULT_TITLE_TOKEN, useValue: defaultTitle },
            ]
        });

        service = TestBed.get(TitleStrategyService);
        titleService = TestBed.get(Title);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('set', () => {

        it('should call with title from Data', () => {
            const title = 'title';
            const data = { title } as Data;
            service.set(data);
            expect(titleService.setTitle).toHaveBeenCalledWith(title);
        });
        it('should call with title from DEFAULT_TITLE_TOKEN', () => {
            const title = '';
            const data = { title } as Data;
            service.set(data);
            expect(titleService.setTitle).toHaveBeenCalledWith(defaultTitle);
        });
    });
});
