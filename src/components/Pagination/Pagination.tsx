import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (
        (i === currentPage - 2 && currentPage > 3) ||
        (i === currentPage + 2 && currentPage < totalPages - 2)
      ) {
        pages.push('...');
      }
    }

    return [...new Set(pages)];
  };

  return (
    <AnimatePresence mode="wait">
  <motion.div
    className="flex mt-5 justify-center gap-2 flex-wrap"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    {/* Botón anterior */}
    <motion.button
      key="prev"
      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      className="px-3 py-1 rounded bg-white text-sky-950 shadow disabled:opacity-50"
      whileTap={{ scale: 0.9 }}
    >
      ‹
    </motion.button>

    {/* Páginas visibles */}
    {getVisiblePages().map((page, idx) =>
      typeof page === 'number' ? (
        <motion.button
          key={page}
          onClick={() => onPageChange(page)}
          whileTap={{ scale: 0.95 }}
          className={`px-3 py-1 rounded shadow ${
            currentPage === page
              ? 'bg-sky-950 text-white font-bold'
              : 'bg-white text-sky-950'
          }`}
        >
          {page}
        </motion.button>
      ) : (
        <motion.span
          key={`ellipsis-${idx}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-2 text-sky-950"
        >
          ...
        </motion.span>
      )
    )}

    {/* Botón siguiente */}
    <motion.button
      key="next"
      onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
      className="px-3 py-1 rounded bg-white text-sky-950 shadow disabled:opacity-50"
      whileTap={{ scale: 0.9 }}
    >
      ›
    </motion.button>
  </motion.div>
</AnimatePresence>
  );
}
