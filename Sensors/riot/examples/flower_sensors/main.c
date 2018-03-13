
#include <stdio.h>
#include <string.h>

#include "thread.h"
#include "shell.h"
#include "shell_commands.h"

#ifdef MODULE_NETIF
#include "net/gnrc/pktdump.h"
#include "net/gnrc.h"
#endif

static int hello_world(int argc, char **argv){
    /* supress compiler errors */
    (void) argc;
    (void) argv;
    printf("Hello world\n");
    return 0;   
}

const shell_command_t shell_commands[] = {
    { "hello", "prints hello world", "hello_world"},
    { NULL, NULL, NULL }
};


int main(void)
{
    char line_buf[SHELL_DEFAULT_BUFSIZE];
    shell_run(NULL, line_buf, SHELL_DEFAULT_BUFSIZE);
    return 0;
}
