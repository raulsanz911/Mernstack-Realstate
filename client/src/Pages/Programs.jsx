import React, { useEffect, useState } from 'react';
import ProgramCard from '../components/ProgramCard';
import { useFetch } from "../hooks/useFetch";
import LoadingSpinner from '../components/LoadingSpinner';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom'

function App() {

  const { data: programs, loading, error } = useFetch(`https://localhost:7018/Programs`);
  library.add(farHeart);

  const renderPrograms = programs.map((program) => {
    // let { Id: id, Name: name, Description: description, ArtworkUrl: artWorkUrl, Author: author } = program;
    return (
      <ProgramCard
        key={program?.id}
        id={program?.id}
        artWorkUrl={program?.artworkUrl}
        name={program?.name}
        desc={program?.description}
        author={program?.author}
      />
    );
  });

  return (
    <>
      {loading && <LoadingSpinner />}
      {error && <div>Error loading Clips</div>}
      {programs &&
        <div className='layoutWrapper'>
          <aside>
          <Link to= {`/clips/favorite`}>
            <FontAwesomeIcon icon={['far', 'heart']} />
            </Link>
          </aside>
          <div className='programsContainer container'>
            {renderPrograms}
          </div>
        </div>

      }
    </>
  );
}

export default App;
