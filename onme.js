/**
* @author Mücahid Dayan <muecahid@dayan.one>
*/

class Onme{
    
    /**
    * 
    * @param {HTML Object []} elements 
    * @param {Object} options 
    */
    constructor(elements,options){
        var defaults = {
            text:{
                color:'#333',
                active:{
                    color:'#fff'
                },
                transition:.5
            },
            label:{
                selector:'id'
            },
            box:{
                css:{
                    position : 'fixed',
                    right    : 10,
                    top      : 100,
                    zIndex   : 10,
                    padding  : 10,
                    backgroundColor : 'rgba(0,0,0,.5)'
                }
            }
        };
        
        this.elements = elements;
        this.each = [].map.call();
    }
    
    init(){
        let settings = Object.assign(defaults,options);
        positions = [],
        items = [],
        heights = [],
        diffs = [],
        counter = 0,
        nav = '<div class="onme-wrapper"><ul class="onme nav-items">';
        
        this.each(this.elements,(e)=>{
            if(e.innerText !== ''){
                return;
            }
            
            let offsetTop = this.offset(e).top;
            let label = '';
            
            if(this.settings.label.selector.toLowerCase() == 'id'){
                label = this.id;
            }
            else if(/data/i.test(this.settings.label.selector)){
                var data = this.settings.label.split(/\-(.+)/);
                label = this.dataset[data[1]];
            }
            else{
                label = el.querySelector(this.settings.label.selector).innerText;
            }
            console.log(this.settings.label.selector,label);
            nav += `<li class="onme nav-item" id="${counter}">${label}</li>`;
            positions.push(offsetTop);
            counter++;
            
        });
        
        nav += '</ul><span id="log"></span></div>';
        
        if(document.querySelectorAll('.nav-items').length){
            this.prepend(e,document.body);
            this.css(e,settings.box.css);
        }
        
        items = document.querySelectorAll('.onme.nav-item');
        
        this.each(items,(e,i)=>{
            if(i == items.length-1){
                return;
            }
            diffs.push(positions[i+1]-positions[i]);
        });
        
        window.addEventListener('scroll',()=>{
            let index = positions.findIndex(function(e,i,a){
                return e+diffs[i]-1 >= window.scrollY;
            });

            this.addClass(items[index],'active');
            this.removeClass(items[index],'active');
        });
        
    }
    
    /**
    * Returns the distance between element and window top
    * @param {HTML Element} el 
    * @returns {Object} offset top and offset left
    */
    offset(el){
        var rect = el.getBoundingClientRect();
        
        return {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft
        }
    }
    
    /**
    * Sets to given element css styles
    * @param {HTML Element} el 
    * @param {Object} style 
    */
    css(el,styles){
        if(typeof el == 'undefined' || el == null || Array.isArray(styles)){
            return;
        }
        for(let k in styles){
            let v = styles[k].toString().replace(/px/ig,'');         
            if(/^(margin|padding)$/i.test(k)){                
                el.style[k] = `${v}px ${v}px ${v}px ${v}px`;
            }else{
                el.style[k] = `${v}`;
            }
        }
    }
    
    /**
    * Add element to parent element 
    * @param {HTML Element} el 
    * @param {HTML Element} parent 
    */
    prepend(el,parent){
        parent.insertBefore(el, parent.firstChild);
    }
    
    /**
    * Adds class name to element
    * @param {HTML Element} el 
    * @param {String} className 
    */
    addClass(el,className){
        if (el.classList){
            el.classList.add(className);
        }
        else{
            el.className += ' ' + className;
        }
    }
    
    /**
     * Removes class name from element
     * @param {HTML Element} el 
     * @param {String} className 
     */
    removeClass(el,className){
        if (el.classList){
            el.classList.remove(className);
        }
        else{
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }
    
    /**
     * Returns the sibling of given element
     * @param {HTML Element} el
     * @returns {HTML Element []} 
     */
    siblings(el){
        return [].filter.call(el.parentNode.children,(e)=> e !== el);
    }
    
}