import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerLabel, setTimerLabel] = useState('Session');
  const [timeLeft, setTimeLeft] = useState(sessionLength*60);
  const [isRunning, setIsRunning] = useState(false);
  const [isAlarm, setIsAlarm] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const beepSoundSrc = 'https://cdn.freesound.org/previews/49/49165_296628-lq.mp3';
  const audioRef = useRef(null);


  const handleBreakIncrement = () => {
    setBreakLength(prev => prev >= 60 ? 60 : prev + 1);
    if (!isSession) {
      setTimeLeft(breakLength*60);
      if (breakLength >= 60) {
        setTimeLeft(60*60);
      } else {
      setTimeLeft((breakLength+1)*60);
      }
    }
  }

  const handleBreakDecrement = () => {
    setBreakLength(prev => prev <= 1 ? 1 : prev - 1);
    if (!isSession) {
      setTimeLeft(breakLength*60);
      if (breakLength <= 1){
        setTimeLeft(1*60);
      } else {
        setTimeLeft((breakLength-1)*60);
      }
    }
  }

  const handleSessionIncrement = () => {
    setSessionLength(prev => prev >= 60 ? 60 : prev + 1);
    if (isSession) {
      setTimeLeft(sessionLength*60);
      if (sessionLength >= 60) {
        setTimeLeft(60*60);
      } else {
      setTimeLeft((sessionLength+1)*60);
      }
    }
  }

  const handleSessionDecrement = () => {
    setSessionLength(prev => prev <= 1 ? 1 : prev - 1);
    if (isSession) {
      setTimeLeft(sessionLength*60);
      if (sessionLength <= 1){
        setTimeLeft(1*60);
      } else {
        setTimeLeft((sessionLength-1)*60);
      }
    }
  }
  
  const handleStart = () => {
    setIsRunning(true);
    setIsAlarm(false);
  }

  const handleStop = () => {
    setIsRunning(false);
    setIsAlarm(false);
  }

  const handleReset = () => {
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimerLabel('Session');
    setTimeLeft(25*60);
    setIsAlarm(false);
    setIsSession(true);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  useEffect(()=>{
    const handleAudioEnd = ()=>{
      setIsAlarm(false);
      setIsRunning(true);
    };
    if (audioRef.current){
      audioRef.current.addEventListener('ended', handleAudioEnd);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended',handleAudioEnd);
      }
    };
  }, []);


  useEffect(() => {
    let countdown = null;

    if (isRunning) {
      countdown = setInterval(() => {
        setTimeLeft(prevTimeLeft => {
          if (prevTimeLeft > 0) {
            return prevTimeLeft - 1;
          } else {
            setIsAlarm(true);
            setIsSession(!isSession);
            audioRef.current.play();
            if (timerLabel === 'Session') {
              setTimerLabel('Break');
              return breakLength * 60;
            } else {
              setTimerLabel('Session');
              return sessionLength * 60;
            }
          }
        });
      }, 1000);
    } else if (!isRunning && timeLeft !== 0) {
      clearInterval(countdown);
    }

    return () => clearInterval(countdown);
  }, [isRunning, isAlarm, timeLeft, breakLength, sessionLength, timerLabel]);

  const formatTime = (time) => {
    const minutes = Math.floor(time/60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className='App'>
      <h1>25 + 5 Clock</h1>
      <div className='row'>
        <div className='col w-100'></div>
        <div className='col' id='break-container'>
          <h3 id='break-label'>Break Length</h3>
          <i className="fa-solid fa-arrow-up fa-xl" id='break-increment' onClick={handleBreakIncrement}></i><span id='break-length'> {breakLength} </span><i className="fa-solid fa-arrow-down fa-xl" id='break-decrement' onClick={handleBreakDecrement}></i>
        </div>
        <div className='col' id='session-container'>
          <h3 id='session-label'>Session Length</h3>
          <i className="fa-solid fa-arrow-up fa-xl" id='session-increment' onClick={handleSessionIncrement}></i><span id='session-length'> {sessionLength} </span><i className="fa-solid fa-arrow-down fa-xl" id='session-decrement' onClick={handleSessionDecrement}></i>
        </div>
        <div className='col w-100'></div>
      </div>
      <div id='countdown-container'>
        <h2 id='timer-label'>{timerLabel}</h2>
        <p className='bigtext' id='time-left'><b>{formatTime(timeLeft)}</b></p>
      </div>
      <div id='controls'>
        <i className="fa-solid fa-play fa-xl" id='start_stop' onClick={handleStart}></i>
        <i className="fa-solid fa-pause fa-xl" id='start_stop' onClick={handleStop}></i>
        <i className="fa-solid fa-rotate fa-xl" id='reset' onClick={handleReset}></i>
      </div>
      <audio ref={audioRef} id='beep' src={beepSoundSrc}></audio>
    </div>
  );
}

export default App;
