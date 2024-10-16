import React, { useEffect, useState, useRef } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "./animations/loadingAnimation.json";
import { useNavigate } from "react-router-dom";
import "./style.css";

function LandingPage() {
  const navigate = useNavigate();
  const [opacity, setOpacity] = useState(1);
  const isMounted = useRef(true);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setOpacity(0);
    }, 1500);

    const navigationTimer = setTimeout(() => {
      navigate("/navigation");
    }, 2000);

    return () => {
      isMounted.current = false;
      clearTimeout(fadeOutTimer);
      clearTimeout(navigationTimer);
    };
  }, [navigate]);

  return (
    <div
      className="animationContainer"
      style={{
        opacity: opacity,
      }}
    >
      <div>
        <h1 style={{ color: "black" }}>Preparing Your Trip...</h1>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div style={{ width: "100%", height: "70%" }}>
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>
    </div>
  );
}

export default LandingPage;
