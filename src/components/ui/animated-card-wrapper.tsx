
import styled from 'styled-components';

const AnimatedCardWrapper = styled.div`
  .card {
    position: relative;
    transition: all 0.8s cubic-bezier(0.15, 0.83, 0.66, 1);
  }

  .card:hover {
    transform: scale(1.05);
  }

  .container {
    width: 120px;
    height: 120px;
    position: absolute;
    right: -10px;
    top: -10px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: scale(0.5);
    pointer-events: none;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .card:hover .container {
    opacity: 1;
  }

  .cloud {
    width: 120px;
  }

  .front {
    padding-top: 45px;
    margin-left: 25px;
    display: inline;
    position: absolute;
    z-index: 11;
    animation: clouds 8s infinite;
    animation-timing-function: ease-in-out;
  }

  .back {
    margin-top: -30px;
    margin-left: 150px;
    z-index: 12;
    animation: clouds 12s infinite;
    animation-timing-function: ease-in-out;
  }

  .right-front {
    width: 45px;
    height: 45px;
    border-radius: 50% 50% 50% 0%;
    background-color: var(--primary);
    display: inline-block;
    margin-left: -25px;
    z-index: 5;
  }

  .left-front {
    width: 65px;
    height: 65px;
    border-radius: 50% 50% 0% 50%;
    background-color: var(--primary);
    display: inline-block;
    z-index: 5;
  }

  .right-back {
    width: 50px;
    height: 50px;
    border-radius: 50% 50% 50% 0%;
    background-color: var(--primary);
    display: inline-block;
    margin-left: -20px;
    z-index: 5;
  }

  .left-back {
    width: 30px;
    height: 30px;
    border-radius: 50% 50% 0% 50%;
    background-color: var(--primary);
    display: inline-block;
    z-index: 5;
  }

  .sun {
    width: 60px;
    height: 60px;
    background: var(--primary);
    border-radius: 50%;
    display: inline;
    position: absolute;
  }

  .sunshine {
    animation: sunshines 2s infinite;
  }

  @keyframes sunshines {
    0% {
      transform: scale(1);
      opacity: 0.6;
    }

    100% {
      transform: scale(1.4);
      opacity: 0;
    }
  }

  @keyframes clouds {
    0% {
      transform: translateX(15px);
    }

    50% {
      transform: translateX(0px);
    }

    100% {
      transform: translateX(15px);
    }
  }
`;

export default AnimatedCardWrapper;
