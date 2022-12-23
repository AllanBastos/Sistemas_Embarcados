idf_component_register(SRCS "server-http.c"
                    INCLUDE_DIRS "include" "." REQUIRES nvs_flash esp-tls esp_http_server protocol_examples_common )
