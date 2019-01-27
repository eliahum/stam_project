import { trigger, state, style, transition, animate } from '@angular/animations';

export const markedTrigger = trigger('markedState', [
  state('default', style({
    border: '1px solid black',

  })),
  state('marked', style({
    border: '1px solid black',
  
  })),
  transition('default => marked', [
    // style({
    //   border: '2px solid black',
    //   padding: '19px'
    // }),
    animate('200ms ease-out', style({
      transform: 'scale(1.25)'
    })),
    animate(200)
  ]),
  transition('marked => default', [
    style({
      border: '1px solid blue'
    }),
    animate('300ms ease-out')
  ]),
  // transition('marked => default', animate('300ms ease-out')),
]);

