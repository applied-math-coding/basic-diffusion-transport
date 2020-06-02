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
    T[1:-1, 1:-1] = T[1:-1, 1:-1] + alpha * delta_t / \
        pow(delta_x, 2) * (T[1:-1, 0:-2]-2*T[1:-1, 1:-1]+T[1:-1, 2:])


def diffusion_y_op(T, alpha, delta_t, delta_x):
    T_cen = T[1:-1, 1:-1]
    T_down = T[0:-2, 1:-1]
    T_up = T[2:, 1:-1]
    T[1:-1, 1:-1] = T_cen + alpha * delta_t / \
        pow(delta_x, 2) * (T_down-2*T_cen+T_up)


def heat_convection_y_op(T, v_y, delta_t, delta_x):
    T_cen = T[1:-1, 1:-1]
    T_down = T[0:-2, 1:-1]
    v_y_cen = v_y[1:-1, 1:-1]
    T[1:-1, 1:-1] = T_cen - delta_t / delta_x * v_y_cen * (T_cen-T_down)


def mom_convection_y_op(T, v_y, delta_t, delta_x):
    T_cen = T[1:-1, 1:-1]
    v_y_cen = v_y[1:-1, 1:-1]
    v_y_down = v_y[0:-2, 1:-1]
    T_up = T[2:, 1:-1]
    b = params.g * np.maximum(np.zeros(T_cen.shape),
                              (T_cen-T_up)/T_up)
    v_y[1:-1, 1:-1] = v_y_cen + delta_t * b - \
        delta_t / delta_x * v_y_cen * (v_y_cen-v_y_down)
