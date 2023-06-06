import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";

const PokemonList = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 20;
  const pagesVisited = itemsPerPage * pageNumber;

  useEffect(() => {
    fetchPokemonData();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const fetchPokemonData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://api.pokemontcg.io/v1/cards");
      setPokemonData(response.data.cards);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };

  const handleSearch = (event) => {
    setSearchData(event.target.value);
  };
  const filteredPokemonData = pokemonData.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchData.toLowerCase())
  );

  const displayPokemonData = filteredPokemonData
    .slice(0, pagesVisited + itemsPerPage)
    .map((pokemon) => (
      <div key={pokemon.id}>
        <img src={pokemon.imageUrl} alt={pokemon.name} />
        <p>{pokemon.name}</p>
      </div>
    ));
  const pageCount = Math.ceil(filteredPokemonData.length / itemsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  return (
    <>
      <input type="text" placeholder="Search Pokemon" onChange={handleSearch} />
      {displayPokemonData}
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <ReactPaginate
          previousLabel="Previous"
          nextLabel="Next"
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName="pagination"
          activeClassName="active"
        />
      )}
    </>
  );
};

export default PokemonList;
