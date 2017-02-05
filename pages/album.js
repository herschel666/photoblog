
/* eslint "react/jsx-filename-extension": 0, "react/no-danger": 0 */

import React, { PureComponent, PropTypes } from 'react';
import Link from 'next/link';
import 'isomorphic-fetch';

class Album extends PureComponent {
    static async getInitialProps({ query }) {
        const res = await fetch(`http://localhost:3000/api/v1/albums/${query.album}`);
        const album = await res.json();
        return { album };
    }

    render() {
        const { title, content, images } = this.props.album;
        return (
            <div>
                <h1>{title}</h1>
                <div dangerouslySetInnerHTML={{ __html: content }} />
                <ul>
                    {images.map(src => (
                        <img src={src} alt="" key={src} />
                    ))}
                </ul>
                <Link href="/"><a>back</a></Link>
            </div>
        );
    }
}

Album.propTypes = {
    album: PropTypes.shape({
        title: PropTypes.string,
        content: PropTypes.string,
        images: PropTypes.arrayOf(PropTypes.string),
    }),
};

export default Album;
