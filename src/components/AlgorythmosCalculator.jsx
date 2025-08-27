import React from 'react';

export default function AlgorythmosCalculator() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <h3 className="text-lg font-semibold mb-4">ROI (Return On Investment) Calculator</h3>
      <p className="text-sm text-slate-300 mb-4">
        Interactive calculator to estimate your savings, ROI (Return On Investment), and payback period.
        This component will be implemented with the full calculator functionality.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">Monthly Processing Volume</label>
          <input 
            type="number" 
            placeholder="e.g., 10000" 
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-400 focus:border-violet-500 focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">Current Manual Cost (€/month)</label>
          <input 
            type="number" 
            placeholder="e.g., 5000" 
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-400 focus:border-violet-500 focus:outline-none"
          />
        </div>
      </div>
      <div className="mt-6 rounded-lg bg-gradient-to-r from-[#6D00FF] via-[#7658E7] to-[#3715E0] p-4">
        <div className="grid gap-4 md:grid-cols-3 text-center">
          <div>
            <div className="text-sm text-slate-300">Estimated Monthly Savings</div>
            <div className="text-2xl font-bold">€3,200</div>
          </div>
          <div>
            <div className="text-sm text-slate-300">ROI (Return On Investment)</div>
            <div className="text-2xl font-bold">320%</div>
          </div>
          <div>
            <div className="text-sm text-slate-300">Payback Period</div>
            <div className="text-2xl font-bold">3.7 months</div>
          </div>
        </div>
      </div>
    </div>
  );
}
