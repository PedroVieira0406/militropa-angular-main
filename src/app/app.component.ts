import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArmaFormComponent } from "./components/arma/arma-form/arma-form.component";
import { AdminTemplateComponent } from "./components/template/admin-template/admin-template.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ArmaFormComponent, AdminTemplateComponent, AdminTemplateComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'militropa-angular';
}
