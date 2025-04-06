import React, { useEffect, useState } from 'react';
import "./krafne.css";
import Zvuk from "../assets/zvuk1.mp3";

function Glazba() {

  return (
    <div className='h-[90vh] flex items-center justify-center bg-black'>
      <audio controls autoplay>
        <source src={Zvuk} type="audio/mp3" />
      </audio>
    </div>
  );
}

export default Glazba;
