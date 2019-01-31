import { FormControl, FormGroup } from "@angular/forms";
import { ApplicationBase } from "./application.base";

export class FormBase extends ApplicationBase {

    itemForm: FormGroup;

    constructor() {
        super();
    }

    setFormControl = <I>(key: keyof I & string, formControl: FormControl): void => {
        if (!(this.itemForm instanceof FormGroup)) {
            this.itemForm = new FormGroup({ [key]: formControl });
        }
        else if (key && formControl) {
            this.itemForm.setControl(key, formControl);
        }
    }
}
