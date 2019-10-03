# composite avatar

Simply use canvas to make composite avatars.

![screenshot-1](images/screenshot-1.png)

![screenshot-2](images/screenshot-2.png)

## Note

If you encounter the following error with Chrome, you may want to try [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb), which serves web pages from a local folder using HTTP.

```
Uncaught DOMException: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
```

Or install `http-server` globally using node's package manager:

```
npm install -g http-server
```

Then simply run `http-server` in this project directory.
