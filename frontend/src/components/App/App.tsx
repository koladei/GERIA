import { useEffect, useState } from 'react'
import styles from './App.module.scss'
import Calculator from '../Calculator/Calculator';
import { IOperationDescription } from '../../models/interfaces';
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { BsClockHistory, BsFillCalculatorFill } from "react-icons/bs";
import { AiOutlineClear } from "react-icons/ai"
import { operationsInverse } from '../../util/constants';
import classNames from 'classnames';

function App() {
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<IOperationDescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<IOperationDescription>({});
  const [calcToggleTitle, setCalcToggleTitle] = useState("");
  const [toggleClearHistoryModal, setToggleClearHistoryModal] = useState(false);

  useEffect(() => {
    if (showHistory) setCalcToggleTitle("Click to return to calculator");
    if (!showHistory) setCalcToggleTitle("Click to view calculation history");
  }, [showHistory]);

  useEffect(() => {
    const getHistory = async () => {

      const f = await fetch("/api/calc/history");
      return await f.json();
    }

    setLoading(true);
    getHistory().then((his) => {
      setHistory(mapHistory(his))
    }).finally(() => {
      setLoading(false)
    });
  }, []);

  const mapHistory = (his: IOperationDescription[]) => {
    return his.map((val) => {
      val.operator = operationsInverse[val.operator || ""]
      return val;
    })
  }

  const clearHistory = async () => {
    const f = await fetch("/api/calc/history/clear");
    const deleteOps = await f.json();

    setHistory(mapHistory(deleteOps.history));
  }

  return (
    <div className={styles.App}>
      <div className={styles.Content}>
        <div className={styles.Heading}>
          <div className={styles.Logo} style={{ backgroundImage: `url('logo.png')` }} />
          <div className={styles.Title}>REST Calculator App</div>
        </div>

        {
          !showHistory && <div className={classNames(styles.Controls, styles["btn-group"])} title={calcToggleTitle} >
            <button className={classNames(styles.btn, styles["btn-warning"], styles["btn-sm"])} onClick={() => {
              setShowHistory(!showHistory);
            }}>
              <BsClockHistory size="20" />
            </button>
          </div>
        }

        {/* when the history is visible */}
        {
          showHistory &&
          <div className={classNames(styles.Controls, styles["btn-group"], styles["btn-group-sm"])} title={calcToggleTitle}>
            <button className={classNames(styles.btn, styles["btn-danger"], styles["btn-sm"])} disabled={!(history?.length > 0)} onClick={() => {
              setToggleClearHistoryModal(true);
            }}>
              <AiOutlineClear size="20" />
            </button>
            <button className={classNames(styles.btn, styles["btn-warning"], styles["btn-sm"])} onClick={() => {
              setShowHistory(!showHistory);
            }}>
              <BsFillCalculatorFill size="20" />
            </button>
          </div>
        }
        <div className={styles.Body}>
          {
            showHistory &&
            <ul className={classNames(styles.History, styles["list-group"])}>
              {
                !(history?.length > 0) &&
                <li className={classNames(styles["list-group-item"], styles["text-center"])}>There is nothing here yet.</li>
              }
              {
                history?.map((his: IOperationDescription, ind) =>
                  <li key={ind} className={classNames(styles["list-group-item"], styles.HistoryItem)}>
                    <span>{his.param1}</span>
                    <span>{his.operator}</span>
                    <span>{his.param2}</span>
                    <span>=</span>
                    <span style={{ minWidth: "50%" }}>{his.answer}</span>
                  </li>)
              }
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
      <Modal cssModule={styles} centered isOpen={toggleClearHistoryModal} toggle={() => setToggleClearHistoryModal(!toggleClearHistoryModal)}>
        <ModalHeader cssModule={styles}>
          Clear History
        </ModalHeader>
        <ModalBody cssModule={styles}>
          Once you clear the history, it cannot be undone.<br />
          Do you still want to clear the history?
        </ModalBody>
        <ModalFooter cssModule={styles}>
          <div className={classNames(styles.Controls, styles["btn-group"], styles["btn-group-sm"])} title={calcToggleTitle}>
            <button className={classNames(styles.btn, styles["btn-danger"], styles["btn-sm"])} onClick={() => {
              clearHistory().then(() => setToggleClearHistoryModal(false));
            }}> Yes
            </button>
            <button className={classNames(styles.btn, styles["btn-success"], styles["btn-sm"])} onClick={() => {
              setToggleClearHistoryModal(false);
            }}>
              No
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default App
