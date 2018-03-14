#include <stdint.h>
#include <stdbool.h>
#include <string.h>
#include <stdio.h> //TODO: Remove
#include <inttypes.h> //TODO: Remove

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
    // uint8_t result;

    assert(dev && params);
    DEBUG("[ghlight] init: copying dev descriptor\n");
    memcpy(dev, params, sizeof(glight_params_t));

    /* I2C Bus */
    DEBUG("[sht2x] init: acquiring I2C\n");
    i2c_acquire(BUS);
    DEBUG("[sht2x] init: setting master mode\n");
    if (i2c_init_master(BUS, I2C_SPEED) < 0) {
        i2c_release(BUS);
        DEBUG("[sht2x] init - error: unable to initialize I2C bus\n");
        return GLIGHT_NO12C;
    }

    return GLIGHT_OK;
}

int16_t glight_read_light(glight_t *dev){
    uint8_t result;
    uint16_t light_amt;
    char buffer[1];
    
    assert(dev);

    DEBUG("[glight] glight_read_light: Attempting to acquire I2C\n");
    i2c_acquire(BUS);

    result = i2c_read_byte(BUS, ADDR, buffer );
    printf("%" PRId8 ,result);
    i2c_release(BUS);

    DEBUG("[glight] ** Data from sensor \n");
    DEBUG(buffer);

    light_amt = buffer[0] << 8;
    return (int16_t) light_amt;
}