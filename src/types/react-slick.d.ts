declare module 'react-slick' {
  import * as React from 'react';

  export type Settings = {
    [key: string]: any;
  };

  const Slider: React.ComponentType<any> & {
    Slick: any;
  };

  export default Slider;
}