import matplotlib.pyplot as plt
import numpy as np
import params as params
import utils

delta_x = params.L / params.n_grid
alpha = params.lambda_ / (params.rho * params.c_p)
delta_t = utils.calc_min_delta_t(delta_x, alpha, params.v_max)
print(delta_t)

T = np.empty((params.n_grid, params.n_grid))
T.fill(params.T_c)
v_y = np.zeros((params.n_grid, params.n_grid))
v_x = np.zeros((params.n_grid, params.n_grid))


def simulate():
    t = 0
    last_plot = 0
    global delta_t
    while t <= params.duration:
        utils.adjust_boundary(T, v_x, v_y)
        utils.diffusion_x_op(T, alpha, delta_t, delta_x)
        utils.diffusion_y_op(T, alpha, delta_t, delta_x)
        utils.heat_convection_y_op(T, v_y, delta_t, delta_x)
        utils.mom_convection_y_op(T, v_y, delta_t, delta_x)
        utils.adjust_boundary(T, v_x, v_y)
        v_max = np.max(np.abs(v_y))
        delta_t = utils.calc_min_delta_t(delta_x, alpha, v_max)
        t = t+delta_t
        if t - last_plot > 1 or last_plot == 0:
            plt.clf()
            plt.imshow(T, origin='lower', vmin=params.T_c, vmax=params.T_h)
            plt.pause(0.1)
            last_plot = t


simulate()


plt.show()
