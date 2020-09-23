import React from 'react';

function Loader() {
  return (
    <div className="loader-container">
      <div className="loader">
          <div className="spiner-example">
            <div className="sk-spinner sk-spinner-wandering-cubes">
              <div className="sk-cube1"></div>
              <div className="sk-cube2"></div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Loader;