import { useCallback, useEffect, useState } from "react";

import { getBoundingClientRect } from "@/lib/client-only/get-bounding-client-rect";
import { PDF_VIEWER_PAGE_SELECTOR } from "@/lib/constants/pdf-viewer";

export const useFieldPageCoords = (field: any) => {
  const [coords, setCoords] = useState({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  });

  const calculateCoords = useCallback(() => {
    const $page = document.querySelector<HTMLElement>(
      `${PDF_VIEWER_PAGE_SELECTOR}[data-page-number="${field.pageNumber}"]`
    );

    if (!$page) {
      return;
    }

    const { top, left, height, width } = getBoundingClientRect($page);

    // X and Y are percentages of the page's height and width
    const fieldX = (Number(field.pageX) / 100) * width + left;
    const fieldY = (Number(field.pageY) / 100) * height + top;

    const fieldHeight = (Number(field.pageHeight) / 100) * height;
    const fieldWidth = (Number(field.pageWidth) / 100) * width;

    setCoords({
      x: fieldX,
      y: fieldY,
      height: fieldHeight,
      width: fieldWidth,
    });
  }, [
    field.pageHeight,
    field.pageNumber,
    field.pageX,
    field.pageY,
    field.pageWidth,
  ]);

  useEffect(() => {
    calculateCoords();
  }, [calculateCoords]);

  useEffect(() => {
    const onResize = () => {
      calculateCoords();
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [calculateCoords]);

  useEffect(() => {
    const $page = document.querySelector<HTMLElement>(
      `${PDF_VIEWER_PAGE_SELECTOR}[data-page-number="${field.pageNumber}"]`
    );

    if (!$page) {
      return;
    }

    const observer = new ResizeObserver(() => {
      calculateCoords();
    });

    observer.observe($page);

    return () => {
      observer.disconnect();
    };
  }, [calculateCoords, field.pageNumber]);

  return coords;
};
