function createFixedBox(id = "") {
  let box = document.createElement("div");
  box.style.position = "fixed";
  if (id) {
    box.id = id;
  }
  box.className = "fixed-box";
  box.style.zIndex = 99999;
  return box;
}

function clearPositions(box) {
  let positions = ["top", "bottom", "left", "right"];
  positions.forEach(pos => {
    box.style[pos] = "";
  });
}

function createContentBox(className = "content-box") {
  let contentBox = document.createElement("div");
  contentBox.className = className;
  return contentBox;
}

function PopUp(id) {
  if (!id) {
    throw new Error("PopUp must have an ID!");
  }
  let box = document.querySelector(".fixed-box#" + id);

  this.getBox = function() {
    if (box && typeof box !== "string") {
      return box;
    } else if (box === "removed") {
      return null;
    } else {
      box = createFixedBox(id);
      document.body.appendChild(box);
      return box;
    }
  };

  this.remove = function() {
    if (!this.getBox()) {
      return;
    }
    this.getBox().remove();
    box = "removed";
  };

  Object.freeze(this);
}

PopUp.prototype.setPosition = function(position = "bottom") {
  if (!this.getBox()) {
    return;
  }
  clearPositions(this.getBox());
  this.getBox().style[position] = 0;
  return this;
};

PopUp.prototype.setStyle = function(style = {}) {
  if (!this.getBox()) {
    return;
  }
  for (let s of Object.keys(style)) {
    this.getBox().style[s] = style[s];
  }
  return this;
};

PopUp.prototype.addText = function(text = "") {
  if (!this.getBox()) {
    return;
  }
  let textBox = createContentBox("fb text-box");
  textBox.innerText = text;
  this.getBox().appendChild(textBox);
  return this;
};

PopUp.prototype.addHTML = function(html = "") {
  if (!this.getBox()) {
    return;
  }
  let htmlBox = createContentBox("fb html-box");
  htmlBox.innerHTML = html;
  this.getBox().appendChild(htmlBox);
  return this;
};

var pup;
document.addEventListener("DOMContentLoaded", () => {
  pup = new PopUp("datenschutz");
  pup.setPosition("bottom").setStyle({
    width: "100%",
    height: "30px",
    left: 0,
    backgroundColor: "red"
  });
});
