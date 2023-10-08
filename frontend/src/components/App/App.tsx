import { useEffect, useState } from 'react'
import reactLogo from '../../assets/logo.png'
import styles from './App.module.scss'
import Calculator from '../Calculator/Calculator';
import { IOperationDescription } from '../../models/interfaces';

function App() {
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
        switch (val.operator) {
          case "add":
          case "sum": {
            val.operator = "+";
            break;
          }
          case "sub":
          case "subtract": {
            val.operator = "-";
            break;
          }
          case "mul":
          case "multiply": {
            val.operator = "*";
            break;
          }
        }
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
        <div className={styles.Body}>
          {/* <ul className={styles.History}>
            {history.map((his: any, ind) => <li key={ind} className={styles.HistoryItem}>
              <h4>{his.param1}</h4>
              <h4>{his.operator}</h4>
              <h4>{his.param2}</h4>
              <h4>=</h4>
              <h4>{his.answer}</h4>
            </li>)}
          </ul> */}

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
                setHistory(ope.history);
              }).catch(() => {
                alert("Something went wrong. Kindly reload to start over")
              }).finally(() => {
                setLoading(false)
              });
            }} />
        </div>
      </div>

    </div>
  )
}

export default App
