/**
* @author Mücahid Dayan <muecahid@dayan.one>
*/

class Onme{
    
    /**
    * 
    * @param {HTML Object []} elements 
    * @param {Object} options 
    */
    constructor(elements,options={}){
        if(typeof elements == 'undefined' || !elements.length){
            return;
        }
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
        
        this.settings = Object.assign(defaults,options);
        this.elements = elements;
        this.canStart = true;
        console.log(elements);
        this.init();
        
    }
    
    init(){
        let positions = [],
        items = [],
        heights = [],
        diffs = [],
        counter = 0,
        nav = '<div class="onme-wrapper"><ul class="onme nav-items">';
        
        [].map.call(this.elements, e =>{
            if(e.innerText == ''){
                console.warn('Empty object',e.innerText);
                this.canStart = false;
                return;
            }
            console.log(e);
            
            let offsetTop = this.offset(e).top;
            let label = '';
            
            if(this.settings.label.selector.toLowerCase() == 'id'){
                label = e.id;
            }
            else if(/data/i.test(this.settings.label.selector)){
                var data = this.settings.label.split(/\-(.+)/);
                label = this.dataset[data[1]];
            }
            else{
                label = e.querySelector(this.settings.label.selector).innerText;
            }
            console.log(this.settings.label.selector,label);
            nav += `<li class="onme nav-item" id="${counter}">${label}</li>`;
            positions.push(offsetTop);
            counter++;
            
        });
        
        /** if something went wrong on creating nav array, returns false to break */
        if(!this.canStart){
            console.warn('Can not start');
            return;
        }
        
        nav += '</ul><span id="log"></span></div>';
        
        if(!document.querySelectorAll('.nav-items').length){
            this
            .prepend(nav,document.body)
            .css(document.querySelector('.onme-wrapper'),this.settings.box.css);
        }
        
        items = document.querySelectorAll('.onme.nav-item');
        
        [].map.call(items,(e,i)=>{
            if(i == items.length-1){
                return;
            }
            diffs.push(positions[i+1]-positions[i]);
        });
        
        window.addEventListener('scroll',()=>{
            let index = positions.findIndex(function(e,i,a){
                return e + diffs[i] - 1 >= window.scrollY;
            });

            index = index == -1 ? items.length-1:index;
            console.log(index,items[index]);
            this
            .addClass(items[index],'active')
            .removeClass(this.siblings(items[index]),'active');
        });
        
        [].map.call(items,e=>{
            var offsetTop = positions[e.id];
            e.addEventListener('click',this.goTo(offsetTop));           
        });
        
        let styleCSS = `<style type="text/css">
        .nav-item{transition:color ${this.settings.text.transition}s;color:${this.settings.text.color};}
        .nav-item.active {
            color: ${this.settings.text.active.color};
            transition:color ${this.settings.text.transition}s;
        }
        </style>`;
        this.append(styleCSS,document.body)
    }
    
    /**
    * scroll to given pixel
    * @param {int} px 
    */
    goTo(px){
        window.scroll(0,px);
    }
    
    /************************** jQuery Replacement **************************/
    
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
    * @returns {onme intance}
    */
    css(el,styles){
        if(typeof el == 'undefined' || el == null || Array.isArray(styles)){
            return;
        }
        for(let k in styles){
            let v = styles[k].toString().replace(/px/ig,'');         
            let suffix = isNaN(v)?'':'px';
            if(/^(margin|padding)$/i.test(k)){                
                el.style[k] = `${v}${suffix} ${v}${suffix} ${v}${suffix} ${v}${suffix}`;
            }else if(/^(opacity|zIndex|z\-index)$/i.test(k)){
                el.style[k] = `${v}`;
            }else{
                el.style[k] = `${v}${suffix}`;
            }
        }
        return this;
    }
    
    /**
    * Add element to parent element 
    * @param {HTML Element} el 
    * @param {HTML Element} parent
    * @returns {onme intance}
    */
    prepend(el,parent){
        parent.insertAdjacentHTML('afterbegin', el);
        return this;
    }
    
    /**
    * 
    * @param {String <html element>} el 
    * @param {HTML Element} parent
    * @returns {onme intance}
    */
    append(el,parent){
        parent.insertAdjacentHTML('beforeend', el);
        return this;
    }
    
    /**
    * Adds class name to element
    * @param {HTML Element} el 
    * @param {String} className 
    * @returns {onme intance}
    */
    addClass(el,className){
        if(typeof el == 'undefined') return this;
        
        const init = function(el){
            if (el.classList){
                try{
                    el.classList.add(className);
                }catch(e){
                    console.warn(e);
                    console.info(el);
                }
            }
            else{
                try{
                    el.className += ' ' + className;
                }
                catch(e){
                    console.warn(e);
                    console.info(el);
                }
            }
        };      
        
        if(el.length){
            [].map.call(el,e=>init(e)); 
        }else{
            init(el)
        }
               
        return this;
    }
    
    /**
    * Removes class name from element
    * @param {HTML Element} el 
    * @param {String} className 
    * @returns {onme intance}
    */
    removeClass(el,className){
        if(typeof el == 'undefined') return this;
        const init = function(el){
            if (el.classList){
                try{
                    el.classList.remove(className);
                }catch(e){
                    console.warn(e);
                    console.info(el);
                }
            }
            else{
                try{
                    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                }catch(e){
                    console.warn(e);
                    console.info(el.className);
                }                
            }            
        };
        if(el.length){
            [].map.call(el,e=>init(e)); 
        }else{
            init(el)
        }
        return this;
    }
    
    /**
    * Returns the sibling of given element
    * @param {HTML Element} el
    * @returns {HTML Element []} 
    */
    siblings(el){
        return typeof el == 'undefined'?[]:[].filter.call(el.parentNode.children,(e)=> e !== el);
    }
    
}