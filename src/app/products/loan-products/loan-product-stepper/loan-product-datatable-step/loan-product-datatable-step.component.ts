import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Datatables } from 'app/core/utils/datatables';
import { SettingsService } from 'app/settings/settings.service';

@Component({
  selector: 'mifosx-loan-product-datatable-step',
  templateUrl: './loan-product-datatable-step.component.html',
  styleUrls: ['./loan-product-datatable-step.component.scss']
})
export class LoanProductDatatableStepComponent implements OnInit {
  /** Input Fields Data */
  @Input() datatableData: any;
  /** Create Input Form */
  datatableForm: FormGroup;

  datatableInputs: any = [];

  constructor(private formBuilder: FormBuilder,
    private settingsService: SettingsService,
    private datatableService: Datatables) { }

  ngOnInit(): void {
    this.datatableInputs = this.datatableService.filterSystemColumns(this.datatableData.columnHeaderData);
    const inputItems: any = {};
    this.datatableInputs.forEach((input: any) => {
      input.controlName = this.getInputName(input);
      if (!input.isColumnNullable) {
        if (this.isNumeric(input.columnDisplayType)) {
          inputItems[input.controlName] = new FormControl(0, [Validators.required]);
        } else {
          inputItems[input.controlName] = new FormControl('', [Validators.required]);
        }
      } else {
        inputItems[input.controlName] = new FormControl('');
      }
    });
    this.datatableForm = this.formBuilder.group(inputItems);
  }

  getInputName(datatableInput: any): string {
    return this.datatableService.getInputName(datatableInput);
  }

  isNumeric(columnType: string) {
    return this.datatableService.isNumeric(columnType);
  }

  isDate(columnType: string) {
    return this.datatableService.isDate(columnType);
  }

  isBoolean(columnType: string) {
    return this.datatableService.isBoolean(columnType);
  }

  isDropdown(columnType: string) {
    return this.datatableService.isDropdown(columnType);
  }

  isString(columnType: string) {
    return this.datatableService.isString(columnType);
  }

  isText(columnType: string) {
    return this.datatableService.isText(columnType);
  }

  get payload(): any {
    const dateFormat = this.settingsService.dateFormat;
    const datatableDataValues = this.datatableForm.value;

    const data = this.datatableService.buildPayload(this.datatableInputs, datatableDataValues, dateFormat,
      { locale: this.settingsService.language.code });

    return {
      registeredTableName: this.datatableData.registeredTableName,
      data: data
    };
  }

}
