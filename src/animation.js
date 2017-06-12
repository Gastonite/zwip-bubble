import Animation from 'zwip/src/animation';
import { parse as parseStyle, stringify as renderStyle } from 'style-attr';

import { isElement, isObject } from 'zwip/src/utils';

const _defaultStyle = {
  position: 'absolute'
};

const _parseOptions = (options) => {

  isObject(options, 'options');
  isElement(options.element, 'element');
  isElement(options.container, 'container');

  return options;
};

const HoleAnimation = (options = {}) => {

  const { container, element } = _parseOptions(options);

  const _style = {};
  let _center;
  let _rect;
  let _radius1;
  let _radius2;
  let _difference;

  const _getCorners = offset => {

    const topLeft = { x: offset.left, y: offset.top };
    const topRight = { x: offset.right, y: offset.top };
    const bottomLeft = { x: offset.left, y: offset.bottom };
    const bottomRight = { x: offset.right, y: offset.bottom };

    const positions = [
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    ];

    return Object.assign(positions, {
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    })
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

  const update = () => {

    const v = animation.value;

    const size = _rect.width + (2 * _difference * v);

    _style.left = `${(1 - (size / 2)) + _center.x - _rect.left}px`;
    _style.top = `${(1 - (size / 2)) + _center.y - _rect.top}px`;

    _style.width = _style.height = `${size}px`;
  };

  const render = () => {

    element.setAttribute('style', renderStyle(_style));

  };

  _rect = element.getBoundingClientRect();
  _center = _getCenter(_rect);

  _radius1 = _rect.width / 2;

  const containerCorners = _getCorners(container.getBoundingClientRect());
  const distances = containerCorners.map(_calculateDistance.bind(null, _center));

  _radius2 = Math.max(...distances);
  _difference = _radius2 - _radius1;

  const animation = Animation(Object.assign(options, {
    update,
    render
  }));

  animation.on('start', () => Object.assign(_style, parseStyle(element), _defaultStyle));

  return animation;
};

export default HoleAnimation;