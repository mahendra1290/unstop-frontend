import { Component, Input } from "@angular/core";

@Component({
  selector: "app-seat",
  templateUrl: "./seat.component.html",
})
export class SeatComponent {
  @Input() seatNumber: string = "";
  @Input() status: "available" | "recent" | "reserved" = "available";
}
