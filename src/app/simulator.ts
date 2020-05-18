import { calc, Matrix, zeros, mat } from 'lina';
import { DynamicVars } from './dynamic-vars';
import { Params } from './params';

export class Simulator {
  private readonly L = 1; // m (the length of the block)
  private readonly n_grid = 50;
  private readonly delta_x = this.L / this.n_grid; // m
  private readonly g = 9.81; // m/s^2
  private readonly v_max = 2; // m/s^2 max. abs. velocity  //TODO make this adaptive
  private readonly duration = 5 * 60; // s duration
  private readonly report_frequ = 1; // s
  private alpha: number;
  private delta_t: number;
  private params: Params;

  constructor(params: Params) {
    this.params = params;
    this.alpha = this.params.lambda / (this.params.rho * this.params.c_p);
    this.delta_t = Math.min(1 / 4 * this.delta_x ** 2 / this.alpha, this.delta_x / this.v_max);
  }

  simulate() {
    const T = mat(this.n_grid - 2, this.n_grid - 2).wrap(1).fill(this.params.T_c); // initial conditions
    const v_y = zeros(this.n_grid, this.n_grid);
    const v_x = zeros(this.n_grid, this.n_grid);

    let last_report: number;
    for (let t = 0; t <= this.duration; t = t + this.delta_t) {
      op(d => d)
        .comp((d: DynamicVars) => this.adjust_boundary(d))
        .comp((d: DynamicVars) => this.mom_convection_y_op(d))
        .comp((d: DynamicVars) => this.heat_convection_y_op(d))
        .comp((d: DynamicVars) => this.diffusion_y_op(d))
        .comp((d: DynamicVars) => this.diffusion_x_op(d))
        .comp((d: DynamicVars) => this.adjust_boundary(d))({ T, v_x, v_y });

      if (!last_report || t - last_report >= this.report_frequ) {
        postMessage({ T: T.rawData(), t, delta_t: this.delta_t });
        last_report = t;
      }
    }
  }

  private diffusion_x_op(d: DynamicVars): DynamicVars {
    let { T } = d;
    T = T.shrink(1);
    calc<Matrix>`${T} = ${T} + ${this.alpha * this.delta_t / this.delta_x ** 2}
      * (${T.shift_x(-1)} - 2 * ${T} + ${T.shift_x(1)})`;
    return d;
  }

  private diffusion_y_op(d: DynamicVars): DynamicVars {
    let { T } = d;
    T = T.shrink(1);
    calc<Matrix>`${T} = ${T} + ${this.alpha * this.delta_t / this.delta_x ** 2}
      * (${T.shift_y(-1)} - 2 * ${T} + ${T.shift_y(1)})`;
    return d;
  }

  private heat_convection_y_op(d: DynamicVars): DynamicVars {
    let { T, v_y } = d;
    T = T.shrink(1);
    v_y = v_y.shrink(1);
    calc<Matrix>`${T} = ${T} -  ${v_y} % ${this.delta_t / this.delta_x} % (${T} - ${T.shift_y(-1)})`;
    return d;
  }

  private mom_convection_y_op(d: DynamicVars): DynamicVars {
    let { T, v_y } = d;
    T = T.shrink(1);
    const T_A = T.shift_y(1);
    const b = calc<Matrix>`${this.g} * max(0, (${T} - ${T_A})/${T_A})`;
    v_y = v_y.shrink(1);
    calc<Matrix>`${v_y} = ${v_y} + ${this.delta_t} % ${b}
      - ${v_y} % ${this.delta_t / this.delta_x} % (${v_y} - ${v_y.shift_y(-1)})`;
    return d;
  }

  private adjust_boundary(d: DynamicVars): DynamicVars {
    const { T, v_y } = d;
    const [rows, cols] = T.shape();
    // fixed temp at lower boundary
    T.filter(({ row }) => row === 0).fill(this.params.T_h);
    // no-gradient condition at left, right and top
    calc`${T.row(rows - 1)} = ${T.row(rows - 2)}`;
    calc`${T.col(0)} = ${T.col(1)}`;
    calc`${T.col(cols - 1)} = ${T.col(cols - 2)}`;
    // no-gradient condition for velocity at left, right and top
    calc`${v_y.row(rows - 1)} = ${v_y.row(rows - 2)}`;
    calc`${v_y.col(0)} = ${v_y.col(1)}`;
    calc`${v_y.col(cols - 1)} = ${v_y.col(cols - 2)}`;
    // calc`${v_y.row(0)} = 0`; TODO correct this at line
    v_y.row(0).fill(0); //TODO remove later
    return d;
  }
}

//TODO implement parts so that they can be reused in a PDE-package
// TODO remove this and implement a partial  op(partial(f)(a))   f(a, ...)

//TODO put this into a lib (either PDE lib or functional.lib) what more concepts? memoize, curry, partial, ...
// chain/pipe (would be reverse of comp)  In(x).appl(f).appl(g) ...
// PDE lib can utilize the operator splitting approach and providing different stable schema for different approxim
type Fn<T, R> = (v: T) => R;
type Op<T, R> = Fn<T, R> & { comp: <S>(g: Fn<S, T>) => Op<S, R> };
export function op<T = any, R = any>(f: Fn<T, R>): Op<T, R> {
  const res = (v: T) => f(v);
  res['comp'] = <S>(g: Fn<S, T>) => op((v: S) => f(g(v)));
  return res;
}
