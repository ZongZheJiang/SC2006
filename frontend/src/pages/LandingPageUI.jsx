import React, { useEffect, useState, useRef } from "react";
import LottieView from "lottie-react";
import mapAnimation from "./animations/mapAnimation.json";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./style.css";

function LandingPage() {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeOpacity, setWelcomeOpacity] = useState(1);
  const [showMapAnimation, setShowMapAnimation] = useState(false);
  const mapAnimationRef = useRef(null);

  useEffect(() => {
    if (mapAnimationRef.current) {
      mapAnimationRef.current.setSpeed(0.001);
    }
  }, [showMapAnimation]);

  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(true);
    }, 1500);

    const showMapTimer = setTimeout(() => {
      setShowMapAnimation(true);
    }, 2500);

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(showMapTimer);
    };
  }, [navigate]);

  const handleAnimationComplete = () => {
    navigate("/navigation");
  };

  return (
    <>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0, y: 50 }} // Start 50px below and invisible
          animate={{
            opacity: welcomeOpacity,
            y: 0, // Move to original position
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            top: "25%",
            left: "42.5%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <h1 style={{ color: "black" }}>Welcome Back!</h1>
          <h2 style={{ color: "black" }}>Ready to travel?</h2>
        </motion.div>
      )}

      {showMapAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: welcomeOpacity,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "10%",
            height: "10%",
          }}
        >
          <LottieView
            animationData={mapAnimation}
            loop={false}
            speed={0.2}
            lottieRef={mapAnimationRef}
            onComplete={handleAnimationComplete}
          />
        </motion.div>
      )}
    </>
  );
}

export default LandingPage;
