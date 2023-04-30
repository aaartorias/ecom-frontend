import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutFormService } from 'src/app/services/checkout-form.service';
import { CheckoutFormValidators } from 'src/app/validators/checkout-form-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})

export class CheckoutComponent implements OnInit{

  checkoutFormGroup!: FormGroup;
  totalQuantity: number = 0;
  totalPrice: number = 0;
  
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  disableBillingAddress: boolean = false;

  constructor(private formBuilder: FormBuilder, 
              private checkoutFormService: CheckoutFormService,
              private cartService: CartService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      
      customer: this.formBuilder.group({

        firstName: new FormControl('',
                                  [Validators.required, 
                                  Validators.minLength(2), 
                                  CheckoutFormValidators.onlyWhiteSpace]),

        lastName: new FormControl('', 
                                  [Validators.required, 
                                  Validators.minLength(2), 
                                  CheckoutFormValidators.onlyWhiteSpace]),

        email: new FormControl('', 
                              [Validators.required, 
                              Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),

      shippingAddress: this.formBuilder.group({

        street: new FormControl('',
                                [Validators.required, 
                                Validators.minLength(2), 
                                CheckoutFormValidators.onlyWhiteSpace]),

        city: new FormControl('',
                              [Validators.required, 
                              Validators.minLength(2), 
                              CheckoutFormValidators.onlyWhiteSpace]),

        state: new FormControl('', [Validators.required]),

        country: new FormControl('', [Validators.required]),

        zipCode: new FormControl('',
                                [Validators.required, 
                                Validators.minLength(2), 
                                CheckoutFormValidators.onlyWhiteSpace])
      }),

      billingAddress: this.formBuilder.group({
        street: new FormControl('',
                                [Validators.required, 
                                Validators.minLength(2), 
                                CheckoutFormValidators.onlyWhiteSpace]),

        city: new FormControl('',
                              [Validators.required, 
                              Validators.minLength(2), 
                              CheckoutFormValidators.onlyWhiteSpace]),

        state: new FormControl('', [Validators.required]),

        country: new FormControl('', [Validators.required]),

        zipCode: new FormControl('',
                                [Validators.required, 
                                Validators.minLength(2), 
                                CheckoutFormValidators.onlyWhiteSpace])
      }),

      creditCard: this.formBuilder.group({

        cardType: new FormControl('', [Validators.required]),

        nameOnCard: new FormControl('',
                                [Validators.required, 
                                Validators.minLength(2), 
                                CheckoutFormValidators.onlyWhiteSpace]),

        cardNumber: new FormControl('',
                                [Validators.required, 
                                Validators.pattern('[0-9]{16}')]),

        securityCode: new FormControl('',
                                [Validators.required, 
                                Validators.pattern('[0-9]{3}')]),

        expirationMonth: new FormControl('', [Validators.required]),

        expirationYear: new FormControl('', [Validators.required])

      })
    });

    const startMonth: number = new Date().getMonth() + 1;

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    this.checkoutFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    this.checkoutFormService.getCountries().subscribe(
      data => this.countries = data
    );

    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );
    
  }

  placeOrder() {
    console.log(this.checkoutFormGroup?.get('customer')?.value);
    if (this.checkoutFormGroup.invalid) {
      console.log("handling the submit button - error");

      this.checkoutFormGroup.markAllAsTouched();
    } else {
      console.log("handling the submit button");
    }
  }

  // customer details

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  // shipping address

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street')
  }

  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city')
  }

  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state')
  }

  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country')
  }

  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode')
  }

  // billing address
  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street')
  }

  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city')
  }

  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state')
  }

  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country')
  }

  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode')
  }

  // credit card details

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType')
  }
  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard')
  }
  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber')
  }
  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode')
  }
  get creditCardExpirationMonth() {
    return this.checkoutFormGroup.get('creditCard.expirationMonth')
  }
  get creditCardExpirationYear() {
    return this.checkoutFormGroup.get('creditCard.expirationYear')
  }


  

  copyShippingAddressToBillingAddress(event: any) {

    if (event?.target?.checked) {
      this.checkoutFormGroup.controls['billingAddress']
          .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      this.billingAddressStates = this.shippingAddressStates;
      this.disableBillingAddress = true;
      this.checkoutFormGroup.controls['billingAddress'].disable();
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
      this.disableBillingAddress = false;
      this.checkoutFormGroup.controls['billingAddress'].enable();
    }

  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);
    
    let startMonth: number;

    if (currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1; // +1 because js uses 0 based ids for months
    } else {
      startMonth = 1;
    }

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );

  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    
    this.checkoutFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }

}
