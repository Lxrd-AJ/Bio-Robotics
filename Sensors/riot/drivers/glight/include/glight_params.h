#ifndef GLIGHT_PARAMS_H
#define GLIGHT_PARAMS_H

#include "board.h" 
#include "glight.h"

#ifdef __cplusplus
extern "C" {
#endif

#ifndef GLIGHT_PARAM_PIN
#define GLIGHT_PARAM_PIN         (GPIO_PIN(PORT_A,0))
#endif

#ifndef GLIGHT_PARAMS
#define GLIGHT_PARAMS       { pin = GLIGHT_PARAM_PIN }
#endif

static const glight_params_t glight_params[] = {
    GLIGHT_PARAMS
};

#ifdef __cplusplus
}
#endif

#endif