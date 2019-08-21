import { BypassPipe } from './bypass.pipe';
import { BypassService } from './bypass.service';

describe('BypassPipe', () => {

    let pipe: BypassPipe;

    const value = '<p>bob</p>';
    let bypass: BypassService;

    beforeEach(() => {

        bypass = jasmine.createSpyObj<BypassService>('BypassService', ['map']);

        pipe = new BypassPipe(bypass);
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should call map', () => {
        pipe.transform(value);
        expect(bypass.map).toHaveBeenCalledWith(value, undefined);
    });
});
