
/* eslint "react/jsx-filename-extension": 0 */

import React, { PureComponent, PropTypes } from 'react';
import Link from 'next/link';
import 'isomorphic-fetch';

class Index extends PureComponent {
    static async getInitialProps() {
        const res = await fetch('http://localhost:3000/api/v1/albums');
        const albums = await res.json();
        return { albums };
    }

    render() {
        const { albums = [] } = this.props;
        return (
            <div>
                <h1>Hello World!</h1>
                {albums.map(({ title, slug }, i) => (
                    <Link href={`/album?album=${slug}`} as={`/album/${slug}`} key={i}>
                        <a>{title}</a>
                    </Link>
                ))}
            </div>
        );
    }
}

Index.propTypes = {
    albums: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        slug: PropTypes.string,
    })),
};

export default Index;
