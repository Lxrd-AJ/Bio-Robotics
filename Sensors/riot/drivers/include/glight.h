#ifndef GLIGHT_H
#define GLIGHT_H

#include <stdint.h>
#include "periph/i2c.h"
#include "periph/gpio.h"

#ifdef __cplusplus
extern "C" {
#endif


enum {
    GLIGHT_OK = 0,
    GLIGHT_NO_GPIO = -1
};

typedef struct {
    gpio_t pin;
} glight_params_t;

typedef struct {
    glight_params_t params;
} glight_t;

int glight_init(glight_t *dev, const glight_params_t *params);

int glight_read_light(glight_t *dev);

#ifdef __cplusplus
}
#endif
#endif
