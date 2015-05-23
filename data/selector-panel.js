(function () {
  "use strict";

  let list = document.querySelector(".item-list");
  let filter = document.querySelector(".filter");
  filter.addEventListener("input", filterItems);

  self.port.on("select", populatePanel);
  self.port.on("reset", reset);
  self.port.on("error", showView.bind(null, "error"));

  function populatePanel(items, domain) {
    // Reset the dialog in case something has gone wrong.
    reset();

    // Append items to the list.
    for (let item of items) {
      let el = document.createElement("li");
      el.textContent = item;
      el.addEventListener("click", onItemSelected);
      list.appendChild(el);
    }

    filter.value = domain;
    filterItems();

    // Show the list.
    showView("select");
  }

  function filterItems() {
    let value = filter.value;
    for (let item of list.querySelectorAll("li")) {
      let iv = item.textContent;
      if (iv.includes(value)) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    }
  }

  function onItemSelected(ev) {
    self.port.emit("item-selected", ev.target.textContent);
  }

  function reset() {
    for (let item of document.querySelectorAll(".item-list li")) {
      item.remove();
    }

    showView("loading");
  }

  function showView(view) {
    document.querySelector(".view-active").classList.remove("view-active");
    document.querySelector("[data-view='" + view + "']").classList.add("view-active");
  }
}());