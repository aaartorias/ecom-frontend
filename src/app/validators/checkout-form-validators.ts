import { FormControl, ValidationErrors } from "@angular/forms";


export class CheckoutFormValidators {
    static onlyWhiteSpace(control : FormControl) : ValidationErrors | null {
        // TODO: access min length and check against that value instead of 0
        if (control.value != null && control.value.trim().length == 0) {
            return {'onlyWhiteSpace': true};
        }
        return null;
    }
}
 