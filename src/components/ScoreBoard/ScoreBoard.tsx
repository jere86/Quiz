import styles from "./ScoreBoard.module.scss";

import { Question } from "../../components/Quiz/Quiz";

interface ScoreBoardProps {
  score: number;
  questions: Question[];
  currentQuestionIndex: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  questions,
  currentQuestionIndex,
  score,
}) => {
  return (
    <div className={styles.scoreboard}>
      <p>
        Question:
        <span>
          {currentQuestionIndex + 1}/{questions.length}
        </span>
      </p>
      <p>
        Score: <span>{score}</span>
      </p>
    </div>
  );
};

export default ScoreBoard;
