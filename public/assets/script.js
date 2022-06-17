document.addEventListener("DOMContentLoaded", () => {
  function reportData() {
    const name = document.querySelector("#input-name").value;
    window.sendData = setInterval(() => {
      if (window.active) {
        let data = {};
        navigator.geolocation.getCurrentPosition(function (location) {
          data = {
            name: name,
            lat: location.coords.latitude + window.locOffsetY,
            lon: location.coords.longitude + window.locOffsetX,
          };
          document.querySelector("#text-lat").innerHTML =
            "Latitude: " + data.lat;
          document.querySelector("#text-lon").innerHTML =
            "Longitude: " + data.lon;
          fetch("/report-data", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) console.log("data sent");
              else console.log("data not sent : " + data.message);
            });
          console.log(data);
        });
        // check gps error
        setTimeout(() => {
          if (!Object.keys(data).length) {
            document.querySelector("#warning-gps").classList.remove("hidden");
            document.querySelector("#warning-gps").classList.add("flex");
            onNonactive();
            clearInterval(window.sendData);
          }
        }, 60000);
      } else {
        onNonactive();
        clearInterval(window.sendData);
      }
    }, 2000);
  }
  function onActive() {
    window.active = true;
    document.querySelector("#input-name").disabled = true;
    document.querySelector("#btn-on").disabled = true;
    document.querySelector("#btn-off").disabled = false;
    document.querySelector("#warning-tracked").classList.remove("hidden");
    document.querySelector("#warning-tracked").classList.add("flex");
    document.querySelector("#warning-gps").classList.add("hidden");
    document.querySelector("#warning-gps").classList.remove("flex");
    reportData();
  }
  function onNonactive() {
    window.active = false;
    document.querySelector("#input-name").disabled = false;
    document.querySelector("#btn-on").disabled = false;
    document.querySelector("#btn-off").disabled = true;
    document.querySelector("#warning-tracked").classList.add("hidden");
    document.querySelector("#warning-tracked").classList.remove("flex");
  }
  document.querySelector("#form-1").addEventListener("submit", (e) => {
    e.preventDefault();
    onActive();
  });
  document.querySelector("#btn-off").addEventListener("click", () => {
    onNonactive();
  });

  // Button arrow handler
  var mouseTimer;
  var mouseTimer2;
  window.locOffsetX = 0;
  window.locOffsetY = 0;
  let step = 0.00089;
  function mouseDown(button) {
    mouseUp();
    mouseTimer = window.setTimeout(() => execMouseDown(button), 1000);
  }
  function mouseUp() {
    if (mouseTimer) window.clearTimeout(mouseTimer);
    if (mouseTimer2) window.clearTimeout(mouseTimer2);
  }
  function execMouseDown(button) {
    let direction = String(button.id).split("-")[1];
    switch (direction) {
      case "up":
        mouseTimer2 = window.setInterval(() => {
          window.locOffsetY += step;
        }, 200);
        break;
      case "down":
        mouseTimer2 = window.setInterval(() => {
          window.locOffsetY -= step;
        }, 200);
        break;
      case "left":
        mouseTimer2 = window.setInterval(() => {
          window.locOffsetX -= step;
        }, 200);
        break;
      case "right":
        mouseTimer2 = window.setInterval(() => {
          window.locOffsetX += step;
        }, 200);
        break;
      default:
        break;
    }
  }
  function mouseClick(button) {
    let direction = String(button.id).split("-")[1];
    switch (direction) {
      case "up":
        window.locOffsetY += step;
        break;
      case "down":
        window.locOffsetY -= step;
        break;
      case "left":
        window.locOffsetX -= step;
        break;
      case "right":
        window.locOffsetX += step;
        break;
      default:
        break;
    }
  }
  var buttons = document.querySelectorAll(".button-arrow");
  Array.from(buttons).forEach((button) => {
    button.addEventListener("mousedown", () => mouseDown(button));
    button.addEventListener("click", () => mouseClick(button));
  });
  document.body.addEventListener("mouseup", mouseUp);
});
