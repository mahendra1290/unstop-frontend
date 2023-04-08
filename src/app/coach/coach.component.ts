import { Component, Input } from "@angular/core";
import { Seat } from "src/types";

@Component({
  selector: "app-coach",
  templateUrl: "./coach.component.html",
})
export class CoachComponent {
  @Input() seatMap: Seat[][] = [];
  @Input() bookedSeats: number[] = [];
}
