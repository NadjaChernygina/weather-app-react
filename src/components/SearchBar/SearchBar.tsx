import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; // 🔥 Імпортуємо іконку
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [city, setCity] = useState('');

  const handleSearch = () => {
    if (city.trim()) {
      onSearch(city);
    }
  };

  return (
    <div className={styles.searchBar}>
      <TextField
        label="Enter city"
        variant="outlined"
        className={styles.searchInput}
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <Button variant="contained" className={styles.searchButton} onClick={handleSearch}>
        <SearchIcon /> {/* 🔥 Додаємо іконку замість тексту */}
      </Button>
    </div>
  );
};

export default SearchBar;
