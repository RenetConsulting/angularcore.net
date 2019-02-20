import { HttpErrorResponse } from '@angular/common/http';
import { MessageHandlerService } from '../../services/message-handler/message-handler.service';
import { InputsErrorsBase } from './inputs-errors';

describe('InputsErrorsBase', () => {

    let base: InputsErrorsBase<{}>;

    let mockMessageHandlerService: MessageHandlerService;

    beforeEach(() => {
        mockMessageHandlerService = { handleError: jasmine.createSpy() as any } as MessageHandlerService;
        base = new InputsErrorsBase(mockMessageHandlerService);
    });

    it('base.handleError should call the method MessageHandlerService.handleError', () => {
        const error_description = 'Bob';
        base.handleError({ error: { error_description}} as HttpErrorResponse);
        expect(mockMessageHandlerService.handleError).toHaveBeenCalled();
    });
    it('base.handleError should not call the method MessageHandlerService.handleError', () => {
        const error_bla_bla_bla = 'Bob';
        base.handleError({ error: { error_bla_bla_bla } } as HttpErrorResponse);
        expect(mockMessageHandlerService.handleError).not.toHaveBeenCalled();
    });
});
