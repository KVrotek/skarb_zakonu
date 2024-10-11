import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './../App.css';

const VideoPlayer = () => {
  const [currentVideo, setCurrentVideo] = useState(1);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);
  const [isRandomSelection, setIsRandomSelection] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const [quizQuestion, setQuizQuestion] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [isQuestionVisible, setIsQuestionVisible] = useState(false);

  const categoryMap = {
      6: 'Ciekawostki',
      7: 'Geografia',
      8: 'Historia',
      9: 'Biologia',
      10: 'Nauki ścisłe',
      11: 'Znane miejsca',
      12: 'Transport',
      13: 'Sport'
  };

  const difficultyMap = {
      16: 'łatwe',
      17: 'trudne'
  };

  async function generateQuestion(prompt) {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel(
        { model: "gemini-1.5-flash",
          generationConfig: {
            candidateCount: 1,
            maxOutputTokens: 200,
            temperature: 1.0,
          },
        }
      );

      try {
          const data = await model.generateContent(prompt);
          const response = data.response.text();
          return response;
      } catch (error) {
          console.error("Błąd generowania odpowiedzi:", error);
          return null;
      }
  }

  async function createPrompt(category, difficulty) {
      if (category && difficulty) {
        const prompt = `Wygeneruj ${difficulty} pytanie z kategorii ${category} z 3 odpowiedziami i prawidłową odpowiedzią. Odpowiedź ma zawierać tylko format json {"question": pytanie, "answers": [odpowiedzi], "correct_answer": poprawna odpowiedź}`;
        console.log(prompt);

        try {
          const generatedResponse = await generateQuestion(prompt);
          console.log(generatedResponse);
          const cleanedJson = generatedResponse.replace(/```json|```/g, '').trim();
          const response = JSON.parse(cleanedJson);
          console.log(response);

          setQuizQuestion(response.question);
          setQuizAnswers(response.answers);
          setCorrectAnswer(response.correct_answer);
          setIsQuestionVisible(true);

        } catch (error) {
          console.error('Błąd podczas przetwarzania prompta:', error);
        }
      } else {
        console.log('Niepoprawny wybór kategorii lub poziomu trudności');
      }
  }

  function handleCategorySelection(selectedFilm) {
      const category = categoryMap[selectedFilm];
      setSelectedCategory(category);
  }

  function handleDifficultySelection(selectedFilm) {
      const difficulty = difficultyMap[selectedFilm];
      setSelectedDifficulty(difficulty);
  }

  const handleVideoEnd = () => {
    if (currentVideo === 1) {
      setCurrentVideo(2);
    } else if (currentVideo === 2) {
      setCurrentVideo(3);
      setShowStartButton(true);
    } else if (currentVideo === 4) {
      setCurrentVideo(5);
    } else if ([7, 8, 9, 10, 11, 12, 13].includes(currentVideo)) {
      if (!isRandomSelection) {
        setCurrentVideo(15);
      } else {
        setCurrentVideo(17);
      }
    } else if ([6].includes(currentVideo)) {
      setCurrentVideo(17);
    } else if (currentVideo === 16) {
      setCurrentVideo(18);
      console.log(selectedCategory);
      console.log(selectedDifficulty)
      createPrompt(selectedCategory, selectedDifficulty);
    } else if (currentVideo === 17) {
      setCurrentVideo(19);
      createPrompt(selectedCategory, selectedDifficulty);
    } else if ([20,21,22,23].includes(currentVideo)) {
      setCurrentVideo(5);
    } else if ([24,25,26].includes(currentVideo)) {
      if (selectedDifficulty === 'łatwe') {
          setCurrentVideo(27);
      } else {
          setCurrentVideo(28);
      }
    } else if ([27,28].includes(currentVideo)) {
      setCurrentVideo(5);
    } else if (currentVideo === 14) {
        setCurrentVideo(3);
        setShowStartButton(true);
    }
  };

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play();
    }
  }, [currentVideo, isPlaying]);

  const handleStartClick = () => {
    setShowStartButton(false);
    setCurrentVideo(4);
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
    setShowStartButton(false);
  };

  const handleVideoSelection = (index) => {
    const videoMenuSelection = [6, 7, 8, 9, 10, 11, 12, 13, 3, 14];
    setIsRandomSelection(false);
    if (videoMenuSelection[index] !== 3) {
      setCurrentVideo(videoMenuSelection[index]);
      handleCategorySelection(videoMenuSelection[index]);

      if (videoMenuSelection[index] === 6) {
        handleDifficultySelection(17);
      }
    } else {
      setCurrentVideo(videoMenuSelection[index]);
      setShowStartButton(true);
    }
  };

  const handleRandomSelection = () => {
    const videoMenuSelection = [7,8,9,10,11,12,13];
    const random = Math.floor(Math.random() * videoMenuSelection.length);
    handleCategorySelection(videoMenuSelection[random]);
    handleDifficultySelection(17);

    setIsRandomSelection(true);
    setCurrentVideo(videoMenuSelection[random]);
  };

  const handleDiffSelection = (index) => {
    const videoMenuSelection = [5,17,16];
    setCurrentVideo(videoMenuSelection[index]);

    handleDifficultySelection(videoMenuSelection[index]);
  };

  const handleAnswerClick = (answer) => {
      setIsQuestionVisible(false);
      if (answer === correctAnswer) {
        const goodAnswer = [20,21,22,23];
        const goodRandom = Math.floor(Math.random() * goodAnswer.length);
        setCurrentVideo(goodAnswer[goodRandom]);
      } else {
        const badAnswer = [24,25,26];
        const badRandom = Math.floor(Math.random() * badAnswer.length);
        setCurrentVideo(badAnswer[badRandom]);
      }
  };

  const buttonStyles = [
    { top: '6%', left: '27%', width: '18vw', height: '10vh' },
    { top: '7%', left: '59%', width: '14vw', height: '10vh' },
    { top: '25%', left: '68%', width: '12vw', height: '10vh' },
    { top: '49%', left: '69%', width: '12vw', height: '10vh' },
    { top: '73%', left: '60%', width: '18vw', height: '10vh' },
    { top: '73%', left: '24%', width: '19vw', height: '10vh' },
    { top: '50%', left: '20%', width: '14vw', height: '10vh' },
    { top: '26%', left: '24%', width: '10vw', height: '10vh' },
    { top: '85%', left: '21%', width: '8vw', height: '10vh' },
    { top: '85%', left: '64%', width: '17vw', height: '10vh' },
  ];

  const diffSelection = [
    { top: '80%', left: '22%', width: '10vw', height: '10vh' },
    { top: '75%', left: '39%', width: '13vw', height: '10vh' },
    { top: '70%', left: '57%', width: '12vw', height: '10vh' },
  ];

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
    }}>
      {!isPlaying && (
        <button 
          onClick={handlePlayClick}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '24px',
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '10px',
            borderRadius: '5px',
            cursor: 'pointer',
            zIndex: 1,
          }}
        >
          Rozpocznij
        </button>
      )}
      
      {currentVideo === 1 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/1.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 2 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/2.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 3 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/3.mp4`}
          onEnded={handleVideoEnd}
          loop
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 4 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/4.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 5 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/5.mp4`}
          loop
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 6 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/S1.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 7 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/S2.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 8 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/S3.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 9 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/S4.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 10 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/S5.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 11 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/S6.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 12 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/S7.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 13 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/S8.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 14 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/END.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 15 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/6.mp4`}
          loop
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 16 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/7.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 17 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/8.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 18 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/LQ.mp4`}
          loop
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 19 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/TQ.mp4`}
          loop
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 20 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/G1.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 21 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/G2.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 22 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/G3.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 23 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/G4.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 24 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/B1.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 25 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/B2.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 26 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/B3.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 27 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/LCA.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {currentVideo === 28 && (
        <video
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/video/TCA.mp4`}
          onEnded={handleVideoEnd}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}

      {showStartButton && currentVideo === 3 &&(
        <div 
          onClick={handleStartClick}
          style={{
            position: 'absolute',
            top: '12%',
            left: '28%',
            transform: 'translate(-50%, -50%)',
            width: '10vw',
            height: '5vh',
            padding: '10px',
            cursor: 'pointer',
            zIndex: 1,
            background: 'transparent',
          }}
        >
        </div>
      )}

      {currentVideo === 5 && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {buttonStyles.map((style, index) => (
            <button
              key={index}
              onClick={() => handleVideoSelection(index)}
              style={{
                position: 'absolute',
                top: style.top,
                left: style.left,
                width: style.width,
                height: style.height,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
            </button>
          ))}
          <button
              onClick={() => handleRandomSelection()}
              style={{
                position: 'absolute',
                top: '47%',
                left: '46%',
                width: '8vw',
                height: '10vh',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
            </button>
        </div>

      )}

      {currentVideo === 15 && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {diffSelection.map((style, index) => (
            <button
              key={index}
              onClick={() => handleDiffSelection(index)}
              style={{
                position: 'absolute',
                top: style.top,
                left: style.left,
                width: style.width,
                height: style.height,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
            </button>
          ))}
        </div>
      )}

      {isQuestionVisible && (
        <div style={{ position: 'absolute', top: '8%', left: '62%', transform: `translateX(-50%) rotate(${selectedDifficulty === 'łatwe' ? '7deg' : '12deg'})`, width: '30vw', height: '80vh' }}>
          <p style={{ textAlign: 'center', paddingBottom: '50px', fontSize: '25px', fontFamily: 'ArchitectsDaughter' }}>{quizQuestion}</p>
          <div style={{ paddingLeft: '30px' }}>
            {quizAnswers.map((answer, index) => (
              <button key={index} onClick={() => handleAnswerClick(answer)} style={{ display: 'block', margin: '10px 0', padding: '10px 20px', background: 'transparent', color: '#800000', border: 'none', fontSize: '18px', fontFamily: 'ArchitectsDaughter' }}>
                ○ {answer}
              </button>
            ))}
          </div>
        </div>
      )}

      {(currentVideo === 28 || currentVideo === 27) && (
        <div style={{ position: 'absolute', top: '8%', left: '62%', transform: `translateX(-50%) rotate(${selectedDifficulty === 'łatwe' ? '7deg' : '12deg'})`, width: '30vw', height: '80vh' }}>
          <p style={{ textAlign: 'center', paddingBottom: '50px', fontSize: '25px', fontFamily: 'ArchitectsDaughter' }}>{quizQuestion}</p>
          <div style={{ textAlign: 'center' }}>
              <p style={{margin: '10px 0', padding: '10px 20px', color: '#800000', fontSize: '24px', fontFamily: 'ArchitectsDaughter' }}>{correctAnswer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
