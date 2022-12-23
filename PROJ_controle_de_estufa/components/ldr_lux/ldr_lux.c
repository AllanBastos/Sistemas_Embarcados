#include <stdio.h>
#include <stdlib.h>
#include "math.h"
#include "driver/adc.h"
#include "esp_adc_cal.h"
#include <esp_system.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include <esp_log.h>

#define delay(value) vTaskDelay(value * portTICK_PERIOD_MS)
#define ATTEN ADC_ATTEN_11db
#define WIDTH ADC_WIDTH_BIT_12

extern const adc1_channel_t LDR;

static const char *TAG = "LDR_LUX";

static const int MAX_ADC_READING = 4095;
static const int ADC_REF_VOLTAGE = 5;
static const int REF_RESISTANCE = 13050;
static const int LUX_CALC_SCALAR = 12518931 ;
static const int LUX_CALC_EXPONENT = -1.405;

uint32_t voltage;

void ldr_lux_setup(){
    ESP_ERROR_CHECK(adc1_config_width(WIDTH));
    ESP_ERROR_CHECK(adc1_config_channel_atten(LDR, ATTEN));
}


void calcular_lux(int raw, int *lux){
    float resistorVoltage = (float)raw / MAX_ADC_READING * ADC_REF_VOLTAGE;
    float ldrVoltage = ADC_REF_VOLTAGE - resistorVoltage;
    float ldrResistance = ldrVoltage/resistorVoltage * REF_RESISTANCE; 
    float ldrLux = LUX_CALC_SCALAR * pow(ldrResistance, LUX_CALC_EXPONENT); 
    *lux = ldrLux;
}

void get_lux(int *lux){
    ldr_lux_setup();
    int raw_value = adc1_get_raw(LDR);
    calcular_lux(raw_value, lux);
    ESP_LOGI(TAG, "Valor lido: %d |\t V: %.2f |\t lux: %d", raw_value, (raw_value/4095.0) * 5, *lux);
    delay(2);

}
