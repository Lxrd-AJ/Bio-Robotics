#ifndef GLIGHT_PARAMS_H
#define GLIGHT_PARAMS_H

#include "board.h" 
#include "glight.h"

#ifdef __cplusplus
extern "C" {
#endif

#ifndef GLIGHT_PARAM_I2C
#define GLIGHT_PARAM_I2C        (I2C_DEV(0))
#endif
#ifndef GLIGHT_PARAM_ADDR
#define GLIGHT_PARAM_ADDR       (GLIGHT_I2C_ADDRESS)
#endif
#ifndef GLIGHT_PARAMS
#define GLIGHT_PARAMS       { .i2c = GLIGHT_PARAM_I2C, \
                               .addr = GLIGHT_PARAM_ADDR }
#endif

static const glight_params_t glight_params[] = {
    GLIGHT_PARAMS
};

#ifdef __cplusplus
}
#endif

#endif
