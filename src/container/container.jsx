
import React, { PropTypes } from 'react';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import styles from './container.sass';

const Container = ({ style = null, className = '', home, children }) => (
    <div className={styles.container}>
        <Header home={Boolean(home)} />
        <main className={className} style={style}>
            {children}
        </main>
        <Footer />
    </div>
);

Container.propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    home: PropTypes.bool,
    children: PropTypes.array.isRequired,
};

export default Container;
