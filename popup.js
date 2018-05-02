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
  if (box) {
    console.warn(`A PopUp with ID "${id}" exists already!`);
    this.box = box;
  } else {
    this.box = createFixedBox(id);
    document.body.appendChild(this.box);
  }
}

PopUp.prototype.setPosition = function(position = "bottom") {
  clearPositions(this.box);
  this.box.style[position] = 0;
  return this;
};

PopUp.prototype.setStyle = function(style = {}) {
  for (let s of Object.keys(style)) {
    this.box.style[s] = style[s];
  }
  return this;
};

PopUp.prototype.addText = function(text = "") {
  let textBox = createContentBox("fb text-box");
  textBox.innerText = text;
  this.box.appendChild(textBox);
  return this;
};

PopUp.prototype.addHTML = function(html=''){
	let htmlBox = createContentBox('fb html-box');
	htmlBox.innerHTML = html;
	this.box.appendChild(htmlBox);
	return this;
}

var pup;
document.addEventListener("DOMContentLoaded", () => {
  pup = new PopUp("datenschutz");
  pup.setPosition("bottom").setStyle({
    width: "100%",
	height: "30px",
	left:0,
    backgroundColor: "red"
  });
});
