#include <stdio.h>
#include "xtimer.h"
#include "glight.h"
#include "glight_params.h"

static glight_t dev; 

int main(void){
    puts("Glight driver test ...");

    int16_t light_amt;
    printf("Initialising light sensor at I2C_DEV(%i) ...\n", glight_params->i2c);
    if( glight_init(&dev, glight_params) == GLIGHT_OK ){
        puts("[OK]");
    }else{
        puts("**Failed to acquire init driver");
    }

    int16_t light_amt; 

    while(1){
        light_amt = glight_read_light(&dev);
        printf("Light intensity %i", light_amt);
        xtimer_sleep(1);
    }
}