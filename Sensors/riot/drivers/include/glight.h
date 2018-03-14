#ifndef GLIGHT_H
#define GLIGHT_H

#include <stdint.h>
#include "periph/i2c.h"
#include "periph/gpio.h"

#ifdef __cplusplus
extern "C" {
#endif

#ifndef GLIGHT_I2C_ADDRESS
#define GLIGHT_I2C_ADDRESS           0x40 /**< Default address */
#endif

enum {
    GLIGHT_OK = 0,
    GLIGHT_NO12C = -1
};

typedef struct {
    i2c_t i2c; 
    uint8_t addr; /** The device's address on the bus*/
} glight_params_t;

typedef struct {
    glight_params_t params;
} glight_t;

int glight_init(glight_t *dev, const glight_params_t *params);

int16_t glight_read_light(glight_t *dev);

#ifdef __cplusplus
}
#endif
#endif