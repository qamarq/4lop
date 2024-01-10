"use client"

import React, { useState, useEffect, MouseEvent, Fragment } from "react";
import styles from "@/styles/Pagination.module.scss"
import { motion } from "framer-motion";

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

let FIRST = true

interface PaginationProps {
  totalRecords: number;
  pageLimit?: number;
  pageNeighbours?: number;
  onPageChanged?: (paginationData: PaginationData) => void;
  onClick?: () => void;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  pageLimit: number;
  totalRecords: number;
}

const range = (from: number, to: number, step = 1): number[] => {
  let i = from;
  const rangeArr = [];

  while (i <= to) {
    rangeArr.push(i);
    i += step;
  }

  return rangeArr;
};

const Pagination: React.FC<PaginationProps> = ({
  totalRecords = 0,
  pageLimit = 30,
  pageNeighbours = 0,
  onPageChanged,
  onClick
}: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalRecords / pageLimit);

//   useEffect(() => {
//     gotoPage(1);
//     console.log(totalRecords)
//   }, [totalRecords]);

  const gotoPage = (page: number) => {
    const newCurrentPage = Math.max(0, Math.min(page, totalPages));

    const paginationData: PaginationData = {
      currentPage: newCurrentPage,
      totalPages,
      pageLimit,
      totalRecords,
    };

    setCurrentPage(newCurrentPage);

    if (onPageChanged) {
      onPageChanged(paginationData);
    }
  };

  const handleClick = (page: number, evt: MouseEvent) => {
    evt.preventDefault();
    gotoPage(page);
  };

  const handleMoveLeft = (evt: MouseEvent) => {
    evt.preventDefault();
    gotoPage(currentPage - pageNeighbours * 2 - 1);
  };

  const handleMoveRight = (evt: MouseEvent) => {
    evt.preventDefault();
    gotoPage(currentPage + pageNeighbours * 2 + 1);
  };

  const fetchPageNumbers = () => {
    const totalNumbers = pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      let pages: (number | string)[] = [];

      const leftBound = currentPage - pageNeighbours;
      const rightBound = currentPage + pageNeighbours;
      const beforeLastPage = totalPages - 1;

      const startPage = leftBound > 2 ? leftBound : 2;
      const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;

      pages = range(startPage, endPage);

      const pagesCount = pages.length;
      const singleSpillOffset = totalNumbers - pagesCount - 1;

      const leftSpill = startPage > 2;
      const rightSpill = endPage < beforeLastPage;

      const leftSpillPage = LEFT_PAGE;
      const rightSpillPage = RIGHT_PAGE;

      if (leftSpill && !rightSpill) {
        const extraPages = range(startPage - singleSpillOffset, startPage - 1);
        pages = [leftSpillPage, ...extraPages, ...pages];
      } else if (!leftSpill && rightSpill) {
        const extraPages = range(endPage + 1, endPage + singleSpillOffset);
        pages = [...pages, ...extraPages, rightSpillPage];
      } else if (leftSpill && rightSpill) {
        pages = [leftSpillPage, ...pages, rightSpillPage];
      }

      return [1, ...pages, totalPages];
    }

    return range(1, totalPages);
  };

  if (!totalRecords || totalPages === 1) {
    return null;
  }

  const pages = fetchPageNumbers();

  return (
    <motion.div layout className="d-flex flex-row py-4 align-items-center">

      <ul className={styles.pagination} onClick={onClick}>
          {pages.map((page, index) => {
            if (page === LEFT_PAGE) {
              return (
                <li key={index} className={styles["page-item"]}>
                  <a
                    className={styles["page-link"]}
                    href="#"
                    aria-label="Previous"
                    onClick={(evt) => handleMoveLeft(evt)}
                  >
                    <span aria-hidden="true">&laquo;</span>
                    <span className="sr-only">Previous</span>
                  </a>
                </li>
              );
            }

            if (page === RIGHT_PAGE) {
              return (
                <li key={index} className={styles["page-item"]}>
                  <a
                    className={styles["page-link"]}
                    href="#"
                    aria-label="Next"
                    onClick={(evt) => handleMoveRight(evt)}
                  >
                    <span aria-hidden="true">&raquo;</span>
                    <span className="sr-only">Next</span>
                  </a>
                </li>
              );
            }

            return (
              <li
                key={index}
                className={`${styles["page-item"]} ${currentPage === page ? styles.active : ""}`}
              >
                <a
                  className={styles["page-link"]}
                  href="#"
                  onClick={(evt) => handleClick(page as number, evt)}
                >
                  {page}
                </a>
                {currentPage === page && (
                    <motion.span layoutId="pagination" className={styles.active}></motion.span>
                )}
              </li>
            );
          })}
        </ul>

    </motion.div>
  );
};

export default Pagination;
