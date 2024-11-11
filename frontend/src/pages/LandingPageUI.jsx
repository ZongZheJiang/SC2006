import React, { useEffect, useState, useRef } from "react";
import LottieView from "lottie-react";
import loadingAnimation from "./animations/loadingAnimation.json";
import mapAnimation from "./animations/mapAnimation.json";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./style.css";

function LandingPage() {
  const navigate = useNavigate();
  const [opacity, setOpacity] = useState(1);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeOpacity, setWelcomeOpacity] = useState(1);
  const [showMapAnimation, setShowMapAnimation] = useState(false);
  const isMounted = useRef(true);
  const mapAnimationRef = useRef(null);

  useEffect(() => {
    if (mapAnimationRef.current) {
      mapAnimationRef.current.setSpeed(0.001);
    }
  }, [showMapAnimation]);
  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setOpacity(0);
    }, 900);

    const welcomeTimer = setTimeout(() => {
      setShowWelcome(true);
    }, 1500);

    const showMapTimer = setTimeout(() => {
      setShowMapAnimation(true);
    }, 2300);

    const fadeOutTimer2 = setTimeout(() => {
      setWelcomeOpacity(0);
    }, 3300);

    return () => {
      isMounted.current = false;
      clearTimeout(fadeOutTimer);
      clearTimeout(welcomeTimer);
      clearTimeout(showMapTimer);
      clearTimeout(fadeOutTimer2);
    };
  }, [navigate]);

  const handleAnimationComplete = () => {
    navigate("/navigation");
  };

  return (
    <>
      <div className="animationContainer">
        <motion.div
          animate={{
            opacity: opacity,
            y: opacity === 0 ? -100 : 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <h1 style={{ color: "black" }}>Preparing Your Trip...</h1>
          </motion.div>
        </motion.div>

        <br />
        <br />
        <br />
        <br />
        <br />

        <motion.div
          style={{ width: "29%", height: "70%" }}
          animate={{
            opacity: opacity,
            y: opacity === 0 ? 100 : 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <LottieView animationData={loadingAnimation} loop={true} />
          </motion.div>
        </motion.div>
      </div>

      {showWelcome && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: welcomeOpacity,
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            top: "25%",
            left: "50%",
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
