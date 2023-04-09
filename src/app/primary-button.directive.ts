import { Directive, ElementRef } from "@angular/core";

@Directive({
  selector: "[primary-button]",
})
export class PrimaryButtonDirective {
  constructor(private el: ElementRef) {
    this.el.nativeElement.classList = [
      this.el.nativeElement.className +
        " " +
        "py-2 px-4 bg-blue-500 disabled:bg-gray-300 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75",
    ];
    console.log(el, "element");
  }
}
