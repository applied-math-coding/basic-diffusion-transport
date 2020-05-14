import { Component, OnInit, EventEmitter } from '@angular/core';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'basic-diffusion-transport';
  graph = {
    data: [{
      z: [],
      type: 'heatmap',
      colorscale: [
        [273.15, '#3D9970'],  //TODO bind to T_c, T_h
        [273.15 + 20, '#001f3f']
      ]
    }],
    layout: { width: 600, height: 600, title: 'A Fancy Plot' }
  };
  private newData = new EventEmitter<number[][]>();

  ngOnInit() {
    //TODO implement simulation to be interruptable (see js concept)
    //TODO  run simulation in webworker and message in reg. timesteps the main to rerender data

    //TODO create PDE and Functional libs
    //TODO enhance lina by  .col(x)  .row(x)  fast-slicing and use here
    //TODO incorporate params and show sliders and input fields to adjust values
    //TODO interrupt when pressing simulate
    //TODO for diffusion you can alternat. provide a implicite solver (enhance lina for the solver, iterati, direct)
    //TODO make the pde.lib being very smart to use w.r.t op-splitting:  diffusion(crank_nick, ...) ...

    this.newData.pipe(delay(1000)).subscribe(d => this.graph.data[0].z = d);
  }

  handleStartSimulation() {
    const worker = new Worker('./app.worker', { type: 'module' });
    worker.onmessage = ({ data }: { data: number[][] }) => this.newData.emit(data);
    worker.postMessage({ duration: 60 });
    // worker.terminate()   try use for interruptoing TODO
  }
}

