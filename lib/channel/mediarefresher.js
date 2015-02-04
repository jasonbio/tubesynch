var ChannelModule = require("./module");
var Config = require("../config");
var InfoGetter = require("../get-info");
var Logger = require("../logger");

function MediaRefresherModule(channel) {
    ChannelModule.apply(this, arguments);
    this._interval = false;
    this._media = null;
}

MediaRefresherModule.prototype = Object.create(ChannelModule.prototype);

//MediaRefresherModule.prototype.onMediaChange = function (data) {
MediaRefresherModule.prototype.onPreMediaChange = function (data, cb) {
    if (this._interval) clearInterval(this._interval);

    this._media = data;

    switch (data.type) {
        case "gd":
            //return this.initGoogleDocs(data);
            return this.initGoogleDocs(data, function () {
                cb(null, ChannelModule.PASSTHROUGH);
            });
        case "vi":
            //return this.initVimeo(data);
            return this.initVimeo(data, function () {
                cb(null, ChannelModule.PASSTHROUGH);
            });
        default:
            return cb(null, ChannelModule.PASSTHROUGH);
    }
};

//MediaRefresherModule.prototype.initGoogleDocs = function (data) {
MediaRefresherModule.prototype.initGoogleDocs = function (data, cb) {
    var self = this;
    //self.refreshGoogleDocs(data, true);
    self.refreshGoogleDocs(data, cb);

    /*
     * Refresh every 55 minutes.
     * The expiration is 1 hour, but refresh 5 minutes early to be safe
     */
    self._interval = setInterval(function () {
        //self.refreshGoogleDocs(data, false);
        self.refreshGoogleDocs(data);
    }, 55 * 60 * 1000);
};

//MediaRefresherModule.prototype.initVimeo = function (data) {
MediaRefresherModule.prototype.initVimeo = function (data, cb) {
    if (!Config.get("vimeo-workaround")) {
        if (cb) cb();
        return;
    }

    var self = this;
    self.channel.activeLock.lock();
    InfoGetter.vimeoWorkaround(data.id, function (hack) {
        if (self._media === data) {
            self.channel.logger.log("[mediarefresher] Refreshed vimeo video with ID " +
                data.id);
            data.meta.direct = hack;
            //self.channel.broadcastAll("changeMedia", data.getFullUpdate());
        }
        self.channel.activeLock.release();

        if (cb) cb();
    });
};

//MediaRefresherModule.prototype.refreshGoogleDocs = function (media, update) {
MediaRefresherModule.prototype.refreshGoogleDocs = function (media, cb) {
    var self = this;

    if (self.dead || self.channel.dead) {
        return;
    }

    self.channel.activeLock.lock();
    InfoGetter.getMedia(media.id, "gd", function (err, data) {
        switch (err) {
            case "HTTP 302":
            case "Video not found":
            case "Private video":
                return;
            default:
                if (err) {
                    Logger.errlog.log("Google Docs refresh failed for ID " + media.id +
                        ": " + err);
                    //return self.channel.activeLock.release();
                    self.channel.activeLock.release();
                    if (cb) cb();
                    return;
                }
        }

        if (media !== self._media) {
            //return self.channel.activeLock.release();
            self.channel.activeLock.release();
            if (cb) cb();
            return;
        }

        self.channel.logger.log("[mediarefresher] Refreshed Google Docs video with ID " +
            media.id);
        media.meta = data.meta;
        //if (update) {
        //    self.channel.broadcastAll("changeMedia", data.getFullUpdate());
       // }
        self.channel.activeLock.release();
        if (cb) cb();
    });
};

module.exports = MediaRefresherModule;