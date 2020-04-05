import { AbstractControl } from '@angular/forms'

export class FieldValidators {

    static cannotContainSpace(control: AbstractControl) {
        if ((control.value as string).indexOf(' ') !== -1) {
            return { cannotContainSpace: true }
        }
        return null
    }

    // This is not used
    // because it invalidates the form while the field is validated !
    static isEmail(control: AbstractControl) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(control.value as string)) {
            console.log('Email')
            return { isEmail: true }
        }
        console.log('Not email')
        return null
    }

}
