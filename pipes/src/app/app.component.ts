import { Component } from '@angular/core';
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
}
