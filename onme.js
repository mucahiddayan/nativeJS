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
                selector:'self'
            },
            box:{
                css:{
                    position : 'fixed',
                    right    : 10,
                    top      : 100,
                    zIndex   : 10,
                    padding  : 10,
                    backgroundColor : 'rgba(0,0,0,.5)',
                    maxHeight: 300,
                    overflow : 'auto'
                }
            }
        };
        
        this.settings = Object.assign(defaults,options);
        this.elements = elements;
        this.canStart = true;

        this.positions = [];
        this.items = [];
        this.heights = [];
        this.diffs = [];
        this.wInner = window.innerHeight;
        this.bCHeight = document.body.clientHeight;
        console.log(elements);
        this.init();
        
    }
    
    init(){
        let counter = 0,
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
                console.log(1);
            }
            else if(/^data/i.test(this.settings.label.selector)){
                var data = this.settings.label.split(/\-(.+)/);
                label = this.dataset[data[1]];
                console.log(2);
            }else if(this.settings.label.selector.replace(/\s/ig,'') == ''){
                label = e.id;
                console.log(3);
            }else if(/^self$/.test(this.settings.label.selector)){
                label = e.innerText;
                console.log(4);
            }
            else{
                label = e.querySelector(this.settings.label.selector).innerText;
                console.log(5);
            }
            console.log(this.settings.label.selector,label);
            nav += `<li class="onme nav-item" id="${counter}">${label}</li>`;
            this.positions.push(offsetTop);
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
        
        this.items = document.querySelectorAll('.onme.nav-item');
        
        [].map.call(this.items,(e,i)=>{
            if(i == this.items.length-1){
                return;
            }
            this.diffs.push(this.positions[i+1]-this.positions[i]);
        });
        
        window.addEventListener('scroll',()=>{
           /*  let index = positions.findIndex(function(e,i,a){
                return e + diffs[i] - 1 >= window.scrollY;
            });
            var temp = [];
            index = index == -1 ? items.length-1:index;
            // console.log(index,items[index]);

            //if page bottom
            if(bCHeight <= wInner + window.scrollY){
                temp = [].slice.call(items);
                temp.splice(index,items.length);
                this
                .addClass(items[index],'active')
                .removeClass(temp,'active');
                console.log('bottom');
            }else if(window.scrollY == 0){

            }else{
                temp = [].slice.call(items);
                temp.splice(index,1);
                this
                .addClass(items[index],'active')
                .removeClass(temp,'active');
            } */

            let tmp = this.getOnScreen(window.scrollY),
                onScreen = tmp.removed,
                stay     = tmp.stay;
            this.active(onScreen,stay);

            
        });
        
        [].map.call(this.items,e=>{
            var offsetTop = this.positions[e.id];
            console.log(offsetTop);
            e.addEventListener('click',()=>this.goTo(offsetTop));           
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

    /**
     * 
     * @param {HTML Elements []} els 
     */
    active(els,sty){
        this
        .addClass(els,'active').removeClass(sty,'active');
    }

    /**
     * 
     * @param {int} scrollY
     * @returns {[]}
     */
    getOnScreen(scrollY){
        let temp = [].slice.call(this.items);        
        let onScreen = this.positions.filter(e=>{
            return  e >= scrollY && e <= scrollY + this.wInner;
        });
        let index = this.positions.findIndex(e=> e == this.min(onScreen));
        console.group('log');
        console.log(onScreen);
        console.log(this.min(onScreen));
        console.log(index);
        console.log(temp.splice(index,onScreen.length));
        console.log(temp);
        console.groupEnd('log');
        return { 
            removed: temp.splice(this.min(onScreen),onScreen.length),
            stay   : temp
        };        
    }
    
    /**
     * Returns a min value from array
     * @param {int[]} arr 
     * @returns {int} min
     */
    min(arr){
        return arr.sort((a,b)=>a>b)[0];
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
            top: rect.top + document.body.scrollTop+window.scrollY,
            left: rect.left + document.body.scrollLeft+window.scrollX
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