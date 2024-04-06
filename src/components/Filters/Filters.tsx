import styles from "./Filters.module.scss";
import { Category, Options } from "../../components/Quiz/Quiz";

enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

interface FiltersProps {
  options: Options;
  categories: Category[];
  handleOptionsChange: (key: keyof Options, value: number | Difficulty) => void;
  handleStartGame: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  options,
  categories,
  handleOptionsChange,
  handleStartGame,
}) => {
  return (
    <div className={styles.filters}>
      <label>
        Number of questions:
        <input
          type="number"
          value={options.amount}
          min={2}
          max={10}
          onChange={(e) =>
            handleOptionsChange("amount", parseInt(e.target.value))
          }
        />
      </label>
      <label>
        Category:
        <select
          value={options.category}
          onChange={(e) =>
            handleOptionsChange("category", parseInt(e.target.value))
          }
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Difficulty:
        <select
          value={options.difficulty}
          onChange={(e) =>
            handleOptionsChange("difficulty", e.target.value as Difficulty)
          }
        >
          <option value={Difficulty.EASY}>Easy</option>
          <option value={Difficulty.MEDIUM}>Medium</option>
          <option value={Difficulty.HARD}>Hard</option>
        </select>
      </label>
      <button onClick={handleStartGame}>Start Quiz</button>
    </div>
  );
};

export default Filters;
