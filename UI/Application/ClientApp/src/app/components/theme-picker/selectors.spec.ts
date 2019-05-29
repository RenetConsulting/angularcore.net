import { ThemeState } from './reducer';
import { selectSelectedTheme, selectThemes } from './selectors';
import { ITheme } from './theme';

describe('theme selectors', () => {

    it('selectSelectedTheme', () => {
        const selected = {} as ITheme;
        expect(selectSelectedTheme({ theme: { selected } as ThemeState })).toEqual(selected);
    });
    it('selectThemes', () => {
        const items = [];
        expect(selectThemes({ theme: { items } })).toEqual(items);
    });
});