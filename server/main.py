#!/usr/bin/env python
"""
The Little Doctor

@author: mandatory, moloch, shubs
"""

import os

from tornado.options import define, options

####### Command Line Options #######
define("hostname",
       group="application",
       default=os.environ.get("HOSTNAME", "example.com"),
       help="the domain the server is hosted on",
       type=str)

define("scheme",
       group="application",
       default=os.environ.get("SCHEME", "http"),
       help="define if the server should load js modules over http/https",
       type=str)

define("listen_port",
       group="application",
       default=os.environ.get("PORT", "8888"),
       help="run instances starting the given port",
       type=str)

define("cookie_secret",
       group="application",
       default=os.environ.get("COOKIE_SECRET", os.urandom(32).encode("hex")),
       help="cookie secret",
       type=str)

define("data_directory",
       group="application",
       default=os.environ.get("DATA_DIRECTORY", "./files/"),
       help="where to place all the data file(s)",
       type=str)

define("x_headers",
       group="application",
       default=bool(os.environ.get("X_HEADERS", False)),
       help="honor the `X-FORWARDED-FOR` and `X-REAL-IP` http headers",
       type=bool)

define("debug",
       group="application",
       default=bool(os.environ.get("DEBUG", False)),
       help="start the server in debug mode",
       type=bool)

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    from server import start_app
    options.parse_command_line()
    start_app()
