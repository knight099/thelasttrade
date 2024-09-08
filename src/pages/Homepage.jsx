/* eslint-disable no-unused-vars */
import { Appbar } from "../components/Appbar";
import { Footer } from "../components/Footer";
import { Slider } from "../components/Slider";
import { Button } from "../components/Button";

export function Homepage() {
  return (
    <>
      <Appbar />
      <Slider />

      {/* 9 Golden Rules Section */}
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            9 Golden Rules for Trading in Stock Market
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Choose the right stocks</li>
            <li>Take calculated risks</li>
            <li>Do thorough research</li>
            <li>Take expert's help</li>
            <li>Never be emotional</li>
            <li>Redressal of grievance</li>
            <li>Use Stop Loss</li>
            <li>Don't be greedy</li>
            <li>Never take decision based on rumors</li>
          </ul>
        </div>
      </section>

      {/* Notice Section */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4">Dear Investor,</h2>
          <p className="mb-4">Greetings from The Last Trade Team!!!</p>
          <p className="mb-4">
            We value your trust and want to ensure that you have the best
            possible experience with our services. Please be informed that all
            our offers, promotions, discounts, and sales-related email
            communications from The Last Trade Team will only be sent from the
            email address:
            <a
              href="mailto:helpdesk@thelasttrade.com"
              className="text-blue-500"
            >
              {" "}
              helpdesk@thelasttrade.com
            </a>
            .
          </p>
          <p className="mb-4">
            To protect yourself from potential phishing scams or fraudulent
            activities, please be cautious and only respond to emails
            originating from the specified official email address. If you have
            any doubts or concerns about the authenticity of an email, please
            reach out to our customer support number
            <a href="tel:9650690943" className="text-blue-500">
              {" "}
              9650690943
            </a>{" "}
            or email us at
            <a
              href="mailto:helpdesk@thelasttrade.com"
              className="text-blue-500"
            >
              {" "}
              helpdesk@thelasttrade.com
            </a>
            .
          </p>
          <p>Thank you for your understanding and cooperation.</p>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">What Services We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                Stock Future Services
              </h3>
              <p>
                Specialized Stock Future Intraday Service, offering 25
                profitable tips in the Stock Future segment. Pay only upon
                profitable trades. Service remains active until all 25 tips are
                delivered.
              </p>
              <Button label="Learn More" className="mt-4" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Index Option</h3>
              <p>
                20 Profitable tips in Nifty & Bank Nifty, Pay only when you make
                profits. Services remain active till 20 Profit tips are
                delivered. Start with as little as 30k to invest daily and make
                profits.
              </p>
              <Button label="Learn More" className="mt-4" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                Equity Cash Premium Services
              </h3>
              <p>
                Equity Cash Premium services offering 50 Profitable tips, Pay
                only when you make profits. Services remain active till 50
                Profit tips are delivered. Get the best share recommendation in
                this package.
              </p>
              <Button label="Learn More" className="mt-4" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                Stock Option Services
              </h3>
              <p>
                20 Profitable tips, start with as little as 30k to invest daily
                and make profits. Pay only when you make profits. Services
                remain active till 20 Profit tips are delivered.
              </p>
              <Button label="Learn More" className="mt-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Reasons to Choose Section */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">
            Best Reasons to Choose Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-4xl font-bold">15+</h3>
              <p className="text-lg">Years of Experience</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold">22k+</h3>
              <p className="text-lg">Happy Clients</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold">100%</h3>
              <p className="text-lg">Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">We're Ready, Let's Talk</h2>
          <Button label="Contact Us Now" />
        </div>
      </section>

      <Footer />
    </>
  );
}
