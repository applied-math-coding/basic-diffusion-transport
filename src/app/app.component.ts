import { Component, OnInit, EventEmitter } from '@angular/core';
import { delay, concatMap } from 'rxjs/operators';
import { SimulationData } from './simulation-data';
import { of, Subscription } from 'rxjs';
import { Params } from './params';

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
  params = new Params();

  ngOnInit() {

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
    this.worker.postMessage(this.params);
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

