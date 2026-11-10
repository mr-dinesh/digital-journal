// Runs before first paint (loaded in <head>) so the chosen look never flashes.
(function () {
  var t = null;
  try { t = localStorage.getItem("blrw-theme"); } catch (e) {}
  if (t !== "almanac" && t !== "instrument") {
    t = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "instrument" : "almanac";
  }
  document.documentElement.setAttribute("data-theme", t);
})();
