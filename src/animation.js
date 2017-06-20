import Animation from 'zwip/src/animation';
import { stringify as renderStyle } from 'style-attr';
import { isElement, isFunction, isObject, noop } from 'zwip/src/utils';

const _defaultStyle = {
  position: 'absolute',
};

const BubbleAnimation = (options = {}) => {

  const {
    container,
    element,
    start:_start = noop,
    stop:_stop = noop
  } = isObject(options, 'options');

  isElement(element, 'element');
  isElement(container, 'container');
  isFunction(_start, 'start');
  isFunction(_stop, 'stop');

  const _style = {};
  let _center;
  let _rect;

  let _radius1;
  let _radius2;
  let _delta;

  const _getCorners = offset => {

    const topLeft = { x: offset.left, y: offset.top };
    const topRight = { x: offset.right, y: offset.top };
    const bottomLeft = { x: offset.left, y: offset.bottom };
    const bottomRight = { x: offset.right, y: offset.bottom };

    return [
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    ];
  };

  const _calculateDistance = (from, to) => {

    return Math.sqrt(
      Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2)
    )
  };

  const _getCenter = rect => {
    return {
      x: rect.left + (rect.width / 2),
      y: rect.top + (rect.height / 2)
    }
  };


  const initialize = () => {

    _rect = element.getBoundingClientRect();
    _center = _getCenter(_rect);

    _radius1 = _rect.width / 2;

    const distances = corners.map(_calculateDistance.bind(null, _center));

    _radius2 = Math.max(...distances);
    _delta = _radius2 - _radius1;
  };

  const corners = _getCorners(container.getBoundingClientRect());

  initialize();

  let _clone = element.cloneNode();
  _clone.classList.add('clone');
  _clone.setAttribute('style', `position:absolute;left:${element.offsetLeft}px;top:${element.offsetTop}px;`);
  _clone.style.opacity = 0;
  _clone.style.zIndex = -1;

  const animation = Animation(Object.assign(options, {
    start(options) {

      console.log('Bubble.start()');

      container.appendChild(_clone);

      Object.assign(_style, _defaultStyle);

      _start(options);

    },
    stop(options) {
      console.log('Bubble.stop()');

      _stop();
      container.removeChild(_clone);
    },
    update(){
      console.log('Bubble.update()');

      const diameter = Math.round(_rect.width + (2 * _delta * animation.value) );
      const radius = (diameter / 2);

      _style.left = `${ _center.x - radius - container.offsetLeft }px`;
      _style.top = `${ _center.y - radius - container.offsetTop }px`;
      _style.width = _style.height = `${diameter}px`;
    },
    render(){
      console.log('Bubble.render()');

      _clone.setAttribute('style', Object.assign(renderStyle(_style), _defaultStyle));
    }
  }));

  return animation;
};

export default BubbleAnimation;