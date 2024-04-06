import styles from "./Questions.module.scss";
import { FaRegSmile, FaRegFrown } from "react-icons/fa";

import { Question } from "../../components/Quiz/Quiz";

interface QuestionsProps {
  question: Question;
  shuffledAnswers: { answer: string; isCorrect: boolean }[];
  handleAnswer: (selectedAnswer: string, index: number) => void;
  answered: boolean;
  answeredIndex: number | null;
}

const Questions: React.FC<QuestionsProps> = ({
  question,
  shuffledAnswers,
  handleAnswer,
  answered,
  answeredIndex,
}) => {
  return (
    <div className={styles.questions}>
      <p className={styles.question}>{question.question}</p>
      {question.type === "multiple" ? (
        <div className={styles.answers}>
          {shuffledAnswers.map(({ answer, isCorrect }, index) => (
            <div
              key={index}
              className={`${styles.answer} ${
                answered && answeredIndex === index
                  ? isCorrect
                    ? styles.correct
                    : styles.incorrect
                  : ""
              }`}
            >
              <button onClick={() => handleAnswer(answer, index)}>
                {answer}
              </button>
              {answered && answeredIndex === index && (
                <p>{isCorrect ? <FaRegSmile /> : <FaRegFrown />}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.answers}>
          <div
            className={`${styles.answer} ${
              answered && answeredIndex === 0
                ? question.correct_answer === "True"
                  ? styles.correct
                  : styles.incorrect
                : ""
            }`}
          >
            <button onClick={() => handleAnswer("True", 0)}>True</button>
            {answered && answeredIndex === 0 && (
              <p>
                {question.correct_answer === "True" ? (
                  <FaRegSmile />
                ) : (
                  <FaRegFrown />
                )}
              </p>
            )}
          </div>
          <div
            className={`${styles.answer} ${
              answered && answeredIndex === 1
                ? question.correct_answer === "False"
                  ? styles.correct
                  : styles.incorrect
                : ""
            }`}
          >
            <button onClick={() => handleAnswer("False", 1)}>False</button>
            {answered && answeredIndex === 1 && (
              <p>
                {question.correct_answer === "False" ? (
                  <FaRegSmile />
                ) : (
                  <FaRegFrown />
                )}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;
