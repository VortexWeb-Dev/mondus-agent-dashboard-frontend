import React from "react";
import { useState, useEffect } from "react";
import {
  Award,
  ChevronUp,
  ChevronDown,
  Users,
  Briefcase,
  TrendingUp,
  Target,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
} from "recharts";
import fetchData from "../utils/fetchData";

const PerformanceReport = () => {
  const [showChart, setShowChart] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState([]);
  const [commissionData, setCommissionData] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("user"))?.ID;
        if (!userId) throw new Error("User ID not found");

        // Fetch both in parallel
        const [commission, performance] = await Promise.all([
          fetchData(`${import.meta.env.VITE_AGENT_RANKING}${userId}`),
          fetchData(`${import.meta.env.VITE_AGENT_PERFORMANCE}${userId}`), // example second API
        ]);

        console.log(performance);
        console.log(commission);

        setPerformanceData(performance);
        setCommissionData(commission);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setLoading(false);
        setPerformanceData(null);
        setCommissionData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="text-4xl text-center text-gray-600 dark:text-white">
        Loading...
      </div>
    );
  }

  if (!performanceData || !commissionData) {
    return (
      <div className="text-4xl text-center text-gray-600 dark:text-white">
        No data available
      </div>
    );
  }

  // if(!loading || commissionData.length !=0 || performanceData.length != 0){
  console.log(performanceData);
  console.log(commissionData);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString("default", { month: "short" });

  // Extract relevant data from the commission data
  const currentYearData = commissionData[currentYear] || {};
  const currentMonthData =
    currentYearData.months?.find((m) => m.month === currentMonth) || {};
  const yearToDateCommission = currentYearData.year?.grossCommission || 0;
  const monthlyRank = currentMonthData.rank || 0;
  const yearlyRank = currentYearData.year?.rank || 0;
  const monthlyGrossCommission = currentMonthData.grossCommission || 0;

  // Extract performance data for the current month
  const performanceMonth = Object.keys(performanceData.performance)[0]; // Get the first month key
  const currentPerformance =
    performanceData.performance[performanceMonth] || {};
  // }

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderPerformanceSection = () => {
    const isExpanded = expandedSection === "performance";

    return (
      <div className="mb-6">
        <div
          className="flex items-center justify-between cursor-pointer bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mb-2"
          onClick={() => toggleSection("performance")}
        >
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-medium text-blue-900 dark:text-blue-100">
              Performance Metrics
            </h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          )}
        </div>

        {isExpanded && (
          <div className="pl-4 pr-2 py-2 bg-blue-200 dark:bg-blue-950/40 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: "Monthly Rank",
                  value: monthlyRank ? `#${monthlyRank}` : "N/A",
                },
                {
                  label: "YTD Ranking",
                  value: yearlyRank ? `#${yearlyRank}` : "N/A",
                },
                {
                  label: "Monthly Gross Commission",
                  value: formatCurrency(monthlyGrossCommission),
                },
                {
                  label: "YTD Gross Commission",
                  value: formatCurrency(yearToDateCommission),
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg"
                >
                  <p className="text-blue-700 dark:text-blue-400 text-sm">
                    {label}
                  </p>
                  <p className="text-blue-900 dark:text-white text-xl font-semibold">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLeadsSection = () => {
    const isExpanded = expandedSection === "leads";

    return (
      <div className="mb-6">
        <div
          className="flex items-center justify-between cursor-pointer bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mb-2"
          onClick={() => toggleSection("leads")}
        >
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-medium text-blue-900 dark:text-blue-100">
              Deals & Meetings
            </h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          )}
        </div>

        {isExpanded && (
          <div className="pl-4 pr-2 py-2 bg-blue-200 dark:bg-blue-950/40 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: "Closed Deals",
                  value: currentPerformance.closedDeals || 0,
                },
                {
                  label: "Active Deals",
                  value: currentPerformance.activeDeals || 0,
                },
                {
                  label: "Unassigned Deals",
                  value: currentPerformance.unassignedDeals || 0,
                },
                {
                  label: "Deals Without Updates",
                  value: currentPerformance.dealsWithoutUpdates || 0,
                },
                {
                  label: "Meetings Arranged",
                  value: currentPerformance.meetingsArranged || 0,
                },
                {
                  label: "Monthly Earnings",
                  value: formatCurrency(
                    currentPerformance.monthlyEarnings || 0
                  ),
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg"
                >
                  <p className="text-blue-700 dark:text-blue-400 text-sm">
                    {label}
                  </p>
                  <p className="text-blue-900 dark:text-white text-xl font-semibold">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAdsSection = () => {
    const isExpanded = expandedSection === "ads";

    return (
      <div className="mb-6">
        <div
          className="flex items-center justify-between cursor-pointer bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mb-2"
          onClick={() => toggleSection("ads")}
        >
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-medium text-blue-900 dark:text-blue-100">
              Advertisements
            </h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          )}
        </div>

        {isExpanded && (
          <div className="pl-4 pr-2 py-2 bg-blue-200 dark:bg-blue-950/40 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Live Ads", value: currentPerformance.liveAds || 0 },
                {
                  label: "Published Ads",
                  value: currentPerformance.publishedAds || 0,
                },
                { label: "Draft Ads", value: currentPerformance.draftAds || 0 },
                {
                  label: "Total Worth of Ads",
                  value: formatCurrency(
                    currentPerformance.totalWorthOfAds || 0
                  ),
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg"
                >
                  <p className="text-blue-700 dark:text-blue-400 text-sm">
                    {label}
                  </p>
                  <p className="text-blue-900 dark:text-white text-xl font-semibold">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPlatformsSection = () => {
    const isExpanded = expandedSection === "platforms";

    return (
      <div className="mb-6">
        <div
          className="flex items-center justify-between cursor-pointer bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mb-2"
          onClick={() => toggleSection("platforms")}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-medium text-blue-900 dark:text-blue-100">
              Platform Distribution
            </h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          )}
        </div>

        {isExpanded && (
          <div className="pl-4 pr-2 py-2 bg-blue-200 dark:bg-blue-950/40 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: "Property Finder Ads",
                  value: currentPerformance.pfAds || 0,
                },
                { label: "Bayut Ads", value: currentPerformance.bayutAds || 0 },
                {
                  label: "Dubizzle Ads",
                  value: currentPerformance.dubizzleAds || 0,
                },
                {
                  label: "Website Ads",
                  value: currentPerformance.websiteAds || 0,
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg"
                >
                  <p className="text-blue-700 dark:text-blue-400 text-sm">
                    {label}
                  </p>
                  <p className="text-blue-900 dark:text-white text-xl font-semibold">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderChart = () => {
    const chartData = [
      { name: "Live Ads", value: currentPerformance.liveAds || 0 },
      { name: "Published Ads", value: currentPerformance.publishedAds || 0 },
      { name: "Closed Deals", value: currentPerformance.closedDeals || 0 },
      { name: "Active Deals", value: currentPerformance.activeDeals || 0 },
      { name: "Meetings", value: currentPerformance.meetingsArranged || 0 },
    ];

    return (
      <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800 dark:text-gray-100 font-medium">
            Performance Metrics
          </h3>
          <div className="tooltip relative group">
            <HelpCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <span className="tooltip-text invisible group-hover:visible absolute right-0 w-48 p-2 mt-2 text-xs bg-gray-700 dark:bg-gray-900 text-white rounded shadow-lg z-10">
              Showing absolute values for each performance metric
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200 dark:stroke-gray-700"
              />
              <XAxis
                type="number"
                tick={{ fill: "#64748b", fontSize: 12 }}
                className="text-gray-500 dark:text-gray-400"
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: "#64748b", fontSize: 12 }}
                width={100}
                className="text-gray-500 dark:text-gray-400"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f8fafc",
                  borderColor: "#e2e8f0",
                  color: "#1e293b",
                  borderRadius: "0.375rem",
                  padding: "0.5rem",
                  fontSize: "0.875rem",
                }}
                formatter={(value) => [`${value}`, "Count"]}
              />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                className="fill-blue-500 dark:fill-blue-400"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-100 dark:bg-gray-300 py-1 px-8 rounded-full">
            <p className="text-gray-500 dark:text-gray-600 mb-1 text-lg">
              Total Ads
            </p>
            <p className="text-gray-900 dark:text-gray-800 font-bold text-xl">
              {currentPerformance.totalAds || 0}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-300 py-1 px-8 rounded-full">
            <p className="text-gray-500 dark:text-gray-600 mb-1 text-lg">
              Monthly Rank
            </p>
            <p className="text-gray-900 dark:text-gray-800 font-bold text-xl">
              {monthlyRank || monthlyRank == 0 ? `#${monthlyRank}` : "N/A"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-blue-950 text-blue-900 dark:text-white p-6 rounded-xl max-w-[100%] h-fit mx-auto shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-blue-300 dark:border-blue-800">
        <div>
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            Performance Report
          </h2>
          <p className="text-blue-600 dark:text-blue-400">
            {performanceMonth || currentMonth} {currentYear}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
            <p className="text-blue-700 dark:text-blue-400 text-sm">
              Agent Name
            </p>
            <p className="text-lg font-medium text-blue-900 dark:text-blue-100">
              {JSON.parse(localStorage.getItem("user")).NAME}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              #{JSON.parse(localStorage.getItem("user")).ID}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100">
            Summary
          </h3>
          <button
            onClick={() => setShowChart(!showChart)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg text-sm"
          >
            <BarChart3 className="h-4 w-4" />
            {showChart ? "Hide Chart" : "Show Chart"}
          </button>
        </div>

        <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: (
                  <Target className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                ),
                label: "Total Ads",
                value: currentPerformance.totalAds || 0,
              },
              {
                icon: (
                  <Award className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                ),
                label: "Gross Commission",
                value: formatCurrency(monthlyGrossCommission),
              },
              {
                icon: (
                  <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                ),
                label: "YTD Commission",
                value: formatCurrency(yearToDateCommission),
              },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="bg-blue-200 dark:bg-blue-900/30 p-3 rounded-lg flex items-center"
              >
                {icon}
                <div>
                  <p className="text-blue-700 dark:text-blue-400 text-sm">
                    {label}
                  </p>
                  <p className="text-blue-900 dark:text-white text-xl font-semibold">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showChart && renderChart()}

      {renderPerformanceSection()}
      {renderLeadsSection()}
      {renderAdsSection()}
      {renderPlatformsSection()}
    </div>
  );
};

export default PerformanceReport;
