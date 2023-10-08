import { useEffect, useState } from 'react'
import styles from './App.module.scss'
import Calculator from '../Calculator/Calculator';
import { IOperationDescription } from '../../models/interfaces';
import { BsClockHistory, BsFillCalculatorFill } from "react-icons/bs"
import { operationsInverse } from '../../util/constants';

function App() {
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<IOperationDescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<IOperationDescription>({});

  useEffect(() => {
    const getHistory = async () => {

      const f = await fetch("/api/calc/history");
      return await f.json();
    }

    setLoading(true);
    getHistory().then((his) => {
      setHistory(his.map((val: IOperationDescription) => {
        val.operator = operationsInverse[val.operator || ""]
        return val;
      }))
    }).finally(() => {
      setLoading(false)
    });
  }, []);

  return (
    <div className={styles.App}>
      <div className={styles.Content}>
        <div className={styles.Heading}>
          <div className={styles.Logo} style={{ backgroundImage: `url('logo.png')` }} />
          <div className={styles.Title}>REST Calculator App</div>
        </div>
        <div className={styles.Controls} title={showHistory ? "Click to return to calculator" : "Click to view calculation history"} onClick={() => {
          setShowHistory(!showHistory);
        }}>
          {
            !showHistory &&
            <BsClockHistory size="30" />
          }

          {
            showHistory &&
            <BsFillCalculatorFill size="30" />
          }
        </div>
        <div className={styles.Body}>
          {
            showHistory &&
            <ul className={styles.History}>
              {history.map((his: IOperationDescription, ind) => <li key={ind} className={styles.HistoryItem}>
                <h4>{his.param1}</h4>
                <h4>{his.operator}</h4>
                <h4>{his.param2}</h4>
                <h4>=</h4>
                <h4 style={{ minWidth: "50%" }}>{his.answer}</h4>
              </li>)}
            </ul>
          }
          {
            !showHistory &&
            <Calculator
              loading={loading}
              param1={currentOperation.param1}
              param2={currentOperation.param2}
              operator={currentOperation.operator}
              answer={currentOperation.answer}
              className={styles.Calculator}
              onCompute={(param1, param2, operator) => {
                const getAnswer = async () => {

                  const f = await fetch(`/api/calc/run/${operator}`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      param1: Number(param1),
                      param2: Number(param2)
                    })
                  });
                  return await f.json();
                }

                setLoading(true);
                return getAnswer().then((ope) => {
                  const { param1, param2, operator, answer } = ope.calculation;
                  const cO = { param1, param2, operator, answer }
                  setCurrentOperation(cO);
                  setHistory(ope.history.map((val: IOperationDescription) => {
                    val.operator = operationsInverse[val.operator || ""]
                    return val;
                  }))
                }).catch(() => {
                  alert("Something went wrong. Kindly reload to start over")
                }).finally(() => {
                  setLoading(false)
                });
              }} />
          }
        </div>
      </div>

    </div>
  )
}

export default App
