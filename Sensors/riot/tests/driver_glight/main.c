#include <stdio.h>
#include "xtimer.h"
#include "glight.h"
#include "glight_params.h"

static glight_t dev; 

int main(void){
    puts("Glight driver test ...");

    printf("Initialising light sensor at GPIO Pin ...\n", glight_params->pin);
    if( glight_init(&dev, glight_params) == GLIGHT_OK ){
        puts("[OK]");
    }else{
        puts("**Failed to acquire init driver");
        return -1;
    }

    int light_amt; 
    
    while(1){
        light_amt = glight_read_light(&dev);
        printf("Light intensity %i", light_amt);
        puts("Light sensor reading ...");
        xtimer_sleep(1);
    }
}
