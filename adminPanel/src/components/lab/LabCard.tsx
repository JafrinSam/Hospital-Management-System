import React from "react";
import { FlaskRound, Users, Activity, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const LabCard = ({ lab }) => {
  return (
    <div className="bg-cyan/90 backdrop-blur-md border border-white/20 rounded-xl p-4 text-white shadow-lg hover:scale-[1.02] transition-all">
      <h2 className="text-xl font-semibold mb-2">{lab.name}</h2>
      <p className="text-sm text-gray-300 mb-4">{lab.category}</p>
      <div className="flex justify-between text-sm text-gray-200 mb-3">
        <span className="flex items-center gap-1"><Users className="w-4 h-4"/> {lab.staff.length} Staff</span>
        <span className="flex items-center gap-1"><Activity className="w-4 h-4"/> {lab.stats.testsToday} Tests Today</span>
        <span className="flex items-center gap-1"><FlaskRound className="w-4 h-4"/> {lab.stats.totalTests} Total</span>
      </div>
      <Link to={`/lab/${lab.id}`} className="text-cyan-300 font-medium flex items-center gap-1 hover:underline">
        View Details <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
