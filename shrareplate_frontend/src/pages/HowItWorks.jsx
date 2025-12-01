import { motion } from "framer-motion";
import { CheckCircle, HandHeart, Users, Truck } from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER SECTION */}
      <section className="bg-green-600 text-white py-20 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold"
        >
          How SharePlate Works
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-lg max-w-2xl mx-auto"
        >
          SharePlate connects donors, volunteers, and recipients to reduce food
          waste and deliver meals to those who need them.
        </motion.p>
      </section>

      {/* STEPS SECTION */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10">

          {/* STEP 1 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-8 bg-white rounded-2xl shadow-lg text-center"
          >
            <CheckCircle className="mx-auto h-14 w-14 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">1. Donors Post Food</h3>
            <p className="text-gray-600">
              Hotels, homes, restaurants, or individuals can post leftover meals
              that are still fresh and safe to eat.
            </p>
          </motion.div>

          {/* STEP 2 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-8 bg-white rounded-2xl shadow-lg text-center"
          >
            <Users className="mx-auto h-14 w-14 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">2. Volunteers Claim Pickup</h3>
            <p className="text-gray-600">
              Verified volunteers see available donations and choose which ones
              they want to pick up.
            </p>
          </motion.div>

          {/* STEP 3 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-8 bg-white rounded-2xl shadow-lg text-center"
          >
            <Truck className="mx-auto h-14 w-14 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">3. Delivered to Recipients</h3>
            <p className="text-gray-600">
              Volunteers deliver the meals to nearby shelters, NGOs, or
              registered needy families.
            </p>
          </motion.div>
        </div>
      </section>

      {/* JOIN SECTION */}
      <section className="py-20 bg-green-600 text-white text-center">
        <h2 className="text-3xl font-bold">Start Making a Difference Today</h2>
        <p className="mt-3 mb-6">
          Donate, volunteer, or receive — SharePlate welcomes everyone.
        </p>

        <a href="/auth">
          <button className="px-8 py-3 bg-white text-green-700 font-semibold rounded-xl shadow hover:bg-gray-200">
            Join Now
          </button>
        </a>
      </section>
    </div>
  );
};

export default HowItWorks;
