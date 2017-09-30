import * as React from 'react';
import Link from 'next/link';
import { css } from 'aphrodite/no-important';
import phox from 'phox/typings';
import Time from '../time/time';
import styles from './photo-styles';

interface PhotoInterface {
  image: phox.Image;
  detail?: boolean;
  load?: boolean;
}

interface PhotoState {
  src: string;
  idle: boolean;
}

class Photo extends React.Component<PhotoInterface, PhotoState> {
  constructor(props: PhotoInterface) {
    super(props);
    this.state = this.getStateFromProps(props);
  }

  public static defaultProps = {
    load: true,
  };

  private getStateFromProps(props: PhotoInterface): PhotoState {
    const { filePath } = props.image;
    return {
      src: props.load ? `/${filePath}` : '/static/default.jpg',
      idle: !props.load,
    };
  }

  private getImageRatio(): number {
    const { meta } = this.props.image;
    return Number((meta.height / meta.width).toFixed(6));
  }

  private async loadImage(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const src = `/${this.props.image.filePath}`;
      const img = new Image();

      img.onload = () => resolve(src);
      img.onerror = reject;
      img.src = src;
    });
  }

  private createImg(ratio: number, isDetail: boolean): JSX.Element {
    const { detailLinkProps, meta } = this.props.image;
    const imgClassName = css(
      styles.image,
      !this.props.load && styles.placeholder
    );
    const img = (
      <span
        className={css(styles.imageWrap)}
        style={{ paddingTop: `${ratio * 100}%` }}
      >
        <img src={this.state.src} className={imgClassName} alt={meta.title} />
      </span>
    );
    if (isDetail) {
      return img;
    }
    return (
      <Link {...detailLinkProps}>
        <a>{img}</a>
      </Link>
    );
  }

  public componentWillReceiveProps(nextProps: PhotoInterface) {
    if (this.props.image !== nextProps.image) {
      this.setState(this.getStateFromProps(nextProps));
      return;
    }

    if (this.state.idle && !this.props.load && nextProps.load) {
      this.setState({ idle: false });
      this.loadImage().then(
        (src: string) => this.setState({ src }),
        console.error
      );
    }
  }

  public render() {
    const { image, detail } = this.props;
    const { meta } = image;
    const isDetail = Boolean(detail);
    const hasDescription = Boolean(meta.description);
    const needsDash = hasDescription || !isDetail;
    const ratio = this.getImageRatio();
    const figureStyles = { maxWidth: `calc(96vh / ${ratio})` };
    const description = (
      <span dangerouslySetInnerHTML={{ __html: meta.description }} />
    );
    return (
      <figure className={css(styles.figure)} style={figureStyles}>
        {this.createImg(ratio, isDetail)}
        <figcaption
          className={css(
            styles.figcaption,
            isDetail && styles.detailFigcaption
          )}
        >
          <Time
            date={new Date(meta.createdAt)}
            className={css(styles.time, needsDash && styles.needsDash)}
          />
          {isDetail ? description : meta.title}
        </figcaption>
      </figure>
    );
  }
}

export default Photo;
