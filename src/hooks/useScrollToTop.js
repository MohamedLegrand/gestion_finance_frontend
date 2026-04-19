import { useCallback } from "react";

const useScrollToTop = () => {
  const scrollToTop = useCallback((behavior = "smooth") => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: behavior
    });
  }, []);

  const scrollToElement = useCallback((elementId, behavior = "smooth") => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: behavior,
        block: "start",
        inline: "nearest"
      });
    }
  }, []);

  return { scrollToTop, scrollToElement };
};

export default useScrollToTop;