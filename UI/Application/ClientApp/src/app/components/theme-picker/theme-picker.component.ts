import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxLinkStylesheetService } from '@renet-consulting/ngx-link-stylesheet';

export interface ITheme {
    primary?: string
    accent?: string
    name?: string
    isDark?: boolean,
    isDefault?: boolean
}

/** TODO: add save */
/** TODO: add ngrx */
/** TODO: move interface to a separate file */
@Component({
    selector: 'theme-picker',
    templateUrl: './theme-picker.component.html',
    styleUrls: ['./theme-picker.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [NgxLinkStylesheetService]
})
export class ThemePickerComponent implements OnInit {

    readonly cssClass = 'link-theme';
    readonly items: Array<ITheme> = [
        { name: 'default', isDefault: true, },
        { primary: '#673AB7', accent: '#FFC107', name: 'deeppurple-amber.theme', isDark: false, },
        { primary: '#9C27B0', accent: '#4CAF50', name: 'purple-green.theme', isDark: true, },
    ];
    selected: ITheme;

    constructor(
        @Inject(NgxLinkStylesheetService) private linkStylesheetService: NgxLinkStylesheetService
    ) { }

    ngOnInit(): void {
        this.setTheme(this.items.find(i => i.isDefault).name);
    }

    setTheme = (name: string): void => {
        const item = this.items.find(i => i.name === name);
        if (item) {
            this.selected = item;
            if (item.isDefault) {
                this.linkStylesheetService.deleteLink(this.cssClass);
            }
            else {
                this.linkStylesheetService.updateLink(this.cssClass, `assets/${item.name}.css`);
            }
        }
    }
}
