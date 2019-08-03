import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Data } from '@angular/router';
import { TitleStrategyService } from './title-strategy.service';

describe('TitleStrategyService', () => {

    let service: TitleStrategyService;

    let titleService: jasmine.SpyObj<Title>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [{ provide: Title, useValue: jasmine.createSpyObj<Title>('Title', ['setTitle']) }]
        });

        service = TestBed.get(TitleStrategyService);
        titleService = TestBed.get(Title);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('set', () => {
        const title = 'title';
        const data = { title } as Data;
        service.set(data);
        expect(titleService.setTitle).toHaveBeenCalledWith(title);
    });
});
