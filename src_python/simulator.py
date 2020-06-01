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
    while t <= params.duration:
        utils.adjust_boundary(T, v_x, v_y)
        utils.diffusion_x_op(T, alpha, delta_t, delta_x)
        utils.diffusion_y_op(T, alpha, delta_t, delta_x)
        utils.heat_convection_y_op(T, v_y, delta_t, delta_x)
        utils.mom_convection_y_op(T, v_y, delta_t, delta_x)
        utils.adjust_boundary(T, v_x, v_y)
        t = t+delta_t

#TODO check the pointwise 'max', make a basic simulated plot

simulate()

# x = np.linspace(0, 20, 100)  # Create a list of evenly-spaced numbers over the range
# plt.plot(x, np.sin(x))       # Plot the sine of each x point
# plt.show()
