#include <stdio.h>
#include <esp_log.h>
#include <esp_system.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_spi_flash.h"
#include "dht.h"
#include "driver/gpio.h"
#include "ldr_lux.h"
#include "driver/adc.h"
#include "server-http.h"
#include "lampada_ctrl.h"

#define sensorDH11 GPIO_NUM_33
#define lampada GPIO_NUM_25
#define cooler GPIO_NUM_32
#define delay(value) vTaskDelay(value * portTICK_PERIOD_MS)

const adc1_channel_t LDR = ADC1_CHANNEL_7;

static const char *TAG = "main";

float humidade = 0;
float temperatura = 0;
int luminosidade = 0;
int estado_lampada = 0;
int estado_lampada_anterior = 0;

int min_lumens = 50;
int max_lumens = 60;
float max_temperatura = 29.0;
float min_temperatura = 25.0;

void getInfoDht(void){
    dht_read_float_data(DHT_TYPE_DHT11, sensorDH11, &humidade, &temperatura);
    ESP_LOGI(TAG, "Humidade %.2f%% Temperatura: %.2f°C", humidade, temperatura);
}

void setCooler(gpio_num_t port, int status){
    gpio_set_direction(port, GPIO_MODE_OUTPUT);
    gpio_set_level(port, status);
}

void analizarParametros(){
    if(luminosidade < min_lumens){
        estado_lampada =  1;
    }else if(luminosidade > max_lumens){
        estado_lampada = 0;
    }

    if(temperatura > max_temperatura){
        setCooler(cooler, 1);
    }else if(temperatura < min_temperatura){
        setCooler(cooler, 0);
    }
}

void app_main(void)
{   
    server_init();

    while (1)
    {   

        getInfoDht();

        analizarParametros();

        get_lux(&luminosidade);

        if(estado_lampada != estado_lampada_anterior){
            setLampada(lampada, estado_lampada);
            estado_lampada_anterior = estado_lampada;
        }
        
        printf("Params minLumens = %d  maxLumens = %d, minTemp = %.2f  maxTemp = %.2f\n", min_lumens, max_lumens, min_temperatura, max_temperatura);
    }
    
}
