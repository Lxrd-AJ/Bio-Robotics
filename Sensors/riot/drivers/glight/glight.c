#include <stdint.h>
#include <stdbool.h>
#include <string.h>

#include "board.h"
#include "assert.h"
#include "periph/i2c.h"
#include "xtimer.h"
#include "glight.h"
#include "glight_params.h"

#define ENABLE_DEBUG        (0)
#include "debug.h"

#define I2C_SPEED           I2C_SPEED_FAST
#define MAX_RETRIES         20

#define BUS                 (dev->params.i2c)
#define ADDR                (dev->params.addr)

int glight_init(glight_t *dev, const glight_params_t *params){
    uint8_t result;

    assert(dev && params);
    DEBUG("[ghlight] init: copying dev descriptor\n");
    memccpy(dev, params, sizeof(glight_params_t));

    /* I2C Bus */
}

int16_t glight_read_light(glight_t *dev){
    uint8_t result;
    //TODO: Continue here
}