#include <stdio.h>
#include "lampada_ctrl.h"

void setLampada(gpio_num_t lampada, int status){
    gpio_set_direction(lampada, GPIO_MODE_OUTPUT);
    gpio_set_level(lampada, status);
}
