import styles from "./Result.module.scss";

import { Question } from "../Quiz/Quiz";

interface ResultProps {
  score: number;
  questions: Question[];
  handleStartGame: () => void;
  handleRestartGame: () => void;
}

const Result: React.FC<ResultProps> = ({
  score,
  questions,
  handleRestartGame,
  handleStartGame,
}) => {
  return (
    <div className={styles.result}>
      <h1>Game Over!</h1>
      <p>
        Your score:{" "}
        <b>
          {score}/{questions.length}
        </b>
      </p>
      <div>
        <button onClick={handleStartGame}>Play Again</button>
        <button onClick={handleRestartGame}>Restart Game</button>
      </div>
    </div>
  );
};

export default Result;
