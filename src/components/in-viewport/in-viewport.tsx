import * as React from 'react';
import { windowIsDefined } from '../../util';

export interface State {
  inViewPort: boolean;
}

interface Props {
  render: (state: State) => JSX.Element;
}

const TOLERANCE = 100;

export default class InViewPort extends React.Component<Props, State> {
  private elem: HTMLSpanElement = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      inViewPort: false,
    };
  }

  private bindRef = (e: HTMLSpanElement): void => {
    this.elem = e;
  };

  private elemIsInViewPort = (): boolean => {
    const winOffset = pageYOffset + innerHeight - TOLERANCE;
    const elemOffset = this.elem.offsetTop;
    return winOffset >= elemOffset;
  };

  private onScroll = (): void => {
    requestAnimationFrame(() => {
      if (this.elemIsInViewPort()) {
        this.setState({ inViewPort: true });
        window.removeEventListener('scroll', this.onScroll);
      }
    });
  };

  public componentDidMount() {
    if (!windowIsDefined()) {
      return;
    }

    if (this.elemIsInViewPort()) {
      this.setState({ inViewPort: true });
      return;
    }

    window.addEventListener('scroll', this.onScroll);
  }

  public componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  public render() {
    return <span ref={this.bindRef}>{this.props.render(this.state)}</span>;
  }
}
