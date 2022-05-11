import sslChecker from "ssl-checker";
import express from "express";
import urlExist from "url-exist";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", {
    data: "",
    invalid: false,
  });
});

function removeHttp(url) {
  if (url.startsWith("https://www.")) {
    const http = "https://www.";
    return url.slice(http.length);
  }

  if (url.startsWith("http://www.")) {
    const http = "http://www.";
    return url.slice(http.length);
  }

  if (url.startsWith("https://")) {
    const https = "https://";
    return url.slice(https.length);
  }

  if (url.startsWith("http://")) {
    const http = "http://";
    return url.slice(http.length);
  }

  if (url.startsWith("www.")) {
    const http = "www.";
    return url.slice(http.length);
  }

  return url;
}

function addHttp(url) {
  if (!/^https?:\/\//i.test(url)) {
    return "http://" + url;
  }
}

function checkHttppresent(url) {
  if (url.indexOf("http://") == 0 || url.indexOf("https://") == 0) {
    return true;
  } else {
    return false;
  }
}

app.post("/getsslinfo", async (req, res) => {
  let exists;
  let httpPresent = checkHttppresent(req.body.domain);
  console.log(httpPresent);
  if (httpPresent) {
    exists = await urlExist(req.body.domain);
  } else {
    exists = await urlExist(addHttp(req.body.domain));
  }
  console.log(exists);
  if (exists) {
    //let domain = req.body.domain;
    var domain = removeHttp(req.body.domain);
    console.log(domain);

    getSslDetails(domain).then((response) => {
      console.log(response);

      res.render("index", {
        data: response,
        invalid: false,
      });
    });
  } else {
    res.render("index", {
      data: "",
      invalid: true,
    });
  }
});

const getSslDetails = async (hostname) => await sslChecker(hostname);

app.listen(5000, () => {
  console.log("App is listening on port 5000");
});
