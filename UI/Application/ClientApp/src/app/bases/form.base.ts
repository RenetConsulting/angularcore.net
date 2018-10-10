import { FormControl, FormGroup } from "@angular/forms";
import { ApplicationBase } from "./application.base";

export class FormBase extends ApplicationBase {

    public itemForm: FormGroup = null;

    constructor() {
        super();
    }

    public setFormControl = <I>(key: keyof I & string, formControl: FormControl): void => {
        if (!(this.itemForm instanceof FormGroup)) {
            this.itemForm = new FormGroup({ [key]: formControl });
        }
        else if (key != null && formControl != null) {
            this.itemForm.setControl(key, formControl);
        }
    }
}
