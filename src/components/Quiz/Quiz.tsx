import { useState, useEffect } from "react";
import axios from "axios";

import styles from "./Quiz.module.scss";

import { decodeHtmlEntity } from "../../helpers/dataUtils";

import Result from "../Result/Result";
import Filters from "../Filters/Filters";
import Questions from "../Questions/Questions";
import ScoreBoard from "../ScoreBoard/ScoreBoard";

export interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  answersWithCorrectness: { answer: string; isCorrect: boolean }[];
}

export interface Category {
  id: number;
  name: string;
}

export interface Options {
  amount: number;
  category: number;
  difficulty: Difficulty;
}

interface QuestionData {
  results: Question[];
}

enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

function Quiz(): JSX.Element {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [answered, setAnswered] = useState<boolean>(false);
  const [answeredIndex, setAnsweredIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [shuffledAnswers, setShuffledAnswers] = useState<
    { answer: string; isCorrect: boolean }[]
  >([]);
  const [options, setOptions] = useState<Options>({
    amount: 5,
    category: 9,
    difficulty: Difficulty.MEDIUM,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (): Promise<void> => {
    try {
      const response = await axios.get("https://opentdb.com/api_category.php");
      const { trivia_categories } = response.data;
      setCategories(trivia_categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleOptionsChange = (
    key: keyof Options,
    value: number | Difficulty
  ) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [key]: value,
    }));
  };

  const fetchQuestions = async (): Promise<void> => {
    const { amount, category, difficulty } = options;
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}`;

    try {
      const response = await axios.get<QuestionData>(url);
      const decodedQuestions = response.data.results.map(
        (question: Question) => {
          const decodedQuestion: Question = {
            ...question,
            question: decodeHtmlEntity(question.question),
            correct_answer: decodeHtmlEntity(question.correct_answer),
            incorrect_answers: question.incorrect_answers.map(
              (answer: string) => decodeHtmlEntity(answer)
            ),
            answersWithCorrectness: question.incorrect_answers
              .map((answer: string) => ({
                answer: decodeHtmlEntity(answer),
                isCorrect: false,
              }))
              .concat({
                answer: decodeHtmlEntity(question.correct_answer),
                isCorrect: true,
              }),
          };
          return decodedQuestion;
        }
      );
      setQuestions(decodedQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShuffledAnswers(
        shuffleAnswers(decodedQuestions[0].answersWithCorrectness)
      );
      setShowResult(false);
      setGameStarted(true);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const shuffleAnswers = (
    answersWithCorrectness: { answer: string; isCorrect: boolean }[]
  ): { answer: string; isCorrect: boolean }[] => {
    const shuffled = [...answersWithCorrectness];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleAnswer = (selectedAnswer: string, index: number) => {
    if (answered) return;
    const isCorrect =
      selectedAnswer === questions[currentQuestionIndex].correct_answer;
    setAnswered(true);
    setAnsweredIndex(index);

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    setTimeout(() => {
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < questions.length) {
        setCurrentQuestionIndex(nextQuestionIndex);
        setAnswered(false);
        setAnsweredIndex(null);
        setShuffledAnswers(
          shuffleAnswers(questions[nextQuestionIndex].answersWithCorrectness)
        );
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  const handleRestartGame = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setAnswered(false);
    setAnsweredIndex(null);
    setShuffledAnswers([]);
    setGameStarted(false);
    setOptions({
      amount: 5,
      category: 9,
      difficulty: Difficulty.MEDIUM,
    });
  };

  const handleStartGame = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setAnswered(false);
    setAnsweredIndex(null);
    setShuffledAnswers([]);
    fetchQuestions();
  };

  return (
    <>
      {showResult ? (
        <Result
          score={score}
          questions={questions}
          handleStartGame={handleStartGame}
          handleRestartGame={handleRestartGame}
        />
      ) : (
        <>
          {!gameStarted && (
            <Filters
              options={options}
              categories={categories}
              handleOptionsChange={handleOptionsChange}
              handleStartGame={handleStartGame}
            />
          )}
          {gameStarted && questions.length > 0 && (
            <div className={styles.game}>
              <Questions
                question={questions[currentQuestionIndex]}
                shuffledAnswers={shuffledAnswers}
                handleAnswer={handleAnswer}
                answered={answered}
                answeredIndex={answeredIndex}
              />
              <ScoreBoard
                score={score}
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Quiz;
