import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Coach, Seat } from "src/types";

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

  coach: Coach | null = null;
  bookedSeats: number[] = [];
  coachId = "";
  loading = false;

  constructor() {
    this.getCoach();
  }

  async resetCoach() {
    const res = await fetch("http://localhost:3000/reset", {
      method: "POST",
    });
    const resJson = await res.json();
    if (resJson.status === "success") {
      this.coach = resJson.coach;
      this.bookedSeats = [];
    }
  }

  async autofillCoach() {
    const res = await fetch("http://localhost:3000/autofill", {
      method: "POST",
    });
    const resJson = await res.json();
    if (resJson.status === "success") {
      this.coach = resJson.coach;
      this.bookedSeats = [];
    }
  }

  async getCoach() {
    const res = await fetch("http://localhost:3000/coach", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resJson = await res.json();
    console.log("res", resJson);
    this.coach = resJson.coach;
    console.log(resJson);
  }

  async bookTickets() {
    this.loading = true;
    const seatsCount = Number(this.numberOfSeats.value);
    const res = await fetch("http://localhost:3000/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: this.coachId, seats: seatsCount }),
    });
    const resJson = await res.json();
    this.coach = resJson.seatMap;
    this.bookedSeats = resJson.seatNumbers;
    this.numberOfSeats.setValue("");
    this.numberOfSeats.markAsPristine();
    this.numberOfSeats.markAsUntouched();
    this.loading = false;
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
