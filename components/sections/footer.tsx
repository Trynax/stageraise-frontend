'use client';

import { useState } from 'react';
import Image from 'next/image';

export function Footer() {
  const [language, setLanguage] = useState('EN');

  return (
    <footer className="bg-primary border-t-2 border-gray-800">
      <div className=" px-4 sm:px-8 lg:px-32 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
         
          <div className="md:col-span-1">
            <h2 className="text-3xl font-bold mb-4">LOGO</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-6">
              A decentralized crowdfunding platform where milestones decide the money not hope.
            </p>
            

            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-12 h-12 bg-deepGreen hover:opacity-90 rounded-xl flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Image src="/icons/X.svg" alt="X" width={24} height={24} />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-deepGreen hover:opacity-90 rounded-xl flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Image src="/icons/instagram.svg" alt="Instagram" width={24} height={24} />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-deepGreen hover:opacity-90 rounded-xl flex items-center justify-center transition-colors"
                aria-label="Discord"
              >
                <Image src="/icons/discord.svg" alt="Discord" width={24} height={24} />
              </a>
            </div>
          </div>

         
          <div>
            <h3 className="font-bold text-lg mb-4">Quick link</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                  How it's works
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Fund Project
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Funds project
                </a>
              </li>
            </ul>
          </div>

    
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Terms & Condition
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Policy of use
                </a>
              </li>
            </ul>
          </div>


          <div className="flex justify-start md:justify-end">
            <div className="relative">
              <button 
                onClick={() => setLanguage(language === 'EN' ? 'ES' : 'EN')}
                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">{language}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>


        <div className="border-t border-gray-300 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Stage Raise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}