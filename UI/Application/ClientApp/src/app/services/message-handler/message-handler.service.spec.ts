import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { MessageHandlerService } from './message-handler.service';

describe('MessageHandlerService', () => {

    let service: MessageHandlerService;

    beforeEach(() => {
        service = TestBed.get(MessageHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('errorMessage500 should be equal', () => {
        expect(service.errorMessage500).toEqual('Oops something went wrong! :[');
    });
    it('errorSubject instanceof Subject', () => {
        expect(service.errorSubject instanceof Subject).toEqual(true);
    });
    it('successSubject instanceof Subject', () => {
        expect(service.successSubject instanceof Subject).toEqual(true);
    });
    it('handleError should call next', () => {
        spyOn(service.errorSubject, 'next');
        service.handleError('');
        expect(service.errorSubject.next).toHaveBeenCalledWith(service.errorMessage500);
    });
    describe('handleError', () => {
        it('should call next with errorMessage500', () => {
            spyOn(service.errorSubject, 'next');
            service.handleError('');
            expect(service.errorSubject.next).toHaveBeenCalledWith(service.errorMessage500);
        });
        it('should call next with value', () => {
            spyOn(service.errorSubject, 'next');
            const value = 'Bob';
            service.handleError(value);
            expect(service.errorSubject.next).toHaveBeenCalledWith(value);
        });
    });
    it('handleSuccess call next with value', () => {
        spyOn(service.successSubject, 'next');
        const value = 'Bob';
        service.handleSuccess(value);
        expect(service.successSubject.next).toHaveBeenCalledWith(value);
    });
});
