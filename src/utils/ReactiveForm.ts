/* eslint-disable @typescript-eslint/ban-types */
export class ReactiveFormControl {
  constructor(public value: any, private validators: Function[] = []) {}

  public errors: any[] = [];

  //  Clears the form control
  public reset() {
    this.value = null;
    this.errors = [];
  }

  //  Runs the validators
  public validate() {
    this.errors = [];

    if (!this.validators || !this.validators.length) return;

    this.validators.forEach((validator) => {
      const error = validator.call(this, this.value);

      if (!error) {
        if (!this.errors) this.errors = [];
        this.errors.push(error);
      }
    });
  }
}

export default class ReactiveForm {
  public controls: ReactiveFormControl[] = [];

  public get errors() {
    const retval: Object = {};

    for (const key in this.controls) {
      if (this.controls[key].errors.length) {
        Object.assign(retval, {
          key: this.controls[key].errors,
        });
      }
    }

    return retval;
  }

  public get hasErrors() {
    let retval = 0;

    for (const key in this.controls) {
      if (this.controls[key].errors.length) {
        retval += this.controls[key].errors.length;
      }
    }

    return retval;
  }

  public get formData(): FormData {
    const retval = new FormData();

    for (const key in this.controls) {
      retval.append(key, this.controls[key].value || null);
    }

    return retval;
  }

  //  Runs all validators on every form control
  public validate() {
    for (const key in this.controls) {
      this.controls[key].validate();
    }
  }
}
