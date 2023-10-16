import React, {useState} from 'react'
import { Link } from 'react-router-dom'

const ProgramCard = ({id, name, desc, artWorkUrl, author}) => {
  const [isExpanded, setIsExpanded] = useState(false);


  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className= "Card">
     <Link to={`/program/${id}`} className="programImgWrapper">
        <img src={artWorkUrl} alt={`${name} flag`} />
      </Link>
      <div className="cardBody cardPadd">
        <h2 className="title">{name}</h2>
        <p>
          <span>{author}</span>
        </p>
        {isExpanded ? (
          <div className='desc' >{desc}</div>
        ) : (
          <div className='desc'>{`${desc?.slice(0, 100)}...`}</div>
        )}
        {desc?.length > 100 && (
          <button onClick={toggleExpanded}>
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      
       
      </div>
  </div>
  )
}

export default ProgramCard