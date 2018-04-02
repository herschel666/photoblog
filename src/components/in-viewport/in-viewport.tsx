import * as React from 'react';
import { windowIsDefined } from '../../util';

interface State {
  inViewPort: boolean;
}

interface Props {
  render: (inViewPort: boolean) => JSX.Element;
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

  private elemIsInViewPort = async (): Promise<void> => {
    await new Promise((resolve, reject) =>
      requestAnimationFrame(() => {
        const winOffset = pageYOffset + innerHeight + TOLERANCE;
        const elemOffset = this.elem.offsetTop;
        if (winOffset >= elemOffset) {
          resolve();
        } else {
          reject();
        }
      })
    );
  };

  private onScroll = (): void => {
    this.elemIsInViewPort().then(() => {
      this.setState({ inViewPort: true });
      window.removeEventListener('scroll', this.onScroll);
    }, () => void 0);
  };

  public componentDidMount() {
    if (!windowIsDefined()) {
      return;
    }

    this.elemIsInViewPort().then(
      () => this.setState({ inViewPort: true }),
      () => window.addEventListener('scroll', this.onScroll)
    );
  }

  public componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  public render() {
    return (
      <span ref={this.bindRef}>{this.props.render(this.state.inViewPort)}</span>
    );
  }
}
