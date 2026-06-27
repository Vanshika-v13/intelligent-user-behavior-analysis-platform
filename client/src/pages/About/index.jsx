import React from 'react';
import PageHeader from '../../components/dashboard/PageHeader';
import Card from '../../components/ui/Card';
import { Database, Code2, LineChart, Brain, Target, ArrowRight } from 'lucide-react';

const sectionData = [
  {
    title: 'Project Overview',
    icon: <Target className="w-6 h-6 text-primary" />,
    content: 'The Intelligent User Behavior Analytics Platform is a modern SaaS solution designed to track, analyze, and visualize user interactions across digital products. It provides deep insights into user journeys, session engagement, and feature adoption to help teams make data-driven decisions.',
  },
  {
    title: 'Technologies Used',
    icon: <Code2 className="w-6 h-6 text-secondary" />,
    content: 'Built on a modern tech stack featuring React 19 for a highly responsive UI, Vite for rapid development, TailwindCSS for utility-first styling, and TanStack Query for robust data fetching. Charts are powered by Recharts, ensuring beautiful and interactive data visualization.',
  },
  {
    title: 'Research Objectives',
    icon: <LineChart className="w-6 h-6 text-accent" />,
    content: 'Our primary research goal is to identify patterns in user navigation that lead to higher retention and lower bounce rates. By granularly tracking custom events and session durations, we aim to uncover friction points within the user journey and provide actionable insights for optimization.',
  },
  {
    title: 'Architecture Overview',
    icon: <Database className="w-6 h-6 text-primary" />,
    content: 'The application employs a scalable, component-driven frontend architecture. It utilizes a centralized API service layer for backend communication, custom hooks for encapsulated business logic, and a Context-based state management approach for global themes and dashboard configurations.',
  },
  {
    title: 'Future Machine Learning Integration',
    icon: <Brain className="w-6 h-6 text-secondary" />,
    content: 'Future phases will integrate predictive analytics models to forecast user churn and recommend personalized engagement strategies. By training models on historical event logs, the platform will transition from providing descriptive analytics to actionable prescriptive insights.',
  }
];

export default function About() {
  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
          About the Platform
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Discover the technology, research, and vision driving our Intelligent User Behavior Analytics Platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sectionData.map((section, index) => (
          <Card 
            key={index} 
            className={`p-6 md:p-8 hover:shadow-md transition-shadow duration-300 ${index === sectionData.length - 1 ? 'md:col-span-2' : ''}`}
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex-shrink-0">
                {section.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {section.content}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
