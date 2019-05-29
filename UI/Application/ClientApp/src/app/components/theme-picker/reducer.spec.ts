import { SetTheme } from './actions';
import { themeReducer } from './reducer';
import { ITheme } from './theme';

describe('themeReducer', () => {

    it('SET_THEME', () => {
        const selected = {} as ITheme;
        expect(themeReducer({ items: [] }, new SetTheme(selected))).toEqual({ items: [], selected });
    });
    it('default', () => {
        expect(themeReducer({ items: [] }, { type: null } as any)).toEqual({ items: [] });
    });
});