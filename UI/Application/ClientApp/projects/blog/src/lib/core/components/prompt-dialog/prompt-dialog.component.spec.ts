import { PromptDialogComponent } from './prompt-dialog.component';

describe('PromptDialogComponent', () => {

    let component: PromptDialogComponent;

    beforeEach(() => {
        component = new PromptDialogComponent();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('content', () => {
        expect(component.content).toBeDefined();
    });
    it('content', () => {
        spyOn(component.content, 'next');
        const value = '1223';
        component.setContent(value);
        expect(component.content.next).toHaveBeenCalled();
    });
});
