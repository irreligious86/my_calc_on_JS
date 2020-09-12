const createEl = (tagname) => document.createElement(tagname);
const appendTo = (elem, parent) => parent.append(elem);
const render = (elem, data, cb) => data.forEach(x => appendTo(cb(x), elem)) ;
const addClass = (elem, classname) => elem.classList.add(classname); 
const addStyles = (elem, styles={}) => {
  let cssText = '';
  for (let key in styles) {
    cssText += `${key}: ${styles[key]};`;
  }
  elem.style.cssText = cssText;
};

class EventObserver {
  constructor () { this.observers = []   }
  subscribe (fn) { this.observers.push(fn)   }
  unsubscribe (fn) { this.observers = this.observers.filter(subscriber => subscriber !== fn)   }
  broadcast (data) { this.observers.forEach(subscriber => subscriber(data))   }
};

const observer = new EventObserver();

const state = {
  nums: [],
  value: '0',
  
};

observer.broadcast(state);

const TYPES = {
  NUMERIC: 'NUMERIC',
  OPERATOR: 'OPERATOR',
  DISPLAY: 'DISPLAY',
};
const Num = ({ value, type, name, tag }) => ({ value, type, name, tag });

state.nums = [
  Num({value: 1, type: TYPES.NUMERIC, name: 'Numpad1', tag: 'button'}),
  Num({value: 2, type: TYPES.NUMERIC, name: 'Numpad2', tag: 'button'}),
  Num({value: 3, type: TYPES.NUMERIC, name: 'Numpad3', tag: 'button'}),
  Num({value: 4, type: TYPES.NUMERIC, name: 'Numpad4', tag: 'button'}),
  Num({value: 5, type: TYPES.NUMERIC, name: 'Numpad5', tag: 'button'}),
  Num({value: 6, type: TYPES.NUMERIC, name: 'Numpad6', tag: 'button'}),
  Num({value: 7, type: TYPES.NUMERIC, name: 'Numpad7', tag: 'button'}),
  Num({value: 8, type: TYPES.NUMERIC, name: 'Numpad8', tag: 'button'}),
  Num({value: 9, type: TYPES.NUMERIC, name: 'Numpad9', tag: 'button'}),
  Num({value: 0, type: TYPES.NUMERIC, name: 'Numpad0', tag: 'button'}),
  Num({value: '.', type: TYPES.NUMERIC, name: 'NumpadDot', tag: 'button'}),
  Num({value: '+', type: TYPES.NUMERIC, name: 'NumPlus', tag: 'button'}),
  Num({value: '-', type: TYPES.NUMERIC, name: 'NumMinus', tag: 'button'}),
  Num({value: '*', type: TYPES.NUMERIC, name: 'NumMulti', tag: 'button'}),
  Num({value: '/', type: TYPES.NUMERIC, name: 'NumDiv', tag: 'button'}),
  Num({value: '=', type: TYPES.OPERATOR, name: 'Equal', tag: 'button'}),
  Num({value: '<-', type: TYPES.OPERATOR, name: 'Del', tag: 'button'}),

  Num({value: '0', type: TYPES.DISPLAY, name: 'Display', tag: 'input'}),
  
];



const createNumeric = ({value, type, name, tag}) => {
    const elem = createEl(tag);
    elem.textContent = value;
    addStyles(elem, {'grid-area': name});
    elem.addEventListener('click', () => {      
      state.value += value;   // must RegExp test
            //    
            //    точка не может быть в слове где уже есть точка
            //    точка не может быть вначале слова или в конце слова /^\./ || /$\./
            //    точка можеть быть только после цифры 0-9
            //    после нуля который вначале слова , может быть только точка
            //    после точки ноль в конце слова удаляеться
            //    в слове только цифры и точка  [0-9] && [\.]

      observer.broadcast(state);
    });
    return elem;
};
const createOperator = ({value, type, name, tag}) => {
  const elem = createEl(tag);
  elem.textContent = value;
  addStyles(elem, {'grid-area': name, background: '#333', color: '#eee'});
  if(name==='Equal') {
    elem.addEventListener('click', () => {
      state.value = eval(state.value);
      observer.broadcast(state);
    });
  }
  if(name==='Del') {
    elem.addEventListener('click', () => {
      state.value = state.value.length?state.value.slice(0, -1): '0';
      observer.broadcast(state);
    });
  }
  return elem;
};
const createDisplay = ({value, type, name, tag}) => {
  const elem = createEl(tag);
  elem.value = value;
  observer.subscribe(data => {
    elem.value = data.value;
  })
  addStyles(elem, {'grid-area': name});
  return elem;};


const switchType = num => ({
  'NUMERIC': () => createNumeric(num),
  'OPERATOR': () => createOperator(num),
  'DISPLAY': () => createDisplay(num),
}[num.type])();

const create = num => switchType(num);

const calcApp = createEl('div');
addClass(calcApp, 'app');
render(calcApp, state.nums, create);

window.addEventListener('load', () => {
  appendTo(calcApp, document.body);
})