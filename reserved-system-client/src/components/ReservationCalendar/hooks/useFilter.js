import { useState } from "react";

/**
 * Universal hook for work with filter
 *
 * @param {Object} initialFilter - default filter values
 * @returns {Object}
 */
export const useFilter = (initialFilter) => {
  const [filter, setFilter] = useState(initialFilter);

  /**
   * Processes a change in the value in the filter 
   * - empty values → undefined
   * - number input → Number
   */
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFilter((prev) => {
      // reset filter
      if (value === "" || value === "true" || value === "false") {
        return { ...prev, [name]: undefined };
      }

      // number → Number
      if (type === "number") {
        return { ...prev, [name]: Number(value) };
      }

      // default (string)
      return { ...prev, [name]: value };
    });
  };

  /**
   * Clear all filter
   */
  const clearFilter = () => {
    setFilter(initialFilter);
  };

  /**
   * Return object without undefined values
   * (ready for API / URL)
   */
  const getParams = () =>
    Object.fromEntries(
      Object.entries(filter).filter(([_, v]) => v !== undefined)
    );

  return {
    filter,
    setFilter,
    handleChange,
    clearFilter,
    getParams,
  };
};
