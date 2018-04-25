# Bio-Robotics
## Setup
* Install MongoDB according to the instructions on https://docs.mongodb.com/manual/administration/install-on-linux/ 
* How to communicate with Server
* Data server recieves?

# NodeJS lora helpers
* https://github.com/dumpram/nodejs-lora-server
* https://www.npmjs.com/package/lora-packet
* https://github.com/4refr0nt/lora-gw

# Terminal UI Interface
## Resources 
* https://github.com/chjj/blessed
* https://github.com/yaronn/blessed-contrib 

Initialise a GPIO pin e.g A0
initialise it as an analog pin
read it
gpio_t => 	gpio_init (gpio_t pin, gpio_mode_t mode) => GPIO_PIN(PORT_A, 0)

gpio_read (gpio_t pin) => 0 - 1024 roughly


- Data
Flower
    - id
    - measurement
        - type = temp
        - timestamp
        - value