import 'zwip/src/polyfills';
import 'pwet/src/polyfills';
import Component from 'pwet/src/component';
import ZwipPlayer from 'zwip-player';
import BubbleAnimation from '../src/animation';
import { renderDiv } from 'idom-util';

Component.define(ZwipPlayer);

document.addEventListener('DOMContentLoaded', () => {

  const zwipPlayer = document.createElement('zwip-player');

  zwipPlayer.pwet.initialize({

    makeAnimation(scene) {

      return BubbleAnimation({
        container: scene.firstChild,
        element: scene.querySelector('.circle'),
        duration: 4000
      });
    },
    renderScene() {

      renderDiv(null, null, 'style', 'overflow:hidden;border: 1px solid black;width:100%; height:90%; position:relative; top: 10%', () => {
        renderDiv(null, null, 'class', 'circle'/*, 'position', ''*/, null);
      });
    }
  });


  document.body.insertBefore(zwipPlayer, document.body.firstChild);
});