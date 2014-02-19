(function () {
  var c = document.cookie.split(";").map(function (s) {
    return s.trim();
  });

  var theme = "default";
  for (var i = 0; i < c.length; i++) {
    if (c[i].indexOf("cytube-theme=") === 0) {
      theme = c[i].split("=")[1];
      break;
    }
  }

  console.log("cookie theme=", theme);

  if (theme !== "default") {
    var cur = document.getElementById("usertheme");
    cur.parentNode.removeChild(cur);
    console.log('removed');
    var css = document.createElement("link");
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("type", "text/css");
    css.setAttribute("href", theme);
    css.setAttribute("id", "usertheme");
    document.head.appendChild(css);
    console.log(css);
  }
})();
