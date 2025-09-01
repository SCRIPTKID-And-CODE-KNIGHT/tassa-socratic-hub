import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const SchoolsResultsPage = () => {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl">
        <CardContent className="py-12 flex flex-col items-center space-y-6">
          {/* Animated Icon */}
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="flex items-center justify-center p-4 bg-primary/10 rounded-full"
          >
            <Loader2 className="h-12 w-12 text-primary" />
          </motion.div>

          {/* Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-bold text-foreground"
          >
            TASSA Results System
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-muted-foreground text-lg max-w-md"
          >
            Our results platform is currently <span className="font-semibold text-primary">under maintenance</span>.  
            We are working on improvements and it will be available soon.
          </motion.p>

          {/* Little animated dots */}
          <motion.div
            className="flex space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <motion.span
              className="w-3 h-3 bg-primary rounded-full"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
            />
            <motion.span
              className="w-3 h-3 bg-primary rounded-full"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
            />
            <motion.span
              className="w-3 h-3 bg-primary rounded-full"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
            />
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolsResultsPage;
