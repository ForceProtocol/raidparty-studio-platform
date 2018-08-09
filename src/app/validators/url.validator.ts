import { AbstractControl } from '@angular/forms';

export function ValidateUrl(control: AbstractControl) {

  let linkRegex = new RegExp('^(|(http|https):\/\/[^ "]+$|www.[^ "]+$)$');

  if(!control.value){
    return null;
  }

  if(control.value.length == 0 || linkRegex.test(control.value)){
    return null;
  }

  return {invalidUrl:true};
}