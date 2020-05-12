import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'basic-diffusion-transport';

  ngOnInit() {
    //TODO implement simulation to be interruptable (see js concept)
    //TODO  run simulation in webworker and message in reg. timesteps the main to rerender data
  }

  handleStartSimulation() {
    const worker = new Worker('./app.worker', { type: 'module' });
    worker.onmessage = ({ data }) => {
      console.log(`page got message: ${data}`);
    };
    worker.postMessage('hello');
  }
}

