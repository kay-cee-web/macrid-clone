"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** Read text aloud with the browser's voices. One utterance at a time. */
export function useSpeech() {
  const supported = useSyncExternalStore(noopSubscribe, () => "speechSynthesis" in window, () => false);
  const [speaking, setSpeaking] = useState(false);
  const speakingRef = useRef(false);

  useEffect(() => {
    speakingRef.current = speaking;
  }, [speaking]);

  // Stop talking if this message leaves the screen mid-sentence.
  useEffect(
    () => () => {
      if (speakingRef.current) window.speechSynthesis.cancel();
    },
    [],
  );

  const toggle = useCallback(
    (text: string) => {
      if (!supported) return;
      const synth = window.speechSynthesis;
      if (speaking) {
        synth.cancel();
        setSpeaking(false);
        return;
      }
      synth.cancel();
      // Markdown symbols read badly aloud.
      const utterance = new SpeechSynthesisUtterance(text.replace(/[#*_`>|]/g, ""));
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      synth.speak(utterance);
      setSpeaking(true);
    },
    [speaking, supported],
  );

  return { supported, speaking, toggle };
}
