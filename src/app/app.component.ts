import { Component, OnInit } from '@angular/core';
import { mat } from 'lina';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'basic-diffusion-transport';

  ngOnInit() {
    const A = mat(2, 2).fill(7);
    A.print();
    //TODO  run simulation in webworker and message in reg. timesteps the main to rerender data
  }

  handleStartSimulation() {

  }
}
