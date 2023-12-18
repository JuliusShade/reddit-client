import React, { useState } from 'react';
import './Header.css';
import logo from './pictures/RedditLogo.png';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter } from './slices/filterSlice';

const Header = () => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const filter = useSelector((state) => state.filter.filter);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setFilter(inputValue));
  };

  return (
    <nav className="nav-bar">
      <img className="logo" src={logo} alt="Reddit Logo" />
      <h1 className="title">
        <span className="highlight">Reddit</span>Minimal
      </h1>
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          value={inputValue}
          placeholder="Search posts..."
          onChange={handleInputChange}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </nav>
  );
};

export default Header;
