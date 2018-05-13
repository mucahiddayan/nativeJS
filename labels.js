/**
 * @author Mücahid Dayan
 * @class Label
 */

function Label(input, delimeter = ",") {
  if (!(input instanceof HTMLElement) || input.nodeName !== "INPUT") {
    throw new Error("It is not an HTMLElement or Input Element");
  }
  this.input = input;
  this.delimeter = delimeter;
  this.init();
}

Label.prototype.wrap = function() {
  this.wrapper = document.createElement("div");
  this.wrapper.className = "labels-wrapper";
  this.input.parentNode.insertBefore(this.wrapper, this.input);
  this.wrapper.appendChild(this.input);
};

function wrapWith(element, wrapperElement) {
  let wrapper = document.createElement(wrapperElement);
  wrapper.className = wrapperElement + "-wrapper";
  element.parentNode.insertBefore(wrapper, element);
  wrapper.appendChild(element);
}

Label.prototype.init = function() {
  this.input.style.display = "none";
  

  this.labels;
  this.wrap();
  this.update();

  this.createdInput = document.createElement("input");
  this.createdInput.placeholder = this.createdInput.title = "Add";
  this.createdInput.type = this.input.type;
  if(this.input.pattern){
    this.createdInput.pattern = this.input.pattern;
  }
  
  this.createdInput.required = true;
  this.input.insertAdjacentElement("beforebegin", this.createdInput);
  wrapWith(this.createdInput, "form");

  this.input.addEventListener("input", () => this.update());

  this.createdInput.parentNode.addEventListener("submit", (e) => {
    e.preventDefault();
    let labelsToAdd = splitToUniqArray(this.createdInput.value, this.delimeter);
    this.labels.push(...labelsToAdd);
    this.updateValue();
    this.update();
    if (
      this.inputEnterCallback &&
      typeof this.inputEnterCallback === "function"
    ) {
      labelsToAdd.map(label => this.inputEnterCallback(label));
    }
    this.createdInput.value = "";
  });
  /*
  this.createdInput.addEventListener("keydown", e => { 
    if (e.code === "Enter") {
      e.preventDefault();
      let labelsToAdd = splitToUniqArray(
        this.createdInput.value,
        this.delimeter
      );
      this.labels.push(...labelsToAdd);
      this.updateValue();
      this.update();
      if (
        this.inputEnterCallback &&
        typeof this.inputEnterCallback === "function"
      ) {
        labelsToAdd.map(label => this.inputEnterCallback(label));
      }
      this.createdInput.value = "";
    }
  }); */
};

Label.prototype.changePlaceholder = function(placeholder) {
  this.createdInput.placeholder  = placeholder;
};

Label.prototype.changeTitle = function(title){
  this.createdInput.title = title;
}

Label.prototype.changePattern = function(pattern){
  this.createdInput.pattern = pattern;
}

Label.prototype.updateValue = function() {
  this.input.value = uniqArray(this.labels).join(this.delimeter);
  triggerOnInputEvent(this.input);
};

Label.prototype.update = function() {
  this.updateLabels();
  this.createLabels();
  this.initLabelsbox();
  this.addEventListenerToCloseButtons();
};

Label.prototype.updateLabels = function() {
  this.labels = splitToUniqArray(this.input.value, this.delimeter);
  // this.labels = uniqArray(this.labels);
};

Label.prototype.createLabels = function() {
  this.labelsBox = `<div class="label-box">`;
  this.labels.map(label => {
    if (label.replace(/\s/g, "") !== "") {
      this.labelsBox += `<div class="label">
            <div class="remove-label" data-label=${label}>✖</div>
            <span>${label}</span>
        </div>`;
    }
  });
  this.labelsBox += "</div>";
};

Label.prototype.addCallbackToCloseButtons = function(fn) {
  if (fn && typeof fn === "function") {
    this.closebuttonCallback = fn;
  }
};

Label.prototype.addCallbackToInputEnter = function(fn) {
  if (fn && typeof fn === "function") {
    this.inputEnterCallback = fn;
  }
};

Label.prototype.addEventListenerToCloseButtons = function() {
  let closeButtons = this.input.parentNode.querySelectorAll(
    ".label-box .remove-label"
  );
  let fn = button => {
    this.labels.splice(this.labels.indexOf(button.dataset.label), 1);
    button.removeEventListener("click", fn);
    this.updateValue();
    this.update();
    if (
      this.closebuttonCallback &&
      typeof this.closebuttonCallback === "function"
    ) {
      this.closebuttonCallback(button.dataset.label);
    }
  };
  [].map.call(closeButtons, button => {
    button.addEventListener("click", () => {
      fn(button);
    });
  });
};

Label.prototype.initLabelsbox = function() {
  let lb = this.input.parentNode.querySelector(".label-box");
  if (lb) {
    lb.remove();
  }
  this.input.insertAdjacentHTML("afterend", this.labelsBox);
};

function splitToUniqArray(string, delimeter = ",") {
  return uniqArray(string.split(delimeter));
}

function uniqArray(array) {
  let temp = [];
  array.map(e => {
    if (!temp.includes(e) && e) {
      temp.push(e);
    }
  });
  return temp;
}

function triggerOnInputEvent(el) {
  var event = new Event("input", {
    bubbles: true,
    cancelable: true
  });
  el.dispatchEvent(event);
}

HTMLElement.prototype.splitIntoLabels = function(delimeter = ",") {
  let label = new Label(this, delimeter);
  return label;
};
