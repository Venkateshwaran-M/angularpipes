import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
declare var Stripe:any
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pipes';
  birthday = new Date(2024, 3, 15);
  toggle = true;

  get format()   { return this.toggle ? 'mediumDate' : 'fullDate'; }

  toggleFormat() { this.toggle = !this.toggle; }
  public stripe:any
  public elements:any
constructor(private http:HttpClient,){
  this.stripePayment()
}
  stripePayment() {
    let serviceURl = 'http://localhost:4000/createPaymentIntent'
    let orderOptions = {
      amount: 5000,
      currency: 'INR'
    }
    this.http.post(serviceURl, orderOptions).subscribe((response: any) => {
      this.stripe = Stripe(atob(response['publishable_key']))
      console.log(response)
      const appearance = {
        theme: 'stripe',
      };
      const options = {
        mode: 'shipping'
      };
      this.elements = this.stripe.elements({ appearance, clientSecret: response['client_secret'] });
      const paymentElementOptions = {
        layout: "accordion",
      };
      // setTimeout(() => {
      const paymentElement = this.elements.create("payment", paymentElementOptions);
      paymentElement.mount("#payment-element");
      const addressElement = this.elements.create('address', options);
      addressElement.mount('#address-element')
      // }, 100);

    })
  }
  async handleSubmitForStripePayment(){
    const elements=this.elements
       
    const {paymentIntent,error} = await this.stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:5000/successPage",
        // return_url:this.router.navigate['payment-status']
      },
      redirect: 'if_required',
    });
  if(error){
    if (error.type === "card_error" || error.type === "validation_error" || error.type==="invalid_request_error") {
      window.alert(error.message);
      const messageContainer = document.querySelector('#error-message');
      messageContainer!.textContent = "Error message :-"+" "+ error.message;
    } else if(paymentIntent) {
      window.alert("An unexpected error occurred.");
      const messageContainer = document.querySelector('#error-message');
      messageContainer!.textContent = error.message;
    }
}else{
    window.alert('payment success')
    

}
  }
}
