
import React, { PropTypes } from 'react';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';

const Container = ({ home, children }) => (
    <div>
        <Header home={Boolean(home)} />
        <main>
            {children}
        </main>
        <Footer />
    </div>
);

Container.propTypes = {
    home: PropTypes.bool,
    children: PropTypes.array.isRequired,
};

export default Container;
