import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoFocusDirective]',
   standalone: true 
})

export class AutoFocusDirective implements AfterViewInit{

   constructor(private el: ElementRef<HTMLInputElement>) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.el.nativeElement.focus();
        this.el.nativeElement.select();
    });
  }

}
