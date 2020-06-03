import { Component, OnInit, EventEmitter } from '@angular/core';
import { delay, concatMap } from 'rxjs/operators';
import { SimulationData } from './simulation-data';
import { of, Subscription } from 'rxjs';
import { Params } from './params';
import { SelectItem } from 'primeng/api/selectitem';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Transport Diffusion Process';
  graph: any;
  private newData = new EventEmitter<SimulationData>();
  currData: SimulationData;
  private worker: Worker;
  private subscription: Subscription;
  params = new Params();
  gridOptions: SelectItem[];

  ngOnInit() {
    this.gridOptions = [...Array(9)]
      .map((e, idx) => (idx + 1) * 10)
      .map(v => ({ label: `${v}`, value: v }));

    this.graph = {
      data: [{
        z: [],
        type: 'heatmap',
        zmin: this.params.T_c,
        zmax: this.params.T_h,
      }],
      layout: {
        height: 300,
        margin: { l: 50, r: 50, t: 20, b: 30 },
        xaxis: { rangemode: 'nonnegative' }
      },
      config: {
        displayModeBar: false,
        responsive: true
      }
    };
  }

  handleStopSimulation() {
    this.worker?.terminate();
    this.subscription?.unsubscribe();
  }

  handleStartSimulation() {
    this.worker?.terminate();
    this.subscription?.unsubscribe();
    this.graph.data[0].zmin = this.params.T_c;
    this.graph.data[0].zmax = this.params.T_h;
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

