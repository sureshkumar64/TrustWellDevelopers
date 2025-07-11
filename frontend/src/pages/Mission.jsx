import React from 'react';
import { Sparkles, ShieldCheck, Users } from 'lucide-react';

const Mission = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20 px-6 text-center">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-5xl font-extrabold text-blue-800 leading-tight">
            About Us
          </h1>
          <p className="text-lg text-gray-700">
            <span className="text-blue-600 font-semibold">Trustwell Developers</span> is a Nagpur-based real estate firm with over 20 years of industry experience, built on strong foundations of trust, transparency, and ethics.
          </p>
          <p className="text-gray-700">
            We specialize in offering verified residential plots and flats from reputed and RERA-registered developers, ensuring that our clients always make safe and profitable decisions.
          </p>
          <p className="text-gray-700">
            Over the years, we have earned the trust of hundreds of families by guiding them through their property journey with complete legal clarity and personal attention.
          </p>
          <p className="text-gray-700">
            We believe that buying a home or land is not just a transaction — it’s a life-changing step. And we treat it with the honesty it deserves.
          </p>
          <p className="text-gray-700">
            Our mission is to make real estate in India 100% transparent and fraud-free, so that no buyer is ever cheated, and everyone gets access to genuine property options.
          </p>
          <p className="text-gray-700">
            We aim to set a new benchmark of ethics and service in the property industry — starting from Nagpur and expanding across India.
          </p>
          <p className="text-gray-700">
            From site visits to final registration, we support our clients at every step — with clarity, respect, and commitment.
          </p>
          <p className="text-gray-700">
            At Trustwell, our goal is not just to grow our business — but to grow trust in the entire real estate system.
          </p>
          <p className="text-xl font-bold text-blue-600 italic">
            "Driven by Ethics. Built for Growth." — That’s not just our tagline. That’s our promise.
          </p>
          <p className="text-gray-600">
            <strong>Your Investment, Safeguarded with Care</strong> — We understand that buying a plot or flat isn't just a property decision — it's a commitment of your savings, dreams, and trust. That’s why every listing you see through Trustwell Developers is carefully selected from verified, RERA-approved projects, ensuring legal safety and complete transparency.
            With us, you never have to worry about hidden terms, unclear documents, or unethical practices. Our goal is to protect you from risk, confusion, or fraud — and give you the confidence to move forward with clarity. At Trustwell, your investment isn’t just safe — it’s respected.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-5 bg-white px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-14">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                Icon: ShieldCheck,
                title: 'Transparency',
                description:
                  'We provide clear, accurate property details with no hidden charges or misleading claims.',
              },
              {
                Icon: Users,
                title: 'Trust',
                description:
                  'Our platform is built on long-term relationships and credibility earned through honest work.',
              },
              {
                Icon: Sparkles,
                title: 'Empowerment',
                description:
                  'We equip users with the knowledge and tools they need to make confident property decisions.',
              },
            ].map(({ Icon, title, description }, idx) => (
              <div
                key={idx}
                className="bg-blue-50 p-6 rounded-2xl shadow hover:shadow-xl transition-all border-t-4 border-blue-600"
              >
                <Icon className="text-blue-700 mb-4 mx-auto" size={36} />
                <h3 className="text-xl font-semibold text-blue-700 mb-2">{title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="bg-gray-50 py-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-10">Meet the Founder</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-20">
            <img
              src="/Founder.jpg"
              alt="Founder"
              className="rounded-xl shadow-md h-[240px] object-cover border"
            />
            <div className="text-left space-y-3 max-w-lg">
              <h3 className="text-2xl font-bold text-gray-800">Pratik Pardhi</h3>
              <p className="text-gray-600 text-sm">
                <strong>Vision</strong> — To build a future where every property transaction in India is ethical, transparent, and trusted — ensuring that every buyer, from every background, gets a clean, profitable, and stress-free real estate experience.
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Our Mission</strong> — To guide every property buyer with truth, transparency, and long-term value by partnering with responsible developers and showcasing only legally verified, RERA-approved plots and flats. We aim to create a safe and ethical real estate experience where every client invests with confidence, and every deal builds trust for life.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mission;
