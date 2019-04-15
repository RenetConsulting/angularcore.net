import { CoreCaptchaAudioComponent } from './core-captcha-audio.component';

fdescribe('CoreCaptchaAudioComponent', () => {

    let component: CoreCaptchaAudioComponent;
    const sound = 'data:audio/mp3;base64,//NExAAAAAJbIUAAAAAAxeJRYNBY';
    let audio: jasmine.SpyObj<HTMLAudioElement>;

    beforeEach(() => {
        component = new CoreCaptchaAudioComponent();
        audio = jasmine.createSpyObj<HTMLAudioElement>('Audio', ['play', 'pause']);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('ngOnChanges', () => {
        spyOn(component, 'pause');
        spyOn(component, 'setAudio');
        component.ngOnChanges();
        expect(component.pause).toHaveBeenCalled();
        expect(component.setAudio).toHaveBeenCalled();
    })
    it('ngOnDestroy', () => {
        spyOn(component, 'pause');
        component.ngOnDestroy();
        expect(component.pause).toHaveBeenCalled();
    })
    it('paused', () => {
        component.sound = sound;
        component.setAudio();
        expect(component.paused).toEqual(true);
    })
    it('play', () => {
        component.audio = audio
        component.play();
        expect(audio.play).toHaveBeenCalled();
    })
    it('play', () => {
        component.audio = audio
        component.pause();
        expect(audio.pause).toHaveBeenCalled();
    })
    describe('toggle', () => {
        it('paused is true', () => {
            Object.defineProperty(component, 'paused', { get: () => true });
            spyOn(component, 'play');
            component.toggle();
            expect(component.play).toHaveBeenCalled();
        })
        it('paused is false', () => {
            Object.defineProperty(component, 'paused', { get: () => false });
            spyOn(component, 'pause');
            component.toggle();
            expect(component.pause).toHaveBeenCalled();
        })
    })
});
