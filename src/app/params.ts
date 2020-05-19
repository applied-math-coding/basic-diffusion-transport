export class Params {
  lambda: number = 0.026; // J/(m*s*K) heat conductivity
  rho: number = 1.225; // kg/m^3 density
  c_p: number = 1004; // J/(kg*K) heat-capacity
  T_c: number = 273; // K  cold-temp
  T_h: number = 273 + 5; // K hot-temp
  v_max: number = 2; // m/s^2 max. abs. velocity
  duration: number = 60; // s duration,
  includeBuoyancy = true;
  n_grid = 50;
}
