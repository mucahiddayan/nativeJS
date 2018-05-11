/**
 * @author Mücahid Dayan
 */

function Label(input,delimeter=','){
    console.log(input);
    if(!(input instanceof HTMLElement) || input.nodeName !== 'INPUT'){
        throw new Error('It is not an HTMLElement or Input Element');
    }
    this.input = input;
    this.delimeter = delimeter;
    this.init();
    
}

Label.prototype.wrap = function(){
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'labels-wrapper';
    this.input.parentNode.insertBefore(this.wrapper,this.input);
    this.wrapper.appendChild(this.input);
}

Label.prototype.init = function(){
    this.input.style.display = 'none';
    this.labels;
    this.wrap();
    this.update();
    this.createdInput = document.createElement('input');
    this.createdInput.placeholder = 'Add';
    this.input.insertAdjacentElement('beforebegin', this.createdInput);
    this.input.addEventListener('input', () => this.update());
    this.createdInput.addEventListener('keydown',(e)=>{
        if(e.code === 'Enter'){
            let labelsToAdd = splitToUniqArray(this.createdInput.value,this.delimeter);            
            this.labels.push(...labelsToAdd);            
            this.updateValue();
            this.update();
            
            console.log(labelsToAdd,this.labels);
           
            this.createdInput.value = '';
        }
    });    
}

Label.prototype.updateValue = function(){
    this.input.value = uniqArray(this.labels).join(this.delimeter);
    triggerOnInput(this.input);
}

Label.prototype.update = function(){
    this.updateLabels();
    this.createLabels();
    this.initLabelsbox();
    this.addEventListenerToCloseButtons();
}

Label.prototype.updateLabels = function(){
    this.labels = splitToUniqArray(this.input.value,this.delimeter);
    // this.labels = uniqArray(this.labels);
}

Label.prototype.createLabels = function(){
    this.labelsBox =  `<div class="label-box">`;
    this.labels.map(label => {
        if (label.replace(/\s/g, '') !== '') {
            this.labelsBox += `<div class="label">
            <div class="remove-label" data-label=${label}>✖</div>
            <span>${label}</span>
        </div>`;
        }

    });
    this.labelsBox += '</div>';
}

Label.prototype.addEventListenerToCloseButtons = function(){
    let closeButtons = document.querySelectorAll('.label-box .remove-label');
    let fn = (button)=>{
        console.info('remove-label clicked');
            this.labels.splice(this.labels.indexOf(button.dataset.label),1);
            button.removeEventListener('click',fn);
            this.updateValue();
            this.update();
    };
    [].map.call(closeButtons,button=>{
        button.addEventListener('click',()=>{
            fn(button);            
        });
    });
}

Label.prototype.initLabelsbox = function(){
    let lb = this.input.parentNode.querySelector('.label-box');
        if (lb) {
            lb.remove();
        }
        this.input.insertAdjacentHTML('afterend', this.labelsBox);
}

function splitToUniqArray(string,delimeter=','){
    return uniqArray(string.split(delimeter));
}

function uniqArray(array) {
    let temp = [];
    array.map(e => { if (!temp.includes(e) && e) { temp.push(e) } });
    return temp;
}



HTMLElement.prototype.stringToLabel = function (delimeter = ',') {
    let label = new Label(this,delimeter);
}

function triggerOnInput(el) {
    var event = new Event('input', {
        'bubbles': true,
        'cancelable': true
    });
    el.dispatchEvent(event);
    console.info('onInput dispatched');
}

