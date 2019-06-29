/* eslint-disable no-unused-vars */
import {select,templates,settings,classNames} from '../settings.js';
import {utils} from '../utils.js';
import {AmountWidget} from './AmountWidget.js';
import {DatePicker} from './DatePicker.js';
import {HourPicker} from './HourPicker.js';


export class Booking{
  constructor(bookingContainer){
    const thisBooking = this;
    thisBooking.bookings=[];

    thisBooking.bookingContainer= bookingContainer;
    thisBooking.render(bookingContainer);
    //thisBooking.initAction();
    thisBooking.initWidges();

    thisBooking.getData();
    thisBooking.initAction();


  }



  initAction(){
    const thisBooking= this;
    thisBooking.dom.wrapper.addEventListener('submit', function(event){
      event.preventDefault();

      thisBooking.sendBooking();


    });
  }
  render(){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom ={};
    thisBooking.dom.wrapper = thisBooking.bookingContainer;


    thisBooking.dom.wrapper.innerHTML= generatedHTML;

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.starters= thisBooking.dom.wrapper.querySelectorAll('.checkbox');



  }

  initWidges(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker= new HourPicker(thisBooking.dom.hourPicker);


    thisBooking.dom.wrapper.addEventListener('updated',function(){

      thisBooking.updateDOM();


    });

  }
  getData(){
    const thisBooking = this;



    const startEndDates = {};
    startEndDates[settings.db.dateStartParamKey] = utils.dateToStr(thisBooking.datePicker.minDate);
    startEndDates[settings.db.dateEndParamKey] = utils.dateToStr(thisBooking.datePicker.maxDate);

    const endDate = {};
    endDate[settings.db.dateEndParamKey] = startEndDates[settings.db.dateEndParamKey];

    const params = {
      booking: utils.queryParams(startEndDates),
      eventsCurrent: settings.db.notRepeatParam + '&' + utils.queryParams(startEndDates),
      eventsRepeat: settings.db.repeatParam + '&' + utils.queryParams(endDate),
    };




    const urls = {
      booking: settings.db.url  +'/' + settings.db.booking + '?' + params.booking,
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent,
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat,

    };

    console.log('PARAMETRY',params);



    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function([bookingsResponse, eventsCurrentResponse, eventsRepeatResponse]){
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });

  }

  parseData(bookings=[],eventsCurrent=[],eventsRepeat=[]){
    const thisBooking=this;
    thisBooking.booked ={};

    console.log('eventCurrent',eventsCurrent);

    for (let element of eventsCurrent) {
      console.log('element:',element);
      thisBooking.makeBooked(element.date, element.hour,element.duration,element.table);
      console.log('daty',element.date);
    }

    for (let element of bookings) {
      console.log('element:',element);
      thisBooking.makeBooked(element.date, element.hour,element.duration,element.table);

    }

    for (let element of eventsRepeat) {
      console.log('element:',element);
      thisBooking.makeBooked(element.date, element.hour,element.duration,element.table);

    }
    thisBooking.updateDOM();
  }
  makeBooked(date, hour, duration, table) {
    const thisBooking=this;

    // czy jest taki dzien?
    if(!thisBooking.booked[date]) {
      thisBooking.booked[date] = {};
    }

    let time = hour.split(':');
    if(time[1] === '30') hour = `${time[0]}.5`;
    else hour = time[0];

    // czy w obiekcie już jest godzina rozpoczęcia
    if(!thisBooking.booked[date][hour]) {
      thisBooking.booked[date][hour] = [];
    }

    thisBooking.booked[date][hour].push(table);

    hour = hour - (-duration);

    // czy w obiekcie już jest godzina zakończenia
    if(!thisBooking.booked[date][hour]) {
      thisBooking.booked[date][hour] = [];
    }

    thisBooking.booked[date][hour].push(table);

    console.log('BOOKED',thisBooking.booked);

  }
  updateDOM(){

    const thisBooking=this;
    //console.log('thisBooking.datePicker',thisBooking.datePicker);
    //console.log('thisBooking.hourPicker',thisBooking.hourPicker);
    thisBooking.starters=[];
    thisBooking.phone =  document.querySelectorAll('[name="phone"]')[1];
    thisBooking.address =  document.querySelectorAll('[name="address"]')[1];

    for (let table of thisBooking.dom.tables){
      table.addEventListener('click',function(){

        table.classList.toggle(classNames.booking.tableBooked);

        thisBooking.nrTable = table.getAttribute(settings.booking.tableIdAttribute);


      });
    }

    for(let starter of thisBooking.dom.starters){
      starter.addEventListener('change', function(event){
        event.preventDefault();

        console.log('STARTER',starter);
        thisBooking.starters.push (starter.outerText);
      });

    }


    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);


    for (let table of thisBooking.dom.tables){

      let nrTable = table.getAttribute(settings.booking.tableIdAttribute);

      if (thisBooking.booked[thisBooking.date] && thisBooking.booked[thisBooking.date][thisBooking.hour]) {
        if(thisBooking.booked[thisBooking.date][thisBooking.hour].includes(parseInt(nrTable))) table.classList.add(classNames.booking.tableBooked);
        else table.classList.remove(classNames.booking.tableBooked);
      }
      else {
        table.classList.remove(classNames.booking.tableBooked);


      }

    }




  }

  sendBooking(){
    const thisBooking= this;


    const url = settings.db.url + '/' + settings.db.booking;

    const payload = {
      date: thisBooking.datePicker.value,
      hour: thisBooking.hour,
      table: thisBooking.nrTable,
      repeat: false,
      duration: thisBooking.hoursAmount.value ,
      ppl: thisBooking.peopleAmount.value,
      address: thisBooking.address.value,
      phone: thisBooking.phone.value,
      starters: thisBooking.starters,
    };



    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url,options)
      .then(function(response){
        return response.json();
      }).then(function(parsedRespnse){
        console.log('parsedResponse', parsedRespnse);
      });


  }

}
