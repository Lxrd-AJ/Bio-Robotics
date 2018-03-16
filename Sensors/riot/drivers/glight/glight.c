#include <stdint.h>
#include <stdbool.h>
#include <string.h>
#include <stdio.h> //TODO: Remove
#include <inttypes.h> //TODO: Remove

#include "board.h"
#include "assert.h"
#include "periph/i2c.h"
#include "periph/gpio.h"
#include "xtimer.h"
#include "glight.h"
#include "glight_params.h"

#define ENABLE_DEBUG        (0)
#include "debug.h"

#define I2C_SPEED           I2C_SPEED_FAST
#define MAX_RETRIES         20

#define BUS                 (dev->params.i2c)
#define ADDR                (dev->params.addr)

/**
 * TODO
 *  - [ ] Recieve as a parameter the GPIO pin 
 * */
int glight_init(glight_t *dev, const glight_params_t *params){

    assert(dev && params);
    DEBUG("[ghlight] init: copying dev descriptor\n");
    memcpy(dev, params, sizeof(glight_params_t));

    /* Initialise GPIO Pin */
    int result = gpio_init( GPIO_PIN(PORT_A,0), GPIO_IN_ANALOG )
    if( result == 0 ){
        return GLIGHT_OK;
    }else{
        return GLIGHT_NO_GPIO;
    }
}

int glight_read_light(glight_t *dev){
    assert(dev);
    DEBUG("[glight] glight_read_light: Attempting to Read from GPIO Pin\n");

    int result = gpio_read( dev->params.pin );
    
    return result;
}
