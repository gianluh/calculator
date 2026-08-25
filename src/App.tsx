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
  <div className="bg-[#1A1025] w-full min-h-dvh flex flex-col overflow-hidden">
    {/* Social icons */}
    <div className="flex justify-center gap-2 sm:gap-3 px-4 pt-3 text-white">
      <motion.a
        className="fa-solid fa-envelope bg-[#3D2A5C] 
        p-3 sm:p-4 md:p-5 
        rounded-full 
        text-lg sm:text-xl md:text-2xl"
        href="https://mail.google.com/mail/?view=cm&fs=1&to=gianlucademaiobiz@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
        whileTap={{ scale: 1.15 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        aria-label="Email"
      />

      <motion.a
        className="fa-brands fa-linkedin bg-[#3D2A5C] 
        p-3 sm:p-4 md:p-5 
        rounded-full 
        text-lg sm:text-xl md:text-2xl"
        href="https://www.linkedin.com/in/gianluca-de-maio-aa7b75429"
        target="_blank"
        rel="noopener noreferrer"
        whileTap={{ scale: 1.15 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        aria-label="LinkedIn"
      />

      <motion.a
        className="fa-brands fa-github bg-[#3D2A5C] 
        p-3 sm:p-4 md:p-5 
        rounded-full 
        text-lg sm:text-xl md:text-2xl"
        href="https://github.com/gianluh"
        target="_blank"
        rel="noopener noreferrer"
        whileTap={{ scale: 1.15 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        aria-label="GitHub"
      />
    </div>

    {/* Calculator */}
    <div
      className="
        flex-1 
        flex flex-col 
        justify-end 
        items-center
        w-full
        px-3 sm:px-5
        pb-3 sm:pb-5
        min-h-0
      "
    >
      <div
        className="
          bg-[#2D1B4E]
          w-full
          max-w-[500px]
          h-[clamp(80px,12vh,120px)]
          rounded-2xl sm:rounded-3xl
          flex
          justify-end
          items-center
          text-white
          font-bold
          jbmono
          overflow-hidden
          px-3 sm:px-4
          mb-3 sm:mb-4
        "
      >
        <span
          ref={spanRef}
          className="
            overflow-x-auto
            no-scrollbar
            whitespace-nowrap
            text-[clamp(2rem,8vw,3rem)]
          "
        >
          {display}
        </span>
      </div>

      <div
        className="
          grid
          grid-cols-4
          gap-2 sm:gap-3
          w-full
          max-w-[500px]
          text-[clamp(1.5rem,7vw,2.25rem)]
          jbmono
          font-semibold
          text-white
        "
      >
        {renderButton()}
      </div>
    </div>
  </div>
);
}
