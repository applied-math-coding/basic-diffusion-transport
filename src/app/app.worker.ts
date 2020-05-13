/// <reference lib="webworker" />
import { zeros, Matrix, calc, mat } from "lina";

addEventListener('message', ({ data }) => {
  const response = `worker response to ${data}`;
  postMessage(response);
});

//TODO implement parts so that they can be reused in a PDE-package


const L = 1; // m (the length of the block)
const n_grid = 10;
const delta_x = L / n_grid; // m
const k = 1.0; // heat conductivity TODO
const rho = 1.0; // kg/m^3  density
const c_p = 1.0; //  heat-capacity TODO
const T_c = 273.15; // K  cold-temp
const T_h = T_c + 20; // K hot-temp
const v_max = 2; // m/s^2 max. abs. velocity
const duration = 60; // s duration

const alpha = k / (rho * c_p);
const delta_t = Math.min(1 / 4 * delta_x ** 2 / alpha, delta_x / v_max);

function slide_center(u: Matrix, c: number = 1): Matrix {
  const [m, n] = u.shape();
  return u.slice(c, c, m - 1 - c, n - 1 - c);
}

function slide_x(u: Matrix, d: number, c: number = 1): Matrix {
  const [m, n] = u.shape();
  return u.slice(c + d, c, m - 1 - c + d, n - 1 - c);
}

function diffusion_x_op(u: Matrix): Matrix {
  u = u.shrink(1);
  return calc<Matrix>`${u} + ${alpha * delta_t / delta_x ** 2} * (${u.shift_x(-1)} - 2 * ${u} + ${u.shift_x(1)})`;
}

function diffusion_y_op(u: Matrix): Matrix {
  u = u.shrink(1);
  return calc<Matrix>`${u} + ${alpha * delta_t / delta_x ** 2} * (${u.shift_y(-1)} - 2 * ${u} + ${u.shift_y(1)})`;
}

let u_before = mat(n_grid - 2, n_grid - 2).wrap(1).fill(1);
for (let t = 0; t <= duration; t = t + delta_t) {
  u_before = op(diffusion_y_op).comp(diffusion_x_op)(u_before);
}

console.log(u_before.print());


//TODO put this into a lib (either PDE lib or functional.lib) what more concepts? memoize, curry, partial, ...
// chain/pipe (would be reverse of comp)  In(x).appl(f).appl(g) ...
type Fn<T, R> = (v: T) => R;
type Op<T, R> = Fn<T, R> & { comp: <S>(g: Fn<S, T>) => Op<S, R> };
function op<T = any, R = any>(f: Fn<T, R>): Op<T, R> {
  const res = (v: T) => f(v);
  res['comp'] = <S>(g: Fn<S, T>) => op((v: S) => f(g(v)));
  return res;
}
