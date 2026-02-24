import React, { useState, useRef } from "react";
import "./HomePage.css";

const PROMPT =
  "The quick brown fox jumps over the lazy dog";

function HomePage() {
  const [text, setText] = useState("");
  const keystrokesRef = useRef([]);
  const startTimeRef = useRef(null);

  const handleKeyDown = (e) => {
    if (!startTimeRef.current) {
      startTimeRef.current = performance.now();
    }

    keystrokesRef.current.push({
      key: e.key,
      keyDownTime: performance.now(),
      keyUpTime: null,
      dwellTime: null,
      flightTime: null,
    });
  };

  const handleKeyUp = (e) => {
    const now = performance.now();
    const strokes = keystrokesRef.current;

    const lastStroke = strokes.findLast(
      (s) => s.key === e.key && s.keyUpTime === null
    );

    if (lastStroke) {
      lastStroke.keyUpTime = now;
      lastStroke.dwellTime = lastStroke.keyUpTime - lastStroke.keyDownTime;
    }
  };

  const handleSubmit = () => {
    const endTime = performance.now();

    const sessionData = {
      promptText: PROMPT,
      typedText: text,
      startedAt: startTimeRef.current,
      finishedAt: endTime,
      keystrokes: keystrokesRef.current,
    };

    console.log("Session Data:", sessionData);

    // Later → send to backend
    // axios.post("/api/sessions", sessionData);
  };

  return (
    <div className="home-container">
      <h2>Typing Test</h2>

      <p className="prompt">{PROMPT}</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        placeholder="Please rewrite the sentence here ..."
        className="typing-box"
      />

      <button onClick={handleSubmit} className="submit-btn">
        Submit
      </button>
    </div>
  );
}

export default HomePage;