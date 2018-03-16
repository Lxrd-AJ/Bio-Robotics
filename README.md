# Bio-Robotics
* How to communicate with Server
* Data server recieves?

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