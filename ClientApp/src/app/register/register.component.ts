import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { AccountService } from '../services/account.service'
import { CrossFieldValidators } from './crossfield-validators'
import { FieldValidators } from './username-validators'

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {

    //#region Init
    form: FormGroup
    errorList: string[] = []

    //#endregion Init

    constructor(private formBuilder: FormBuilder, private accountService: AccountService, private router: Router) {

    }

    ngOnInit() {
        this.initForm()
    }

    initForm() {
        this.form = this.formBuilder.group({
            username: ['', [Validators.required, Validators.maxLength(32), FieldValidators.cannotContainSpace]],
            displayName: ['', [Validators.required, Validators.maxLength(32)]],
            email: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
            passwords: this.formBuilder.group({
                password: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(128), FieldValidators.cannotContainSpace]],
                confirmPassword: ['', [Validators.required]],
            }, { validator: CrossFieldValidators.cannotBeDifferent })
        })
    }

    register() {
        const form = this.form.value
        this.accountService.register(form.username, form.displayName, form.passwords.password, form.passwords.confirmPassword, form.email).subscribe(() => {
            alert(`An email was sent to ${form.email} for account verification`)
            this.router.navigateByUrl('/login')
        }, error => {
            this.errorList = []
            error.error.response.forEach((element: string) => {
                this.errorList.push(element + '\n')
                console.log(element)
            })
            alert(this.errorList)
        })
    }

    get Username() {
        return this.form.get('username')
    }

    get DisplayName() {
        return this.form.get('displayName')
    }

    get Password() {
        return this.form.get('passwords.password')
    }

    get ConfirmPassword() {
        return this.form.get('passwords.confirmPassword')
    }

    get Passwords() {
        return this.form.get('passwords')
    }

    get Email() {
        return this.form.get('email')
    }

}
