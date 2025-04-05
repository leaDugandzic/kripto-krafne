import React, { useState, useEffect, useRef } from 'react';
import donutVault from '../assets/img/dragdrop/donut-valut.png';
import frostingLayer from '../assets/img/dragdrop/frosting-layer.png';
import sprinkles from '../assets/img/dragdrop/sprinkles.png';
import lockIcon from '../assets/img/dragdrop/lock-icon.png';
import CodeScreen from './CodeScreen';

const DonutVault = () => {
    const [codeRevealed, setCodeRevealed] = useState(false);
    const [activeLayer, setActiveLayer] = useState(0);
    const [rotation, setRotation] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [shake, setShake] = useState(false);
    const [hint, setHint] = useState('Maknite glazuru da otkrijete šifru...');
    const vaultContainerRef = useRef(null);
    const frostingRef = useRef(null);
    const sprinklesRef = useRef(null);

    useEffect(() => {
        const $ = window.$;

        if (!$ || !$.ui) {
            console.error('jQuery UI is not loaded!');
            return;
        }

        if (!$?.ui?.rotatable) {
            $.widget("ui.rotatable", $.ui.mouse, {
                options: {
                    angle: 0,
                    handle: null,
                    rotationCenterX: 0.5,
                    rotationCenterY: 0.5
                },
                _create: function () {
                    this._super();
                    this._mouseInit();
                    this.element.addClass("ui-rotatable");
                },
                _destroy: function () {
                    this._mouseDestroy();
                    this.element.removeClass("ui-rotatable");
                },
                _mouseCapture: function () {
                    return true;
                },
                _mouseStart: function (e) {
                    const pos = this.element.offset();
                    this.center = {
                        x: pos.left + this.element.outerWidth() * this.options.rotationCenterX,
                        y: pos.top + this.element.outerHeight() * this.options.rotationCenterY
                    };
                    this.startAngle = Math.atan2(
                        e.pageY - this.center.y,
                        e.pageX - this.center.x
                    ) * 180 / Math.PI;
                    return true;
                },
                _mouseDrag: function (e) {
                    const angle = Math.atan2(
                        e.pageY - this.center.y,
                        e.pageX - this.center.x
                    ) * 180 / Math.PI;

                    const delta = angle - this.startAngle;
                    this._trigger("rotate", e, {
                        angle: angle,
                        delta: delta,
                        current: this.options.angle + delta
                    });
                },
                _mouseStop: function (e) {
                    const angle = Math.atan2(
                        e.pageY - this.center.y,
                        e.pageX - this.center.x
                    ) * 180 / Math.PI;

                    this.options.angle += angle - this.startAngle;
                    return true;
                }
            });
        }

        if (frostingRef.current && activeLayer === 0) {
            $(frostingRef.current).draggable({
                containment: false,
                stack: ".layer",
                stop: handleDragStop,
                cursor: 'move',
                scroll: false
            });
        }

        if (sprinklesRef.current && activeLayer >= 1) {
            if ($(sprinklesRef.current).data('ui-rotatable')) {
                $(sprinklesRef.current).rotatable('destroy');
            }

            $(sprinklesRef.current).rotatable({
                angle: rotation,
                rotate: function (event, ui) {
                    const fasterRotation = ui.current * 2;
                    setRotation(fasterRotation);
                    if (fasterRotation > 45 && fasterRotation < 90) {
                        setHint('Unesite elitni hackerski kod...');
                        setActiveLayer(2);
                    }
                },
                handle: sprinklesRef.current
            });

            $(sprinklesRef.current).draggable({
                containment: vaultContainerRef.current,
                cursor: 'move'
            });
        }

        return () => {
            if (frostingRef.current && $(frostingRef.current).data('ui-draggable')) {
                $(frostingRef.current).draggable("destroy");
            }

            if (sprinklesRef.current && $(sprinklesRef.current).data('ui-rotatable')) {
                $(sprinklesRef.current).rotatable("destroy");
            }

            if (sprinklesRef.current && $(sprinklesRef.current).data('ui-draggable')) {
                $(sprinklesRef.current).draggable("destroy");
            }
        };
    }, [activeLayer, rotation]);

    useEffect(() => {
        if (attempts >= 3) {
          setTimeout(() => {
            setActiveLayer(0);
            setRotation(0);
            setAttempts(0);
            setHint('Maknite glazuru da otkrijete šifru...');
            
            if (frostingRef.current) {
              $(frostingRef.current).css({
                'top': '-28.2031px',
                'left': '36px'
              });
            }
          }, 1000);
        }
      }, [attempts]);
    const handleDragStop = (event, ui) => {
        const vault = $(vaultContainerRef.current);
        const vaultWidth = vault.width();
        const vaultHeight = vault.height();
        const position = ui.position;

        const relX = position.left / vaultWidth;
        const relY = position.top / vaultHeight;

        if (relX > 0.7 && relY > 0.7 && activeLayer === 0) {
            setActiveLayer(1);
            setAttempts(attempts + 1);
            setHint('Zakrenite šećerne mrvice na 60°...');
        }
    };

    const handleCombinationSubmit = (e) => {
        e.preventDefault();
        const value = e.target.elements.combination.value;

        if (value === "1337") {
            setActiveLayer(3);
            setHint('Kliknite na ekran da otkrijete tajnu!');
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            setAttempts(attempts + 1);
            setHint(`Pogrešan kod! Savjet: To je "elitni" broj... (${attempts + 1}/3)`);
        }
    };

    const handleFinalClick = () => {
        if (activeLayer === 3) {
            setCodeRevealed(true);
            setHint('Tajna otkrivena!');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: '#ff66c4' }}>
            Krafna Trezor
          </h1>
          
          <div 
            ref={vaultContainerRef}
            className={`vault-container relative w-96 h-96 rounded-full border-8 border-dashed ${shake ? 'animate-shake' : ''}`} 
            style={{ 
              borderColor: '#ffa9de',
              backgroundColor: 'rgba(255, 255, 255, 0.7)'
            }}
          >
            <img 
              src={donutVault} 
              alt="Donut Vault" 
              className="absolute w-4/5 h-4/5 object-contain pointer-events-none"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }} 
            />
            
            {activeLayer >= 0 && (
              <img 
                ref={frostingRef}
                src={frostingLayer} 
                alt="Frosting Layer" 
                className="draggable w-3/4 h-3/4 cursor-move opacity-90 hover:opacity-100 transition-opacity object-contain"
                style={{ 
                  position: 'absolute', 
                  top: '-28.2031px', 
                  left: '36px',
                  zIndex: 20
                }}
              />
            )}
            
            {activeLayer >= 1 && (
              <div className="absolute w-full h-full" style={{ left: 0, top: 0, zIndex: 15 }}>
                <img 
                  ref={sprinklesRef}
                  src={sprinkles} 
                  alt="Sprinkles" 
                  className="rotatable w-full h-full cursor-grab object-contain" 
                  style={{ transform: `rotate(${rotation}deg)` }} 
                />
              </div>
            )}
            
            {activeLayer === 2 && (
              <div className="absolute w-1/2 h-1/2 flex flex-col items-center justify-center" 
                   style={{ 
                     left: '25%', 
                     top: '25%',
                     zIndex: 30
                   }}>
                <img 
                  src={lockIcon} 
                  alt="Lock" 
                  className="w-56 h-56 object-contain mb-4" 
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(36, 8, 25, 0.8))'
                  }}
                />
                <form onSubmit={handleCombinationSubmit} className="w-full flex flex-col items-center">
                  <input 
                    type="password" 
                    name="combination" 
                    placeholder="Unesi šifru" 
                    className="w-3/4 p-2 text-center bg-white bg-opacity-90 rounded-lg border-2 border-black-300 shadow-lg"
                    style={{ 
                      color: '#ff66c4', 
                      fontSize: '1.1rem',
                      boxShadow: '0 0 10px rgba(64, 24, 48, 0.5)'
                    }}
                    maxLength="5"
                    autoFocus
                  />
                </form>
              </div>
            )}
            
            {activeLayer >= 3 && (
              <div 
                className="absolute w-3/4 h-3/4 cursor-pointer flex items-center justify-center"
                style={{ 
                  left: '12.5%', 
                  top: '12.5%',
                  zIndex: 25
                }}
                onClick={handleFinalClick}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <CodeScreen revealed={codeRevealed} />
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center" style={{ color: '#ff66c4' }}>
        <p className="mb-2">Broj pokušaja: {attempts}/3</p>
        {attempts >= 3 && (
          <p className="text-sm font-mono bg-pink-50 p-2 rounded-lg animate-pulse">
            Previše pokušaja! Počinjemo ispočetka...
          </p>
        )}
        {attempts < 3 && (
          <p className="text-sm font-mono bg-pink-50 p-2 rounded-lg">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
};

export default DonutVault;