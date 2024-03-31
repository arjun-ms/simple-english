import { useState } from "react";
import StarField from "@/components/StarField";
import Tagline from "@/components/Tagline";
import { IoPencilOutline } from "react-icons/io5";
import { MdClear } from "react-icons/md";
import { BsClipboard2Fill } from "react-icons/bs";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [outputVisible, setOutputVisible] = useState(false);
  const [copiedMessageVisible, setCopiedMessageVisible] = useState(false); // State to track visibility of copied message

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error("Failed to rewrite text");
      }

      const data = await response.json();
      const { output } = data;
      setApiOutput(output);
      setOutputVisible(true);
    } catch (error) {
      console.error("Error: ", error);
      setError("Failed to rewrite text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearInputText = () => {
    setInputText("");
    setIsInputEmpty(true);
  };

  const handleRewrite = () => {
    setApiOutput("");
    setOutputVisible(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiOutput)
      .then(() => {
        setCopiedMessageVisible(true);
        setTimeout(() => {
          setCopiedMessageVisible(false);
        }, 5000);
      })
      .catch((error) => console.error('Failed to copy:', error));
  };

  return (
    <div>
      <StarField />
      <div className="flex flex-col items-center">
        <div className="header">ClearSpeech</div>
        <Tagline />
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            width: "100%",
          }}
        >
          <div className="prompt-container">
            <textarea
              placeholder="start typing here"
              className="prompt-box"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setIsInputEmpty(e.target.value === "");
              }}
              disabled={isLoading}
            />
            {!isLoading &&
              !isInputEmpty && (
                <MdClear
                  className="absolute top-3 right-3 text-white text-lg"
                  onClick={clearInputText}
                />
              )}
          </div>
          <button
            type="submit"
            className="flex gap-1 items-center"
            disabled={isLoading || isInputEmpty}
            onClick={handleRewrite}
            aria-label={
              isLoading
                ? "Result is being processed"
                : isInputEmpty
                ? "Input area is empty"
                : ""
            }
          >
            {isLoading ? (
              <div className="button-content">
                <div class="la-line-scale-pulse-out la-dark la-sm">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            ) : (
              <div className="button-content flex gap-2 items-center">
                <IoPencilOutline className="text-sm" />
                <p>Rewrite</p>
              </div>
            )}
          </button>
          {outputVisible && (
            <div>
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Output</h3>
                </div>
              </div>

              <div className="relative">
                <div className="output-content">{apiOutput}</div>
                <BsClipboard2Fill
                  className="absolute top-3 right-3 text-white text-xs cursor-pointer"
                  onClick={copyToClipboard}
                />
              </div>
            </div>
          )}
          {copiedMessageVisible && (
            <p className="copied-message">Content copied to clipboard</p>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
