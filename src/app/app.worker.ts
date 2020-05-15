/// <reference lib="webworker" />
import { Matrix, calc, mat } from "lina";
import { Params } from './params';

addEventListener('message', ({ data }) => {
  const params: Params = { ...new Params(), ...data };
  simulate(params);
});

//TODO implement parts so that they can be reused in a PDE-package
// TODO remove this and implement a partial  op(partial(f)(a))   f(a, ...)
const L = 1; // m (the length of the block)
const n_grid = 10;
const delta_x = L / n_grid; // m
const lambda = 0.026; // J/(m*s*K) heat conductivity TODO
const rho = 1.225; // kg/m^3 density
const c_p = 1004; // J/(kg*K) heat-capacity
const T_c = 273.15; // K  cold-temp
const T_h = T_c + 20; // K hot-temp
const v_max = 2; // m/s^2 max. abs. velocity
const duration = 5 * 60; // s duration
const report_frequ = 1; // s

const alpha = lambda / (rho * c_p);
const delta_t = Math.min(1 / 4 * delta_x ** 2 / alpha, delta_x / v_max);

function diffusion_x_op(w: Matrix): Matrix {
  const u = w.shrink(1);
  calc<Matrix>`${w.shrink(1)} = ${u} + ${alpha * delta_t / delta_x ** 2} * (${u.shift_x(-1)} - 2 * ${u} + ${u.shift_x(1)})`;
  return w;
}

function diffusion_y_op(w: Matrix): Matrix {
  const u = w.shrink(1);
  calc<Matrix>`${w.shrink(1)} = ${u} + ${alpha * delta_t / delta_x ** 2} * (${u.shift_y(-1)} - 2 * ${u} + ${u.shift_y(1)})`;
  return w;
}

function adjust_boundary(u: Matrix): Matrix {
  const [rows, cols] = u.shape();
  // fixed upper, lower boundary
  const upper_and_lower = ({ row }) => row === 0 || row === rows - 1;
  u.filter(upper_and_lower).fill(T_h);

  // no-gradient condition at left and right
  calc`${u.col(0)} = ${u.col(1)}`;
  calc`${u.col(cols - 1)} = ${u.col(cols - 2)}`;
  return u;
}

function simulate(params: Params) {
  const u = mat(n_grid - 2, n_grid - 2).wrap(1).fill(T_c); // initial conditions

  let last_report: number;
  for (let t = 0; t <= duration; t = t + delta_t) {
    op(diffusion_y_op)
      .comp(diffusion_x_op)
      .comp(adjust_boundary)(u);

    if (!last_report || t - last_report >= report_frequ) {
      postMessage({ T: u.rawData(), t });
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
