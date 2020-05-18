import { Component, OnInit, EventEmitter } from '@angular/core';
import { delay, concatMap } from 'rxjs/operators';
import { SimulationData } from './simulation-data';
import { of, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Transport Diffusion Process';
  graph = {
    data: [{
      z: [],
      type: 'heatmap',
      // colorscale: [[0, 'rgb(0,0,255)'], [1, 'rgb(255,0,0)']],
      zmin: 273,  //TODO adjust to param
      zmax: 279
    }],
    layout: {
      width: 600,
      height: 300,
      margin: { l: 50, r: 50, t: 20, b: 30 },
      xaxis: { rangemode: 'nonnegative' }
    },
    config: {
      displayModeBar: false
    }
  };
  private newData = new EventEmitter<SimulationData>();
  currData: SimulationData;
  private worker: Worker;
  private subscription: Subscription;

  ngOnInit() {

    //TODO keep the heatmap scale fixed
    //TODO cope for possible negative velocity
    //TODO make v_y = 0 at bottom-border
    //TODO change v_y by using a buoyancy effect and use some random param inside

    //TODO create PDE and Functional libs
    //TODO incorporate params and show sliders and input fields to adjust values

    //TODO for diffusion you can alternat. provide a implicite solver (enhance lina for the solver, iterati, direct)
    //TODO make the pde.lib being very smart to use w.r.t op-splitting:  diffusion(crank_nick, ...) ...


  }

  handleStopSimulation() {
    this.worker?.terminate();
    this.subscription?.unsubscribe();
  }

  handleStartSimulation() {
    this.worker?.terminate();
    this.subscription?.unsubscribe();
    this.worker = new Worker('./app.worker', { type: 'module' });
    this.worker.onmessage = ({ data }: { data: SimulationData }) => this.newData.emit(data);
    this.worker.postMessage({ duration: 60 });
    this.subscribeToNewData();
  }

  private subscribeToNewData() {
    this.subscription = this.newData
      .pipe(concatMap(v => of(v).pipe(delay(1000))))
      .subscribe(d => {
        this.graph.data[0].z = d.T;
        d.t = Math.round(d.t);
        this.currData = d;
      });
  }
}

