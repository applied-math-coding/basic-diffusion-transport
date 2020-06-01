import params
import numpy as np


def calc_min_delta_t(delta_x, alpha, v_max) -> int:
    return min(1, 1 / 4 * delta_x ** 2 / alpha, delta_x / v_max)


def adjust_boundary(T, v_x, v_y):
    T[0, :] = params.T_h
    T[-1, :] = T[-2, :]
    T[:, 0] = T[:, 1]
    T[:, -1] = T[:, -2]
    v_y[0, :] = 0
    v_y[-1, :] = v_y[-2, :]
    v_y[:, 0] = v_y[:, 1]
    v_y[:, -1] = v_y[:, -2]


def diffusion_x_op(T, alpha, delta_t, delta_x):
    T[1:-2, 1:-2] = T[1:-2, 1:-2] + alpha * delta_t / \
        pow(delta_x, 2) * (T[1:-2, 0:-3]-2*T[1:-2, 1:-2]+T[1:-2, 2:-1])


def diffusion_y_op(T, alpha, delta_t, delta_x):
    T[1:-2, 1:-2] = T[1:-2, 1:-2] + alpha * delta_t / \
        pow(delta_x, 2) * (T[0:-3, 1:-2]-2*T[1:-2, 1:-2]+T[2:-1, 1:-2])


def heat_convection_y_op(T, v_y, delta_t, delta_x):
    T[1:-2, 1:-2] = T[1:-2, 1:-2] - delta_t / delta_x * \
        v_y[1:-2, 1:-2] * (T[1:-2, 1:-2]-T[0:-3, 1:-2])


def mom_convection_y_op(T, v_y, delta_t, delta_x):
    b = params.g * np.max(0, (T[1:-2, 1:-2]-T[2:-1, 1:-2])/T[2:-1, 1:-2])
    v_y[1:-2, 1:-2] = v_y[1:-2, 1:-2] + delta_t * b - delta_t / \
        delta_x * v_y[1:-2, 1:-2] * (v_y[1:-2, 1:-2]-v_y[0:-3, 1:-2])
