/* eslint-disable no-unused-vars */
import {select,templates} from '../settings.js';
import {utils} from '../utils.js';
import {AmountWidget} from './AmountWidget.js';



export class Booking{
  constructor(bookingContainer){
    const thisBooking = this;

    thisBooking.bookingContainer=bookingContainer;
    thisBooking.render(bookingContainer);
    thisBooking.initWidges();

  }
  render(){
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom ={};
    thisBooking.dom.wrapper = utils.createDOMFromHTML(generatedHTML);



    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    console.log('people dom',thisBooking.dom.peopleAmount);
    thisBooking.bookingContainer.appendChild(thisBooking.dom.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.bookingContainer.appendChild(thisBooking.dom.hoursAmount);
  }

  initWidges(){
    const thisBooking = this;



    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);


  }


}
