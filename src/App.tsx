import { motion } from "framer-motion";
import { evaluate } from "mathjs";
import { useEffect, useRef, useState } from "react";

export default function App() {
  const [display, setDisplay] = useState<string>("0");
  const [calculated, setCalculated] = useState<boolean>(false);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (spanRef.current) {
      spanRef.current.scrollLeft = spanRef.current.scrollWidth;
    }
  }, [display]);

  const cancFn = () => {
    setDisplay((prev) => prev.slice(0, -1) || "0");
  };

  const acFn = () => {
    setDisplay("0");
  };

  const toggleSign = () => {
    const last = display.at(-1);
    const hasOperator =
      display.includes("x") ||
      display.includes("+") ||
      display.includes("-") ||
      display.includes("÷");

    if (
      last === "÷" ||
      last === "x" ||
      last === "-" ||
      last === "+" ||
      last === "%" ||
      hasOperator
    ) {
      return;
    }

    setDisplay(String(-display));
    return;
  };

  const calcResult = () => {
    const last = display.at(-1);
    const hasOperator =
      display.includes("x") ||
      display.includes("+") ||
      display.includes("-") ||
      display.includes("÷") ||
      display.includes("%");

    if (
      last === "x" ||
      last === "-" ||
      last === "+" ||
      last === "÷" ||
      !hasOperator
    ) {
      return;
    }

    try {
      setCalculated(true);
      const expression = display.replace(/x/g, "*").replace(/÷/g, "/");
      const result = evaluate(expression);
      setDisplay(String(result));
    } catch {
      setDisplay("Error");
    }
  };

  const addDigit = (button: string) => {
    const last = display.at(-1);
    if (calculated) {
      if (button === ".") {
        setDisplay("0" + button);
        return;
      }
      setDisplay(button);
      setCalculated(false);
      return;
    }

    if (button === ".") {
      const currentOperand = display.split(/[x÷+-](?!$)/).pop() ?? display;

      if (currentOperand.includes(".")) {
        return;
      }

      if (last === "x" || last === "÷" || last === "-" || last === "+") {
        setDisplay((prev) => prev + "0" + button);
        return;
      }

      setDisplay((prev) => prev + button);
      return;
    }

    setDisplay((prev) => (prev === "0" ? button : prev + button));
  };

  const addOp = (button: string) => {
    setCalculated(false);
    const last = display.at(-1);
    const secondLast = display.at(-2);

    if (display === "Error") {
      setDisplay(() => "0" + button);
      return;
    }

    if (last === ".") {
      return;
    }

    if (button === "%" && last === "%") {
      return;
    }

    if (last === "+" || last === "-" || last === "x" || last === "÷") {
      if (button === "%") {
        setDisplay((prev) => prev.slice(0, -1));
        return;
      }
    }

    if (last === "x" || last === "÷") {
      if (button === "-") {
        setDisplay((prev) => prev + button);
        return;
      } else if (button === "x" || button === "÷" || button === "+") {
        setDisplay((prev) => prev.slice(0, -1) + button);
        return;
      }
    }

    if (button === "+" && last === "-") {
      if (secondLast === "x" || secondLast === "÷") {
        setDisplay((prev) => prev.slice(0, -2) + button);
        return;
      }
    }

    if (button === "÷" || button === "x") {
      if (secondLast === "÷" || secondLast === "x") {
        setDisplay((prev) => prev.slice(0, -2) + button);
        return;
      }
    }

    if (last === "-" || last === "+") {
      setDisplay((prev) => prev.slice(0, -1) + button);
      return;
    }

    setDisplay((prev) => prev + button);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace") cancFn();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cancFn]);

  const buttons: string[] = [
    "canc",
    "AC",
    "+/-",
    "%",
    "7",
    "8",
    "9",
    "÷",
    "4",
    "5",
    "6",
    "x",
    "1",
    "2",
    "3",
    "-",
    ".",
    "0",
    "=",
    "+",
  ];

  const renderButton = () => {
    return buttons.map((button) => {
      switch (button) {
        case "canc":
          return (
            <motion.button
              key={button}
              onClick={cancFn}
              className=" bg-[#3D2A5C] rounded-4xl aspect-square w-full flex justify-center items-center "
              aria-label="Cancella ultimo carattere"
              whileTap={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <i className="fa-solid fa-delete-left pr-1"></i>
            </motion.button>
          );
        case "AC":
          return (
            <motion.button
              key={button}
              className="bg-[#3D2A5C] rounded-4xl aspect-square w-full flex justify-center items-center"
              onClick={acFn}
              whileTap={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {display === "0" ? "AC" : "C"}
            </motion.button>
          );
        case "+/-":
          return (
            <motion.button
              key={button}
              onClick={toggleSign}
              className="bg-[#3D2A5C] rounded-4xl aspect-square w-full flex justify-center items-center"
              whileTap={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {button}
            </motion.button>
          );
        case "=":
          return (
            <motion.button
              key={button}
              onClick={calcResult}
              className="bg-[#2d1f42] rounded-4xl aspect-square w-full flex justify-center items-center"
              whileTap={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {button}
            </motion.button>
          );
        case "%":
          return (
            <motion.button
              key={button}
              onClick={() => {
                addOp(button);
              }}
              className="bg-[#3D2A5C] rounded-4xl aspect-square w-full flex justify-center items-center"
              whileTap={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {button}
            </motion.button>
          );
        case "+":
        case "-":
        case "x":
        case "÷":
          return (
            <motion.button
              key={button}
              onClick={() => {
                addOp(button);
              }}
              className="bg-[#F5C518] text-[#1A1025] rounded-4xl aspect-square w-full flex justify-center items-center"
              whileTap={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {button}
            </motion.button>
          );
      }

      return (
        <motion.button
          key={button}
          onClick={() => {
            addDigit(button);
          }}
          className="bg-[#8B5CF6] rounded-4xl aspect-square w-full flex justify-center items-center"
          whileTap={{ scale: 1.15 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {button}
        </motion.button>
      );
    });
  };

  return (
    <div className="bg-[#1A1025] w-screen h-dvh flex flex-col overflow-hidden">
      {/* social icons */}
      <div className="flex justify-center gap-3 px-5 pt-3 text-white text-xl">
        <motion.a
          className="fa-solid fa-envelope bg-[#3D2A5C] p-5 rounded-full text-2xl"
          href="https://mail.google.com/mail/?view=cm&fs=1&to=gianlucademaiobiz@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          whileTap={{ scale: 1.15 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        ></motion.a>
        <motion.a
          className="fa-brands fa-linkedin bg-[#3D2A5C] p-5 rounded-full text-2xl"
          whileTap={{ scale: 1.15 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          href="https://www.linkedin.com/in/gianluca-de-maio-aa7b75429"
          target="_blank"
          rel="noopener noreferrer"
        ></motion.a>
        <motion.a
          className="fa-brands fa-github bg-[#3D2A5C] p-5 rounded-full text-2xl"
          whileTap={{ scale: 1.15 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          href="https://github.com/gianluh"
          target="_blank"
          rel="noopener noreferrer"
        ></motion.a>
      </div>

      {/* calculator */}
      <div className="flex flex-col flex-1 min-h-0 justify-end items-center mx-5 mb-5 min-w-0">
        <div className="bg-[#2D1B4E] w-full h-1/7 rounded-3xl flex justify-end items-center text-white text-5xl font-bold jbmono overflow-hidden pr-4 pl-4 mb-4 min-w-0">
          <span
            ref={spanRef}
            className="overflow-x-auto no-scrollbar whitespace-nowrap"
          >
            {display}
          </span>
        </div>
        <div className="grid grid-cols-4 text-white gap-3 w-full text-4xl jbmono font-semibold">
          {renderButton()}
        </div>
      </div>
    </div>
  );
}
