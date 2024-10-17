import onReady from "./modules/onReady.min.js";
import getUrlParam from "./modules/getUrlParam.min.js";

onReady(() => {
  let pageUrl = getUrlParam("url");

  if (pageUrl){
    localStorage.setItem("page_url", pageUrl);
  } else {
    pageUrl = localStorage.getItem("page_url");
    if (pageUrl){
      window.location.replace(`/signatures?url=${encodeURIComponent(pageUrl)}`);
    } else {
      window.location.replace("/");
    }
  }
});
