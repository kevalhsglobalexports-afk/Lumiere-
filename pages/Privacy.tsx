
import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, FileText, UserCheck } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-32 space-y-20">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto text-stone-400">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-5xl font-serif">Your Privacy</h1>
        <p className="text-stone-500 font-light italic">Last updated: October 2024</p>
      </div>

      <div className="prose prose-stone max-w-none space-y-16">
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-amber-600">
            <Eye className="w-6 h-6" />
            <h2 className="text-2xl font-serif m-0">Information Transparency</h2>
          </div>
          <p className="text-stone-600 font-light leading-relaxed text-lg">
            At Lumière Essence, we believe your data is as personal as your skin. 
            We only collect information that enhances your ritual—shipping details, order history, 
            and AI consultation results to provide personalized botanical advice.
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4 text-amber-600">
            <FileText className="w-6 h-6" />
            <h2 className="text-2xl font-serif m-0">Data Usage & Protection</h2>
          </div>
          <div className="bg-stone-50 rounded-[2rem] p-8 space-y-4">
            <p className="text-stone-600 font-light leading-relaxed">
              We employ industry-leading AES-256 encryption to protect your sensitive data. 
              We never sell your personal information to third-party brokers. 
              Your skin concerns shared with our AI Consultant are used solely to improve 
              recommendations and are anonymized in our systems.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4 text-amber-600">
            <UserCheck className="w-6 h-6" />
            <h2 className="text-2xl font-serif m-0">Your Rights</h2>
          </div>
          <ul className="space-y-4 list-none p-0">
            {[
              "The right to access and export your personal data.",
              "The right to request immediate deletion of all ritual history.",
              "The right to opt-out of all non-essential marketing communications.",
              "The right to correct any inaccuracies in your profile."
            ].map((right, i) => (
              <li key={i} className="flex gap-4 items-start text-stone-600 font-light">
                <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  {i + 1}
                </span>
                {right}
              </li>
            ))}
          </ul>
        </section>

        <div className="bg-amber-50 rounded-[3rem] p-12 text-center space-y-6">
          <h3 className="text-2xl font-serif">Have questions about your data?</h3>
          <p className="text-stone-500 font-light">Our Data Protection Officer is available to discuss our privacy practices.</p>
          <a href="mailto:privacy@lumiere.essence" className="inline-block text-amber-600 font-bold border-b-2 border-amber-600 pb-1 hover:text-amber-700 transition-colors">
            Contact Privacy Concierge
          </a>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
