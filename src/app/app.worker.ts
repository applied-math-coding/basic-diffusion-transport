/// <reference lib="webworker" />
import { Matrix, calc, mat, zeros } from "lina";
import { Params } from './params';
import { DynamicVars } from './dynamic-vars';

addEventListener('message', ({ data }) => {
  const params: Params = { ...new Params(), ...data };
  simulate(params);
});

//TODO implement parts so that they can be reused in a PDE-package
// TODO remove this and implement a partial  op(partial(f)(a))   f(a, ...)
const L = 1; // m (the length of the block)
const n_grid = 50;
const delta_x = L / n_grid; // m
const lambda = 0.026; // J/(m*s*K) heat conductivity TODO
const rho = 1.225; // kg/m^3 density
const c_p = 1004; // J/(kg*K) heat-capacity
const g = 9.81; // m/s^2
const T_c = 273.15; // K  cold-temp
const T_h = T_c + 5; // K hot-temp
const v_max = 2; // m/s^2 max. abs. velocity  //TODO make this adaptive
const duration = 5 * 60; // s duration
const report_frequ = 1; // s

const alpha = lambda / (rho * c_p);
const delta_t = Math.min(1 / 4 * delta_x ** 2 / alpha, delta_x / v_max);

function diffusion_x_op(d: DynamicVars): DynamicVars {
  let { T } = d;
  T = T.shrink(1);
  calc<Matrix>`${T} = ${T} + ${alpha * delta_t / delta_x ** 2} * (${T.shift_x(-1)} - 2 * ${T} + ${T.shift_x(1)})`;
  return d;
}

function diffusion_y_op(d: DynamicVars): DynamicVars {
  let { T } = d;
  T = T.shrink(1);
  calc<Matrix>`${T} = ${T} + ${alpha * delta_t / delta_x ** 2} * (${T.shift_y(-1)} - 2 * ${T} + ${T.shift_y(1)})`;
  return d;
}

function heat_convection_y_op(d: DynamicVars): DynamicVars {
  let { T, v_y } = d;
  T = T.shrink(1);
  v_y = v_y.shrink(1);
  calc<Matrix>`${T} = ${T} -  ${v_y} % ${delta_t / delta_x} % (${T} - ${T.shift_y(-1)})`;
  return d;
}

function mom_convection_y_op(d: DynamicVars): DynamicVars {
  let { T, v_y } = d;
  T = T.shrink(1);
  const T_A = T.shift_y(1);
  const b = calc<Matrix>`${g} * max(0, (${T} - ${T_A})/${T_A})`;
  v_y = v_y.shrink(1);
  calc<Matrix>`${v_y} = ${v_y} + ${delta_t} % ${b} - ${v_y} % ${delta_t / delta_x} % (${v_y} - ${v_y.shift_y(-1)})`;
  return d;
}

function adjust_boundary(d: DynamicVars): DynamicVars {
  const { T, v_y } = d;
  const [rows, cols] = T.shape();
  // fixed temp at lower boundary
  T.filter(({ row }) => row === 0).fill(T_h);
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

function simulate(params: Params) {
  const T = mat(n_grid - 2, n_grid - 2).wrap(1).fill(T_c); // initial conditions
  const v_y = zeros(n_grid, n_grid);
  const v_x = zeros(n_grid, n_grid);

  let last_report: number;
  for (let t = 0; t <= duration; t = t + delta_t) {
    op(d => d)
      .comp(adjust_boundary)
      .comp(mom_convection_y_op)
      .comp(heat_convection_y_op)
      .comp(diffusion_y_op)
      .comp(diffusion_x_op)
      .comp(adjust_boundary)({ T, v_x, v_y });

    if (!last_report || t - last_report >= report_frequ) {
      postMessage({ T: T.rawData(), t, delta_t });
      last_report = t;
    }
  }
}

//TODO put this into a lib (either PDE lib or functional.lib) what more concepts? memoize, curry, partial, ...
// chain/pipe (would be reverse of comp)  In(x).appl(f).appl(g) ...
// PDE lib can utilize the operator splitting approach and providing different stable schema for different approxim
type Fn<T, R> = (v: T) => R;
type Op<T, R> = Fn<T, R> & { comp: <S>(g: Fn<S, T>) => Op<S, R> };
function op<T = any, R = any>(f: Fn<T, R>): Op<T, R> {
  const res = (v: T) => f(v);
  res['comp'] = <S>(g: Fn<S, T>) => op((v: S) => f(g(v)));
  return res;
}
