import classnames from "classnames"
import styles from './Calculator.module.scss'
import React, { useEffect, useState } from "react";
import { operations, operationsInverse } from "../../util/constants";
import { BsFillCalculatorFill } from "react-icons/bs";
import classNames from "classnames";

export interface ICalculatorParam {
  className?: string;
  style?: React.CSSProperties;
  param1?: string;
  param2?: string;
  operator?: string;
  answer?: string;
  loading?: boolean;
  onCompute?: (
    param1: string,
    param2: string,
    operator: string
  ) => Promise<void>;
}
const Calculator = (({ className, onCompute, param1: input1, param2: input2, operator: func, answer: result, loading }: ICalculatorParam) => {

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  const [param1, setParam1] = useState<string | undefined>(input1);
  const [param2, setParam2] = useState<string | undefined>(input2);
  const [operator, setOperator] = useState<string | undefined>(func);
  const [answer, setAnswer] = useState<string | undefined>(result);
  const [operatorLabel, setOperatorLabel] = useState<string | undefined>(operationsInverse[func || ""]);
  const [targetParam, setTargetParam] = useState<number>(0);
  const [runComputation, setRunComputation] = useState<boolean>(false);
  const [cleanOnNextOperation, setClearOnNextOperation] = useState<boolean>(false);

  useEffect(() => {
    if (operator != undefined) {
      setOperatorLabel(operationsInverse[operator])
    }

    // send request to the server if all parameters and operator is set
    if (param1 != undefined && param2 != undefined && operator != undefined && runComputation) {
      setAnswer(undefined);
      if (typeof onCompute === "function") {
        onCompute(param1, param2, operator);
        setRunComputation(false);
      }
    }
  }, [onCompute, param1, param2, input1, input2, result, operator, runComputation]);

  useEffect(() => {
    // update the displayed answer
    setAnswer(result);
    setRunComputation(false);
    setClearOnNextOperation(true);
    setParam1(input1);
    setParam2(input2);
  }, [result, input1, input2]);

  const clearAll = () => {
    setParam1(undefined);
    setParam2(undefined);
    setOperator(undefined);
    setAnswer(undefined);
    setTargetParam(0);
    setOperatorLabel(undefined);
    setClearOnNextOperation(false);
  }
  return (
    <div className={classnames(styles.Calculator, className)}>
      <div className={classNames("display", styles.Screen)}>
        <span>{param1 != undefined ? param1 : ""}</span>
        <span>{operatorLabel || ""}</span>
        <span>{param2 != undefined ? param2 : ""}</span>
        <span>{(answer != undefined && `= ${answer}`) || ""}</span>
        {loading && <><div>=</div><div className={styles.Loading}></div></>}
      </div>
      <div className={styles.Grid}>
        <>
          {
            [...numbers, ".", "+/-"].map((label, index) => <button key={index} className={styles.Button} disabled={loading} onClick={() => {

              // determine the operand being populated
              let param = param1;
              let setParam = setParam1;
              let target = operator == undefined ? 0 : 1;

              if (cleanOnNextOperation) {
                clearAll();
                param = undefined;
                target = 0;
              }

              if (target != 0) {
                param = param2;
                setParam = setParam2;
              }

              let newValue = param;

              // only allow one decimal place in the parameter
              if (label == "." && ((param?.indexOf(label) || -1) < 0)) newValue = `${param || ""}${label}`;

              // process sign change
              if (label == "+/-") {
                if (param == undefined && answer != undefined) {
                  param = answer;
                  setAnswer(undefined)
                }

                if (param?.startsWith("-")) newValue = param.substring(1);
                else if (param != undefined) newValue = `-${param}`;

              }

              // otherwise, simply concatenate the number
              if (numbers.includes(Number(label))) {
                newValue = `${param || ""}${label}`
              }

              setParam(newValue);
            }}>{label}</button>)
          }
          {
            Object.keys(operations).map((label: string, index) => <button key={index} className={styles.Button} disabled={param1 == undefined || loading} onClick={() => {

              setOperator(operations[label]);

              // move the current asnwer into parameter 1
              if (answer != undefined && !isNaN(Number(answer))) {
                setOperator(operations[label]);
                setTargetParam(1);
                setParam1(answer);
                setParam2(undefined);
                setAnswer(undefined);
                setClearOnNextOperation(false);
                setRunComputation(false);
                return;
              }

              // if the answer has not been set, run the calculation
              if (param1 != undefined && param2 != undefined && answer == undefined) {
                setRunComputation(true);
                return;
              }

              // if we are on the first operand, reformat the number and switch to the second operand
              if (targetParam == 0 && param1 != undefined) {
                !isNaN(Number(param1)) && setParam1(Number(param1).toString())
                setTargetParam(1);
              }
            }}>{label}</button>)
          }
          <button className={styles.Button} disabled={param1 == undefined || param2 == undefined || operator == undefined || answer != undefined || loading} onClick={() => {
            // If the answer has not been provided
            if (answer == undefined) setRunComputation(true);
          }}>
            <BsFillCalculatorFill size="20" />
          </button>
          <button className={styles.Button} disabled={loading} onClick={() => {
            clearAll();
          }}>CA</button>
        </>
      </div>
    </div>
  )
})

export default Calculator
