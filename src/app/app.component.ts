import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Seat } from "src/types";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "unstop-reservation";

  numberOfSeats = new FormControl("", {
    validators: [Validators.required, Validators.min(1), Validators.max(7)],
    updateOn: "change",
  });

  handleSubmit(e: SubmitEvent) {
    e.preventDefault();
  }

  seatMap: Seat[][] = [];
  bookedSeats: number[] = [];
  coachId = "";

  constructor() {
    this.getCoach();
  }

  async getCoach() {
    const res = await fetch("http://localhost:3000/coach", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resJson = await res.json();
    this.seatMap = resJson.coach;
    this.coachId = resJson.id;
    console.log(resJson);
  }

  async bookTickets() {
    const seatsCount = Number(this.numberOfSeats.value);
    const res = await fetch("http://localhost:3000/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: this.coachId, seats: seatsCount }),
    });
    const resJson = await res.json();
    this.seatMap = resJson.seatMap;
    this.bookedSeats = resJson.seatNumbers;
    this.numberOfSeats.setValue("");
    this.numberOfSeats.markAsPristine();
    this.numberOfSeats.markAsUntouched();
  }

  get errorMessage() {
    const errors = this.numberOfSeats.errors;
    let error = "";
    if (errors?.["required"]) {
      error = "this required";
    }
    if (errors?.["min"]) {
      error = `atleat ${errors["min"]["min"]} seat is required`;
    }
    if (errors?.["max"]) {
      error = `you can book upto ${errors["max"]["max"]} seats at once`;
    }
    return error;
  }
}
