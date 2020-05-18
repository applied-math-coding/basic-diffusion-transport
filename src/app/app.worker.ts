/// <reference lib="webworker" />
import { Params } from './params';
import { Simulator } from './simulator';

addEventListener('message', ({ data }: { data: Params }) => {
  (new Simulator(data)).simulate();
});

