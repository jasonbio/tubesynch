(function () {
    var opts = {};
    if (location.protocol === "https:") {
        opts.secure = true;
    }
    window.socket = io.connect(IO_URL, opts);
    window.socket.on("connect", function () {
        window.socket.emit("initSearch");
    });

    window.socket.on("errMessage", function (data) {
        alert(data.msg);
    });
})();

(function () {
    var doSearch = function () {
        //if ($("#clookup-value").val().trim() === "") {
        //    alert("You must enter a search term");
        //    return false;
        //}
        socket.emit("list-channels", {
            value: $("#clookup-value").val().replace(/ /g,'')
        });
    };

    $("#clookup-submit").click(doSearch);
    $("#clookup-value").keyup(function (ev) {
        if (ev.keyCode === 13) {
            doSearch();
        }
    });
})();

socket.on("list-channels", function (channels) {
    var tbl = $("#channel-lookup table");
    tbl.data("entries", channels);
    var p = tbl.data("paginator");
    if (p) {
        p.paginator.remove();
    }

    var opts = {
        preLoadPage: function () {
            tbl.find("tbody").remove();
        },

        generator: function (c, page, index) {
            var tr = $("<tr/>").appendTo(tbl);
            var td = $("<td/>").appendTo(tr);
            var clink = $("<a/>").text(c.name).appendTo(td);
            clink.attr("href", "/r/"+c.name);
        }
    };

    p = Paginate(channels, opts);
    p.paginator.css("margin-top", "20px");
    p.paginator.insertBefore(tbl);
    tbl.data("paginator", p);
});

/* Initialize keyed table sorts */
$("table").each(function () {
    var table = $(this);
    var sortable = table.find("th.sort");
    sortable.each(function () {
        var th = $(this);
        th.click(function () {
            var p = table.data("paginator");
            if (!p) {
                return;
            }
            var key = th.attr("data-key");
            if (!key) {
                return;
            }
            var asc = -th.attr("data-sort-direction") || -1;
            th.attr("data-sort-direction", asc);
            var entries = table.data("entries") || [];
            entries.sort(function (a, b) {
                return a[key] === b[key] ? 0 : asc*(a[key] > b[key] ? 1 : -1);
            });
            table.data("entries", entries);
            p.items = entries;
            p.loadPage(0);
        });
    });
});
