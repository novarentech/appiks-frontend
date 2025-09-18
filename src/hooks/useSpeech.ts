import { useEffect, useState } from "react";

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);

  const speak = (text: string, lang = "id-ID") => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel(); 

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return { speak, stop, speaking };
}
