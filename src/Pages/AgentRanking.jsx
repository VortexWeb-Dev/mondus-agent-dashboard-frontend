import React, { useState, useEffect } from "react";
import { ChevronDown, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { agentRankingData } from "../mockData/mockData";
import fetchData from "../utils/fetchData";

const AgentRankingDashboard = () => {
  const [agentRankingData, setAgentRankingData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("Jan");
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState([]);
  useEffect(() => {
    fetchData(
      `${import.meta.env.VITE_AGENT_RANKING}${
        JSON.parse(localStorage.getItem("user")).ID
      }`
    )
      .then((data) => {
        console.log("Received Data:", data);
        setAgentRankingData(data);
        const fetchedYears = Object.keys(data).sort((a, b) => b - a);
        setYears(fetchedYears);
        setSelectedYear(fetchedYears[0]);
      })
      .catch((err) => {
        console.error("Fetch error:", err.message);
        setLoading(false);
        setAgentRankingData(null);
      });
    setLoading(false);
  }, []);

  if (loading)
    return (
      <div className="text-4xl text-center text-gray-600 dark:text-white">
        Loading...
      </div>
    );

  if (!agentRankingData)
    return (
      <div className="text-4xl text-center text-gray-600 dark:text-white">
        No data available
      </div>
    );

  const currentData = agentRankingData[selectedYear];
  const months = currentData.months.map((item) => item.month);

  const getMonthlyTrend = (index) => {
    if (index === 0) return null;
    const currentRank = currentData.months[index].rank;
    const prevRank = currentData.months[index - 1].rank;
    if (currentRank < prevRank) return "up";
    if (currentRank > prevRank) return "down";
    return "same";
  };

  const getQuarterlyTrend = (index) => {
    if (index === 0) return null;
    const currentRank = currentData.quarters[index].rank;
    const prevRank = currentData.quarters[index - 1].rank;
    if (currentRank < prevRank) return "up";
    if (currentRank > prevRank) return "down";
    return "same";
  };

  const TrendIndicator = ({ trend }) => {
    if (!trend) return null;
    if (trend === "up")
      return <ArrowUpRight size={16} className="text-green-500" />;
    if (trend === "down")
      return <ArrowDownRight size={16} className="text-red-500" />;
    return <Minus size={16} className="text-gray-500 dark:text-gray-400" />;
  };

  const handleYearClick = (year) => {
    if (agentRankingData[year]) {
      setSelectedYear(year);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {/* <div className="text-xl font-semibold text-gray-800 dark:text-white bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 p-4 rounded-2xl shadow-lg">
                Welcome {JSON.parse(localStorage.getItem("user").NAME)}
              </div> */}
          <div className="bg-blue-100 dark:bg-blue-800 rounded-2xl p-4 shadow-sm mb-6">
            <h1 className="text-4xl font-semibold text-gray-600 dark:text-blue-100 tracking-tight">
              Agent Rankings {selectedYear}
            </h1>
          </div>

          <div className="relative">
            <button
              className="flex items-center bg-white dark:bg-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>Year: {selectedYear}</span>
              <ChevronDown size={16} className="ml-2" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-lg z-10">
                {years.map((year) => (
                  <button
                    key={year}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => {
                      setSelectedYear(year);
                      setDropdownOpen(false);
                    }}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Performance */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-colors">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Monthly Performance
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-100 rounded-lg dark:bg-blue-600">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-300">
                      Month
                    </th>
                    <th className="text-center py-3 px-2 text-gray-600 dark:text-gray-300">
                      Rank
                    </th>
                    <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-300">
                      Gross Commission
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.months.map((item, index) => (
                    <tr
                      key={item.month}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="py-3 px-2 font-medium text-gray-700 dark:text-gray-100">
                        {item.month}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="flex items-center justify-center">
                          <span
                            className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                              item.rank <= 3
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : "text-gray-700 dark:text-gray-100"
                            }`}
                          >
                            {item.rank}
                          </span>
                          <span className="ml-2">
                            <TrendIndicator trend={getMonthlyTrend(index)} />
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right font-medium text-gray-800 dark:text-gray-100">
                        {formatCurrency(item.grossCommission)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quarterly Performance */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-colors">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Quarterly Performance
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-100 rounded-lg dark:bg-blue-600">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300">
                      Quarter
                    </th>
                    <th className="text-center py-3 px-4 text-gray-600 dark:text-gray-300">
                      Rank
                    </th>
                    <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-300">
                      Gross Commission
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.quarters.map((item, index) => (
                    <tr
                      key={item.quarter}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="py-4 px-4 font-medium text-gray-700 dark:text-gray-100">
                        {item.quarter}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center">
                          <span
                            className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                              item.rank <= 3
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : "text-gray-700 dark:text-gray-100"
                            }`}
                          >
                            {item.rank}
                          </span>
                          <span className="ml-2">
                            <TrendIndicator trend={getQuarterlyTrend(index)} />
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-gray-800 dark:text-gray-100">
                        {formatCurrency(item.grossCommission)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Yearly Performance */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-colors">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Yearly Performance
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-100 rounded-lg dark:bg-blue-600">
                  <tr className="border-b border-gray-200 dark:border-gray-700 rounded-lg">
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300">
                      Year
                    </th>
                    <th className="text-center py-3 px-4 text-gray-600 dark:text-gray-300">
                      Rank
                    </th>
                    <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-300">
                      Gross Commission
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {years.map((year) => (
                    <tr
                      key={year}
                      className={`cursor-pointer border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        year === selectedYear
                          ? "bg-blue-50 dark:bg-blue-900"
                          : ""
                      }`}
                      onClick={() => handleYearClick(year)}
                    >
                      <td className="py-4 px-4 text-md font-medium text-gray-700 dark:text-gray-100 underline">
                        {year}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center">
                          <span
                            className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${
                              agentRankingData[year].year.rank <= 3
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 font-bold"
                                : "text-gray-700 dark:text-gray-100"
                            }`}
                          >
                            {agentRankingData[year].year.rank}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-lg text-gray-800 dark:text-gray-100">
                        {formatCurrency(
                          agentRankingData[year].year.grossCommission
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentRankingDashboard;
