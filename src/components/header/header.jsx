
import React, { PropTypes } from 'react';

const title = 'ek|photos';

const Header = ({ home }) => (
    <header>
        <span>
            {home ? title : <a href="/">{title}</a>}
        </span>
    </header>
);

Header.propTypes = {
    home: PropTypes.bool.isRequired,
};

export default Header;
